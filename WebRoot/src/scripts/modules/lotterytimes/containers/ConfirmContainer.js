import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import ConfirmItem from '../components/ConfirmItem';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert, confirm} from '../../../utils/popup';

import {cancelOrder, 
  saveOrder, 
  loadOpenInfo,
  cleanOrder as actionCleanOrder, 
  submitOrder as actionSubmitOrder} from '../actions/LotteryAction';

import {randOrderFunction, getSummaryTotal, formatPrice, rxShouldRendeAndDefaultPos} from '../utils/Lottery';

class ConfirmContainer extends Component {

  constructor(props) {
    super(props);

    this.goCharse = this.goCharse.bind(this);
    this.handleOrderDelete = this.handleOrderDelete.bind(this);
    this.randOrder = this.randOrder.bind(this);
    this.randFiveOrder = this.randFiveOrder.bind(this);
    this.cleanOrder = this.cleanOrder.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
  }

  goCharse() {
    const {history, match, lottery} = this.props;
    if (lottery.get('selectedOrder').length > 1) {
      return alert('对不起 暂时只支持一单进行追号');
    }
    let canTrace = lottery.get('canTrace');
    if (!canTrace) {
      return ;
    }
    history.push(`/lotterytimes/chase`);
  }

  handleOrderDelete(orderId){
    const {dispatch} = this.props;
    dispatch(cancelOrder(orderId));
  }

  randOrder() {
    const {lottery, dispatch} = this.props;
    // 用最后一次下注的注单来随机生成注单
    let lastOrder = lottery.get('lastSelectOrder');
    if (lastOrder) {
      let num = randOrderFunction(lastOrder.lottery, lastOrder.gameCode)();
      let [shouldRende, _] = rxShouldRendeAndDefaultPos( lastOrder.gameCode);
      // 对号码降维 [ [1,2,3 ]] -> [1,2,3]
      if (num.length == 1 && typeof num[0] == 'object') {
        num = num[0];
      } else {
        if (shouldRende) {
          num = [num[0], num[1][0]];
        }
      }
      let summary = getSummaryTotal(lastOrder.lottery, lastOrder.gameCode, num);
      
      dispatch(saveOrder(lastOrder.lottery, 
        lastOrder.gameCode, 
        summary.format, 
        summary.length, 
        lastOrder.bs,
        lastOrder.unit,
        lastOrder.bonusType
      ));
    }
  }

  submitOrder() {
    const {dispatch, history, lottery} = this.props;
    let lastOrder = lottery.get('lastSelectOrder');
    console.log(['lastOrder', lastOrder]);
    if (this.processing) {
      alert('订单正在处理中');
      return ;
    }
    this.processing = true;
    dispatch(actionSubmitOrder((data) => {
      if (data.errorCode == RES_OK_CODE) {
        alert('下注成功', (popup) => {
          this.processing = false;
          popup.close();
          dispatch(actionCleanOrder());
          history.goBack();
        });
      } else {
        if (data.errorCode == '400003' || data.errorCode == '400004') {
          dispatch(loadOpenInfo(lastOrder.lottery));
        }
        this.processing = false;
        alert(data.msg);
      }
    }));
  }

  randFiveOrder() {
    for (let i = 0; i < 5; i++) {
      this.randOrder();
    }
  }

  cleanOrder() {
    const {dispatch} = this.props;
    dispatch(actionCleanOrder());
  }
  
  renderQuickActions() {
    const {history} = this.props;
    return <ul className="quick-actions clearfix">
      <li>
        <a onClick={ () => {history.goBack()}}><img src="/misc/images/tlottery/plus-select-num.png" alt=""/>继续选号</a>
      </li>
      <li>
        <a onClick={this.randOrder}><img src="/misc/images/tlottery/plus-select-num.png" alt=""/>机选一号</a>
      </li>
      <li>
        <a onClick={ this.randFiveOrder }><img src="/misc/images/tlottery/plus-select-num.png" alt=""/>机选五注</a>
      </li>
      <li>
        <a onClick={ this.cleanOrder }><img src="/misc/images/tlottery/del-num.png" alt=""/>清除列表</a>
      </li>
    </ul>
  }

  renderConfirmActions() {
    const {history, lottery} = this.props;
    let orders = lottery.get('selectedOrder');
    
    let totalMoney = 0;
    let totalZhushu = 0;
    for (let order of orders) {
      totalMoney += order.bs * order.unit.value * order.zhushu;
      totalZhushu += order.zhushu;
    }

    return (
      <div className="foot-wrap">
  
        <div className="actions">
          <button className={"btn-random " + (  ({true: '', false: 'disabled'})[lottery.get('canTrace')] ) } onClick={this.goCharse}>智能追号</button>
          <p className="confirm-summary">
            <span className="orange">{formatPrice(totalMoney)}元</span>
            <span>共{totalZhushu}注</span>
          </p>
          <button className="btn-submit" onClick={ this.submitOrder }>付款</button>
        </div>

      </div>
    );
  }

  backLink() {
    const {history, lottery} = this.props;
    let selectedOrder = lottery.get('selectedOrder');

    let cleanOrSimpleBack = () => {
      if (selectedOrder.length > 0) {
        confirm("退出该页面将会清空购彩篮里的数据,是否将已选的号码保存在号码篮内?", '提示',  (popup) => {
          popup.close();
          history.goBack();
        });
      } else {
        history.goBack();
      }
      
    }
    return <a onClick={cleanOrSimpleBack}></a>
  }

  render() {
    const {lottery} = this.props;
    let selectedOrder = lottery.get('selectedOrder');
    let lastSelectOrder = lottery.get('lastSelectOrder');
    let lotteryCode = lastSelectOrder ? lastSelectOrder.lottery : '';
    return (
      <div className="page tlottery-confirm-page">
        
        <Header className="tlottery-header" {...this.props}>
          {this.backLink()}
          <h3>{lottery.get('config')[lotteryCode] && lottery.get('config')[lotteryCode]['menuName']}投注</h3>
        </Header>

        <div className="page-body">
          {this.renderQuickActions()}
          <div className="confirm-items">
            {selectedOrder.map( (order, index) => {
              order.id = index;
              return <ConfirmItem deleteCb={this.handleOrderDelete} key={index} order={order}/>
            })}
          </div>
          {this.renderConfirmActions()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({lotteryTimes, userModule, app}) {
  return {
    lottery: lotteryTimes.lottery,
    app,
    userModule,
  };
}

export default withRouter(connect(mapStateToProps)(ConfirmContainer));