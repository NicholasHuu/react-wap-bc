import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {alert} from '../../../utils/popup';
import Back from '../../../components/Back';
import Header from '../../../components/Header';

import {bodyClass, resetBodyClass} from '../../../actions/AppAction';
import {loadLotteryTraceDetail, stopTrace, cancelLotteryOrder} from '../actions/UserOrder';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import PTR from '../../../utils/pulltorefresh';

class LotteryTraceDetailContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.cancelOrder = this.cancelOrder.bind(this);
    this.onStopTrace = this.onStopTrace.bind(this);
    this.viewOrderDetail = this.viewOrderDetail.bind(this);
  }

  componentWillMount() {
    bodyClass('chase-body');
    this.loadDetail();
  }

  componentWillReceiveProps(nextProps) {
    const {traceDetail} = nextProps;
    if (Object.keys(traceDetail.appendLottery).length > 0 ) {
      this.closeLoading();
    }
  }
  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;
    let self = this;
    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.page-body-inner',
      refreshHandler({close, handler}) {
        self.loadDetail(() => {
          close();
        });
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    resetBodyClass();
    this.setupPullToRefresh(true);
  }

  loadDetail(cb = () => {}) {
    const {match, dispatch} = this.props;
    dispatch(loadLotteryTraceDetail(match.params.id, match.params.number, cb));
  }

  cancelOrder(item) {
    const {dispatch, match} = this.props;
    if (this.process) return;
    this.process = true;
    this.openLoading();
    dispatch(cancelLotteryOrder(item.id, data => {
      this.process = false;
      this.loadDetail(() => {
        this.closeLoading();
        alert(data.msg, popup => {
          popup.close();
        });
      });
    }));
  }

  viewOrderDetail(item) {
    const {history} = this.props;
    history.push(`/user/lotteryorder/${item.id}`);
  }

  onStopTrace() {
    const {match, dispatch} = this.props;
    if (this.process) return ;
    this.process = true;
    this.openLoading();
    dispatch(stopTrace(match.params.number, data => {
      this.process = false;
      this.closeLoading();
      alert(data.msg, popup => {
        this.loadDetail();
        popup.close();
      });
    }));
  }

  render() {
    
    const {traceDetail} = this.props;

    return (
      <div className="page page-lottery-trace-detail">
        
        <Header {...this.props}>
          <Back />
          <h3>追号详情</h3>
        </Header>
  
        <div className="page-body">

          <div className="page-body-inner">
            <div className="top-detail">
                <div className="desc">
                  <div className="wrap">
                    <div className="tdi">
                      <img src={traceDetail.appendLottery.logo} alt=""/>
                      <div className="ld">
                        <h3>{traceDetail.appendLottery.lotteryName}</h3>
                        <h4><p>{traceDetail.appendLottery.currentGameName}</p></h4>
                      </div>
                    </div>

                    <div className="tdi">
                      <p>已追号金额</p>
                      <p>{traceDetail.appendLottery.traceMoney}</p>
                    </div>
                    <div className="tdi">
                      <p>已获金额</p>
                      <p>{traceDetail.appendLottery.winMoney}</p>
                    </div>
                  </div>
                </div>
            </div>

            <div className="order-details">
              
              <div className="detail-item">
                <h4>
                  <div className="wrap">基本信息</div>
                </h4>
                <div className="desc">
                  <div className="wrap">
                    <ul>
                      <li>
                        <span>起始期号: </span>
                        <span>{traceDetail.appendLottery.startBetQishu}</span>
                      </li>
                      <li>
                        <span>进度:</span>
                        <span>{traceDetail.appendLottery.jingDu} </span>
                      </li>
                      <li>
                        <span>终止追号条件:</span>
                        <span>{traceDetail.appendLottery.stopCondition}</span>
                      </li>
                      <li><span>追号时间:</span><span>{traceDetail.appendLottery.traceTime}</span></li>
                      <li>
                        <span>追号编号:</span>
                        <span>{traceDetail.appendLottery.traceNumber}</span>
                      </li>
                    </ul>

                  </div>
                </div>
              
                <div className="detail-item">
                  <h4>
                    <div className="wrap">追号方案</div>
                  </h4>
                  <div className="desc">
                    <div className="wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>投注内容</th>
                            <th>注数</th>
                            <th>模式</th>
                            <th>金额类型</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <span className="blue">{traceDetail.appendScheme.content}</span>
                            </td>
                            <td>{traceDetail.appendScheme.noteNuber}</td>
                            <td>{traceDetail.appendLottery.bonusType}</td>
                            <td>{traceDetail.appendScheme.model}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  
                  <h4><div className="wrap">期数详情</div></h4>
                  <div className="desc"><div className="wrap">
                    { traceDetail.appendLottery.stopFlag == 1 && <div className="txt-center">
                      <button onClick={this.onStopTrace} className="btn btn-orange">停止追号</button>
                    </div> }
                      <table>
                        <thead>
                          <tr>
                            <th>期号</th>
                            <th>倍数</th>
                            <th>金额</th>
                            <th>奖金</th>
                            <th>状态</th>
                            <th>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {traceDetail.resultList.map( (item, index) => {
                            return ( <tr key={index}>
                              <td>{item.betQishuFormat}</td>
                              <td>{item.multipe}</td>
                              <td>{item.betmoney}</td>
                              <td>{item.winMoney}</td>
                              <td><span className="color-orange">{item.status}</span></td>
                              <td>
                                { item.stopOrderFlag == '1'  &&  <a className={ "cancel-link" } onClick={this.cancelOrder.bind(this, item)}>撤单</a> }
                                { item.stopOrderFlag != '1' && <a href="cancel-link" style={ {visibility: 'hidden'} }>撤单</a> }
                                <a className="detail-link" onClick={this.viewOrderDetail.bind(this, item)}>详情</a>
                              </td>
                            </tr>);
                          } )}
                        </tbody>
                      </table>
                  </div></div>
        
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

}

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    traceDetail: userModule.order.get('lotteryTraceDetail'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryTraceDetailContainer));