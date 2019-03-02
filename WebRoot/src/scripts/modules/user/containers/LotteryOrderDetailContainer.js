import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

import {withRouter} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';
import {cancelLotteryOrder, loadLotteryOrderDetail} from '../actions/UserOrder';
import {parseQuery} from '../../../utils/url';
import {alert} from '../../../utils/popup';
import PTR from '../../../utils/pulltorefresh';

import LoadingComponent from '../../../components/LoadingComponent';

class LotteryOrderDetailContainer extends Component {

  constructor(props) {
    super(props);

    this.cancelOrder = this.cancelOrder.bind(this);
  }

  componentWillMount() {
    const {dispatch, match} = this.props;
    dispatch(loadLotteryOrderDetail(match.params.id));
  }

  componentDidMount(){
    bodyClass('chase-body');
  }

  componentWillUnmount() {
    resetBodyClass();
    this.setupPullToRefresh(true);
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillReceiveProps(nextProps) {
    const {orderDetail, history} = nextProps;
    if (orderDetail.error){
      history.goBack();
    }
  } 

  setupPullToRefresh(destroy = false) {
    const {dispatch, match} = this.props;
    let self = this;
    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.top-detail',
      refreshHandler({close, handler}) {
        dispatch(loadLotteryOrderDetail(match.params.id, () => {
          close();
        }));
      }
    });
  }

  cancelOrder() {
    const {dispatch, match} = this.props;
    if (this.procces) return;
    this.procces = true;
    dispatch(cancelLotteryOrder(match.params.id, data => {
      
      dispatch(loadLotteryOrderDetail(match.params.id, () => {
        this.procces = false;
      }));

      alert(data.msg, popup => {
        popup.close();
        
      });
    }));
  }

  render() {
    const {orderDetail} = this.props;
    return (
      <div className="page lottery-order-detail-page">
        <Header {...this.props}>
          <Back />
          <h3>投注详情</h3>
        </Header>
        
        <div className="page-body">
          <div className="top-detail">
            <div className="desc">
              <img src={orderDetail.logo} alt=""/>
              <h4>{orderDetail.lotteryName}</h4>
              <span>第{orderDetail.betQishu}期</span>
            </div>
            <div className="status-desc">
              <div className="l">
                <div className="wrap">
                  <span>投注金额</span>
                  <span className="red">{orderDetail.betMoney}</span>
                </div>
              </div>
              <div className="l">
                <div className="wrap">
                  <span>中奖金额</span>
                  <span className="red">{orderDetail.status}</span>
                </div>
              </div>
              <div className="l">
                <div className="wrap">
                  <span>返点金额</span>
                  <span className="red">{orderDetail.betBack}</span>
                </div>
              </div>
            </div>
          </div>
        
          <div className="order-details">
            
            <div className="detail-item">
              <h4>
                <div className="wrap">订单信息</div>
              </h4>
              <div className="desc">
                <div className="wrap">
                  <span>状态</span>
                  <span className="red">{orderDetail.betStatus}</span>
                </div>
              </div>
              <div className="desc">
                <div className="wrap">
                  <span>开奖号码</span>
                  <span className="red">{orderDetail.winNumber}</span>
                </div>
              </div>
            </div>

            <div className="detail-item">
              <h4><div className="wrap">选号详情: {orderDetail.noteNuber}注{orderDetail.multipe}倍</div></h4>
              <div className="desc">
                <div className="wrap">
                  <span>玩法:{orderDetail.gameName} <br/> {orderDetail.content}</span>
                </div>
              </div>
            </div>

            <div className="detail-item">
              <h4><div className="wrap">订单备注</div></h4>
              <div className="desc">
                <div className="wrap">
                  <ul>
                    <li>投注时间: {orderDetail.betTime}</li>
                    <li>方案编号: {orderDetail.schemeNumbe}</li>
                    <li>模式: {orderDetail.remarks}</li>
                    <li>奖金类型: {orderDetail.model}</li>
                  </ul>
                </div>
              </div>
            </div>

            { ( orderDetail.betStatusValue == 0 || orderDetail.betStatusValue == -1 ) &&   <div className="btn-wrap">
              <button onClick={this.cancelOrder} className="btn btn-orange">撤单</button>
            </div> }

          </div>

        </div>

      </div>
    );
  }

};

LotteryOrderDetailContainer.propTypes = {
  
};

LotteryOrderDetailContainer.defaultProps = {
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    orderDetail: userModule.order.get('lotteryOrderDetail'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryOrderDetailContainer));