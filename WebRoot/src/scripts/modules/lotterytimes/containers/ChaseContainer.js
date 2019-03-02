import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LotteryTimer from '../components/LotteryTimer';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';
import Checkbox from '../components/Checkbox';
import ChaseTabs from '../components/ChaseTabs';
import ChaseFbbsTable from '../components/ChaseFbbsTable';
import ChaseSameBsTable from '../components/ChaseSameBsTable';
import ChaseLrbsTable from '../components/ChaseLrbsTable';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import {BONUS_GAOFAN, BONUS_GAOJIANG} from '../constants/LotteryConstant';

import {alert} from '../../../utils/popup';
import {formatPrice} from '../utils/Lottery';

import {getChaseQs, generateChaseQs, cleanChaseQs,
  cleanOrder as actionCleanOrder, 
  loadOpenInfo,
  submitOrder as actionSubmitOrder} from '../actions/LotteryAction';

let Colon = React.createClass({
  render() {
    return <span style={ {margin: '0px 5px'} }>:</span>;
  }
});

class ChaseContainer extends Component {

  constructor(props) {
    super(props);
    this.tabs = [{
      tb: '同倍追号'
    }, {
      lrl: '利润率追号'
    }, {
      fb: '翻倍追号',
    }];

    this.tables = {
      tb: ChaseSameBsTable,
      fb: ChaseFbbsTable,
      lrl: ChaseLrbsTable
    };

    this.onTimeoutFinish = this.onTimeoutFinish.bind(this);
    this.onTabClickHandle = this.onTabClickHandle.bind(this);
    this.generateChaseItems = this.generateChaseItems.bind(this);
    this.onStopChaseWhenWin = this.onStopChaseWhenWin.bind(this);
    this.onItemSelectChange = this.onItemSelectChange.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.showTheBetNumber = this.showTheBetNumber.bind(this);
    this.onBackLink = this.onBackLink.bind(this);
    
    // 中奖后停止追号
    this.stopChaseWin = true;

    this.state = {
      chaseTable: ChaseSameBsTable,
    };
  }

  componentDidMount() {
    bodyClass('chase-body');
  }

  componentWillMount() {
    const {dispatch, lottery} = this.props;
    const lastSelectOrder = lottery.get('lastSelectOrder');
    if (lastSelectOrder) {
      dispatch(loadOpenInfo(lastSelectOrder.lottery, lastSelectOrder.gameCode));
    }
  }

  componentWillUnmount() {
    resetBodyClass('chase-body');
  }

  getActiveGroupConfigData(props, activeLottery, activeGroup) {
    let lottery = props.lottery.get('config')[activeLottery];
    for (let item of lottery.gameList) {
      for (let iitem of  item.list) {
        if (iitem.gameCode == activeGroup) {
          return iitem;
        }
      }
    }
  }

  generateChaseItems(data) {
    const {lottery, dispatch, history} = this.props;
    let lastSelectOrder = lottery.get('lastSelectOrder');
    let details = this.getActiveGroupConfigData(this.props, lastSelectOrder.lottery, lastSelectOrder.gameCode);
    let detail = details.detail;
    
    if (!lastSelectOrder) {
      return alert('请先选择号码');
    }

    let profit = 0;
    if (lastSelectOrder.bonusType == BONUS_GAOJIANG) {
      profit = detail.gjjMoney;
    } else {
      profit = detail.gfdMoney;
    }
    profit = profit * ( lastSelectOrder.unit.value / 2);


    let lotteryCode = lastSelectOrder.lottery;
    let gameCode = lastSelectOrder.gameCode;

    // 翻倍或同倍
    let count = data.count; // 追多少期
    let multiple = data.bs; // 倍数 (翻倍为起始倍数)
    let step = data.step; // 翻倍累加值
    let append = data.append; // 翻倍多少期累加
    let lrv = data.lrv; // 利润率追号
    let zhushu = lastSelectOrder.zhushu;

    // 利润率追号先生成倍数
    // count: 追号期数
    // profit: 一倍情况下的每注盈利
    // hasCostPrice: 前面追号已支出的款
    // price: 一次追号不翻倍情况下的价格 ( = 单价 * 注数 )
    // lrv: 最低利润率要求
    function generateLrvBs(count, profit, hasCostPrice, price, lrv) {
        let _bs = 1;
        let maxBs = details.multipleMax;
        while (true ) {
          let _real_lrv = Math.floor( ( ( ( profit * _bs - hasCostPrice - price * _bs )  / ( hasCostPrice + price * _bs)   ) * 100 ) * 100 , 2) / 100 ;
            // 利润率符合要求则停止循环
          if (_real_lrv >= lrv || _bs > maxBs + 1) {
            break;
          }
          _bs ++;
        }
        if (count == 1) {
          return [_bs];
        }
        count --;
        let _left_bs_array = generateLrvBs(count, profit, _bs * price + hasCostPrice, price, lrv);

        _left_bs_array.unshift(_bs);

        return _left_bs_array;
    }

    let nextBs = (crtIndex) => {
      if (step && append) {
        console.log([step, append, crtIndex % append]);
        if (crtIndex > 0 && crtIndex % step == 0) {
          multiple = append * multiple;
        }
      }
      return multiple;
    }

    function paddedZero(num, len) {
      let zero = [];
      for (let i = 0; i < len; i++) {
        zero.push(0);
      }
      zero = zero.join('');
      num = num + '';
      return zero.substring(num.length, len) + num;
    }

    dispatch(getChaseQs({
      count,
      multiple,
      lotteryCode,
      gameCode,
    }, (data) => {
      if (data.errorCode != RES_OK_CODE) {
        alert(data.msg);
      } else {
        let qsItems = data.datas.resultList;

        //let profit = 200; // 收益暂时写死
        let viewQsItems = [];
        let price = lastSelectOrder.unit.value * lastSelectOrder.zhushu; // 单价 * 注数  
        let crtIndex = 0;
        let zhushu = lastSelectOrder.zhushu;
      
        // 利润率追号
        if (lrv) {
          
          let lrvBsarr = generateLrvBs(qsItems.length, profit, 0, price, lrv);

          let totalPrice = 0;
          for (let bs of lrvBsarr) {

            totalPrice += price * bs;
            let item = qsItems[crtIndex];

            viewQsItems.push({
              index: paddedZero( crtIndex + 1 , 2 ), // 序号
              qs: item.qsFormat, // 期号
              lqs: item.qs, // 长期数
              bs, // 倍数
              zhushu, // 注数
              price: price, // 该注单价
              cost: totalPrice, // 投注金额
              //openTime: item.openTime, // 开奖时间
              sprofit: profit, // 单注盈利
              profit: profit * bs - totalPrice, // 总盈利
              ylv: Math.floor( ( ( ( profit * bs - totalPrice ) / totalPrice ) * 100 ) ), // 总盈利率
            });
            
            zhushu += lastSelectOrder.zhushu;
            crtIndex ++;

          }

        } else {
          
          // 翻倍同倍追号
          let totalPrice = 0;
          for (let item of qsItems) {
            let bs = nextBs(crtIndex);
          
            totalPrice += price * bs;

            viewQsItems.push({
              index: paddedZero( crtIndex + 1 , 2 ), // 序号
              qs: item.qsFormat, // 期号,
              lqs: item.qs, // 长期数
              bs, // 倍数
              zhushu, // 注数
              price: price, // 该注所需费用价格
              cost: totalPrice, // 投注金额
              //openTime: item.openTime, // 开奖时间
              sprofit: profit, // 单注盈利
              profit: profit * bs - totalPrice, // 盈利
              ylv: Math.floor( ( ( ( profit * bs - totalPrice ) / totalPrice ) * 100 ), 0 ), // 总盈利率
            });
            
            zhushu += lastSelectOrder.zhushu;
            crtIndex ++;
            
          }

        }

        let maxBs = details.multipleMax; //  最大倍数
        console.log([viewQsItems, viewQsItems[viewQsItems.length - 1].bs, details, maxBs]);
        if (viewQsItems[viewQsItems.length - 1].bs > maxBs) {
          return alert('订单追号倍数超过限制');
        }

        dispatch(generateChaseQs(viewQsItems));
      }
    }));
  }

  onItemSelectChange(chaseItems) {
    const {dispatch} = this.props;

    // 重新计算盈利率
    let totalPrice = 0;
    let cancelTotalPrice = 0;
    for (let item of chaseItems) {

      totalPrice += item.price * item.bs;

      if ( typeof item.checked != 'undefined' && !item.checked ) {
          
        cancelTotalPrice += item.price * item.bs;
      
      } else {
        item.cost = totalPrice - cancelTotalPrice;
      }
      
      item.profit = item.sprofit * item.bs;
      item.ylv = Math.floor( ( ( ( item.profit - totalPrice ) / totalPrice ) * 100 ) ) ;
    }

    dispatch(generateChaseQs(chaseItems.clone()));
  }

  onStopChaseWhenWin(checked) {
    this.stopChaseWin = checked;
  }

  renderMakePlanActions() {
    const {history} = this.props;
    let summary = this.calculateSummary();
    return (
      <div className="foot-wrap">
        
        <div className="actions actions-stop-charse">
          <Checkbox defaultChecked={this.stopChaseWin} id="stopChaseWin" onChange={this.onStopChaseWhenWin}/>
          <span>中奖后停止追号</span>
        </div>

        <div className="actions">
          <button className="btn-random" onClick={ () => {history.goBack()} }>取消</button>
          <p className="confirm-summary">
            <span className="orange">共{ formatPrice( summary.total )}元</span>
            <span className="sq">追{summary.qsCount}期</span>
          </p>
          <button className="btn-submit" onClick={this.submitOrder}>确认投注</button>
        </div>

      </div>
    );
  }

  submitOrder() {
    const {dispatch, history, lottery} = this.props;
    let crtInfo = lottery.get('crtInfo');
    if (crtInfo.msg) {
      return alert(crtInfo.msg);
    }
    let lastSelectOrder = lottery.get('lastSelectOrder');
    if (this.processing) {
      alert('订单正在处理中');
      return ;
    }
    this.processing = true;
    dispatch(actionSubmitOrder((data) => {
      this.processing = false;
      if (data.errorCode == RES_OK_CODE) {
        alert('下注成功', () => {
          dispatch(actionCleanOrder());
          history.push('/lotterytimes/play?lottery=' + lastSelectOrder.lottery);
        });
      } else {
        if (data.errorCode == '400003' || data.errorCode == '400004') {
          dispatch(loadOpenInfo(lastSelectOrder.lottery));
        }
        alert(data.msg);
      }
    }, 1, this.stopChaseWin *1 ));
  }
  
  // 计算追号汇总数据
  calculateSummary() {
    const {lottery} = this.props;
    let chaseItems = lottery.get('chaseQs');
    let summary = {
      qsCount: 0,
      total: 0,
    };
    if (chaseItems) {
      for (let item of chaseItems) {
        if (item.checked || typeof item.checked == 'undefined') {
          summary.qsCount ++;
          summary.total += item.price * item.bs;
        }
      }
    }

    return summary;
  }

  onTimeoutFinish() {
    const {dispatch, lottery} = this.props;
    const lastSelectOrder = lottery.get('lastSelectOrder');
    if (lastSelectOrder) {
      let crtInfo = lottery.get('crtInfo');
      dispatch(loadOpenInfo(lastSelectOrder.lottery, lastSelectOrder.gameCode));
      alert(`${crtInfo['crtFullQs']}已截至,清注意期数变化`, (popup) => {
        popup.close();
      });
    }
  }

  onTabClickHandle(key, name) {
    this.setState({
      chaseTable: this.tables[key],
    });

    const {dispatch} = this.props;
    dispatch(generateChaseQs([]));
  }

  showTheBetNumber() {
    const {lottery} = this.props;
    let lastSelectOrder = lottery.get('lastSelectOrder');
    alert(<p>{lastSelectOrder.num.full}</p>);
  }

  onBackLink() {
    const {dispatch, history} = this.props;
    dispatch(cleanChaseQs());
    history.goBack();
  }

  render() {
    const crtInfo = this.props.lotteryTimes.lottery.get('crtInfo');
    const {lottery} = this.props;
    let chaseQs = lottery.get('chaseQs');
    let lastSelectOrder = lottery.get('lastSelectOrder');

    return (
      <div className="page page-chase-page">
        <Header className="tlottery-header" {...this.props}>
          <a onClick={this.onBackLink} />
          <h3>智能追号</h3>
        </Header>
        <div className="page-body">
          <h3 className="open-info">
            <div className="timer-wrap">
              {crtInfo.msg ? <span>{crtInfo.msg}</span> : <span>距{crtInfo.crtQs}期截止{Colon}<LotteryTimer second={crtInfo.leftSecond} onFinish={this.onTimeoutFinish}></LotteryTimer></span> }
            </div>
            <div className="hm-link-wrap">
              <a onClick={this.showTheBetNumber}>投注号码 > </a>
            </div>
          </h3>

          <ChaseTabs tabs={this.tabs} onClick={this.onTabClickHandle}/>
          
          <this.state.chaseTable 
            onItemSelectChange={this.onItemSelectChange} 
            chaseItems={chaseQs} 
            defaultBs={lastSelectOrder && lastSelectOrder.bs + ""}
            onChaseClick={this.generateChaseItems}/>

          {this.renderMakePlanActions()}

        </div>
      </div>
    );
  }
};

function mapStateToProps({lotteryTimes, userModule, app}) {
  return {
    lotteryTimes,
    lottery: lotteryTimes.lottery,
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(ChaseContainer));