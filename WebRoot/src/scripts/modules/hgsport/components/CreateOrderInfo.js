import React, {Component, PropTypes} from 'react';

import {withRouter} from 'react-router-dom';

import {saveOrder, deleteOrder as deleteOrderAction, resetTempSelectedOrder} from '../actions/HgActionPart';
import {parseQuery} from '../../../utils/url';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';

class CreateOrderInfo extends Component{
  
  constructor(props) {
    super(props);
    this.state = {
      price: '',
      winPrice: 0
    };
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onSaveOrder = this.onSaveOrder.bind(this);
    this.onProcess = false;

    const {location} = this.props;
    this.query = parseQuery(location.search);
    this.getGGOdds = this.getGGOdds.bind(this);
  }

  getGGOdds() {
    const {details} = this.props;
    let odds = 1;
    // 总和过关 赔率计算
    if ( this.query.rType == 'p3'  || this.query.rType == 'bk_p3' ) {
      for (let tmp of details) {
        odds = odds * tmp.data.datas.odds;
      }
    }

    return odds.toFixed(2);
  }

  onPriceChange() {
    const {details} = this.props;
    let detail = (details[0] && details[0]['data']['datas']) || {};
    let price = this.refs.price.value;
    let odds = detail.odds;
    let minPrice = detail.minPrice;
    let maxPrice = detail.maxPrice;
    if (price > maxPrice) {
      price = maxPrice;
      this.refs.price.value = price;
    }
    
    // 单式 / 总和过关 赔率判断
    // if (( this.query.rType == 'r' || this.query.rType == 'p3' )) {
    //   if ( ( detail.bType == "单双" || detail.bType == "独赢" ) && odds > 1 ) {
    //     odds = odds - 1;
    //   }
    // } else if (odds > 1) {
    //   odds = odds - 1;
    // }

    if (detail.bType == '独赢') {
      odds -= 1;
    } else if (detail.bType == '单双') {
      odds -= 1;
    } else if (this.query.rType == 'pd' ) {
      odds -= 1;
    } else if (this.query.rType == 'hpd') {
      odds -= 1;
    } else if (this.query.rType == 't') {
      odds -= 1;
    } else if (this.query.rType == 'f') {
      odds -= 1;
    }

    // 总和过关 赔率计算
    if ( this.query.rType == 'p3'  || this.query.rType == 'bk_p3' ) {
      odds = this.getGGOdds() - 1;
    }

    if (price >= minPrice) {
      this.setState({
        price: price,
        odds,
        winPrice: (price * odds).toFixed(2)
      });
    } else {
      this.setState({
        winPrice: 0,
        odds,
      });
    }
  }

  onSaveOrder() {
    if (this.onProcess) {
      return ;
    }
    this.onProcess = true;
    const {details} = this.props;
    let price = this.refs.price.value;
    let firstDetail = (details[0] && details[0]['data']['datas']) || {};
    let minPrice = firstDetail.minPrice;
    let maxPrice = firstDetail.maxPrice;
    if (price < minPrice || price > maxPrice) {
      alert(`单注最低${minPrice}元，单注最高${maxPrice}元`); 
      this.onProcess = false;
    } else {
      const {dispatch, location, userModule, history} = this.props;
      let _this = this;

      let postData = {};
      
      // 串关的处理
      if ( ( this.query.rType == 'p3'  || this.query.rType == 'bk_p3' ) ) {
        if (details.length < 3) {
          alert('串关至少选择3个赛事');
          _this.onProcess = false;
          return ;
        } else {

          // 生成p3 数据
          let p3Params = [];
          for (let item of details)  {
            p3Params.push({
              gid: item.query.gid,
              btype: item.query.bType,
              dtype: item.query.dType,
              selection: item.query.selection,
              period: item.query.period
            });
          }

          postData.timeType = details[0].query.timeType;
          postData.rType = details[0].query.rType;
          postData.money = price;
          postData.p3Params = JSON.stringify(p3Params);

        }
      } else {
        // 单注下注
        postData = details[0].query;
        postData.money = price;
      }
      
      dispatch(saveOrder(postData, (data) => {
        _this.onProcess = false;
        if (data.errorCode != RES_OK_CODE) {
          alert(data.msg);
        } else {
          alert(data.msg, (popup) => {
            dispatch(resetTempSelectedOrder());
            popup.close();
            history.goBack();
          });
        }
      }));

    }
  }

  deleteOrder(order) {
    const {dispatch} = this.props;
    dispatch(deleteOrderAction(order));
  }

  render() {
    const {details, hgsport} = this.props;
    let _this = this;
    let firstDetail = (details[0] && details[0]['data']['datas']) || {};
    let queryRtype = this.query.rType;
    let timeType = this.query.timeType;
    let ballTypes = hgsport.huangguan.get('ballTypes');
    let timeTypeLabel = '滚球';
    if (timeType == 'today') {
      timeTypeLabel = '今日';
    } else if (timeType == 'tom') {
      timeTypeLabel = '早盘';
    }
    let getRTypeLabel = () => {
      let label = [];
      for (let detail of details) {
        label = [detail.data.datas.ballType, detail.data.datas.timeType];
      }
      return label.join('-');
    }
    
    return (
      <div className="order-create-info">
        <h3 className="form-order-title">{getRTypeLabel()}</h3>
        {details.map((order, index) => {
          let detail = order.data.datas;
          let query = order.query;
          return ( <div className="order-info-panel" key={index}>
            <span onClick={this.deleteOrder.bind(_this, order)} className="btn btn-delete"></span>
            <div className="title">{detail.league}</div>
            <div className="inner-content">
              <div className="row"> 
                { query.bType == 'f' && <span>{detail.period}</span> } 
                { query.bType == 'rf' && <span>{detail.bType}</span>}
                { query.bType == 't' && <span>总入球</span>  }
                { query.bType != 't' && query.bType == 'dx' && ( query.rType == 'bk_p3' || query.rType == 'bk_r_main' ) && <span>{detail.bType}</span> }
                { query.bType != 't' && query.bType != 'f' && query.bType != 'rf' && !( query.bType == 'dx' && ( query.rType == 'bk_p3' || query.rType == 'bk_r_main' ) ) && <span>{detail.bType} - <span className="red">{detail.period}</span></span> } 
              </div>
              <div className="row">{detail.team1} <span className="red">{detail.ratioH}</span> <span className="red">VS</span> {detail.team2}  <span className="red">{detail.ratioC}</span></div>
              <div className="title">

              <span className="red">{detail.selection}</span> 
               @<span className="red"> {detail.odds}</span> </div>
            </div>
          </div>);
        })}
        { ! ( details.length < 3 && ( this.query.rType == 'p3'  || this.query.rType == 'bk_p3' ) ) &&  
        <div className="order-info-panel">
          <div className="inner-content">
            <div className="form-label">下注金额<input onChange={this.onPriceChange} ref="price" type="number" placeholder="输入下注金额"/></div>
            
            <div className="form-label">
              {( this.query.rType == 'p3'  || this.query.rType == 'bk_p3' ) && <span>串关信息: <span className="red">{this.getGGOdds()}</span></span>}
            </div>

            <div className="form-label">可赢金额: <span className="red">{this.state.winPrice}元</span></div>
            <div className="form-tip"><span>单注最低{firstDetail.minPrice}元</span><span>单注最高{firstDetail.maxPrice}元</span></div>
          </div>
        </div> }

        { ! ( details.length < 3 && ( this.query.rType == 'p3'  || this.query.rType == 'bk_p3' ) ) &&  
          <div className={( this.query.rType == 'p3'  || this.query.rType == 'bk_p3' ) ? "btn-wrap-more-orders": "btn-wrap" }>
            <button className="btn btn-hg" onClick={this.onSaveOrder}>确认投注</button>
          </div>
        }
      </div>
    );
  }
};

CreateOrderInfo.propTypes = {
  details: PropTypes.array.isRequired
};

export default withRouter(CreateOrderInfo);