import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {loadAgentInfo} from '../actions/AgentAction';

import Header from '../../../components/Header';
import Back from '../../../components/Back';

class ProxyContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadAgentInfo());
  }

  showTab(index) {
    this.setState({
      activeTab: index
    });
  }
  
  render() {
    const {info} = this.props;
    return (
      <div>
        <Header {...this.props} className="agentreport-header">
          <Back backTo={'/agentreport'}/>
          <h3>代理信息</h3>
        </Header>
        <div className="agentreport-con">
          <div className="proxy-body">
            <div className="proxy-header">
              <ul className="clearfix">
                <li onClick={this.showTab.bind(this, 0)} className={this.state.activeTab == 0 ? 'active': ''}><p>代理信息</p></li>
                <li onClick={this.showTab.bind(this, 1)} className={this.state.activeTab == 1 ? 'active': ''} ><p>佣金算法</p></li>
              </ul>
            </div>
            {this.state.activeTab == 0 && <div className="proxy-content">
              <table>
                <tbody>
                  <tr>
                    <td>名称</td>
                    <td>{info.typeName}</td>
                  </tr>
                  <tr>
                    <td>退拥</td>
                    <td>{info.tuiyong}</td>
                  </tr>
                  <tr>
                    <td>退水</td>
                    <td>{info.tuishui}</td>
                  </tr>
                  <tr>
                    <td>备注</td>
                    <td>{info.beizhu}</td>
                  </tr>
                </tbody>
              </table>
              <p className="help-text">注:公式计算: ag输赢总和 - ag输赢总和 x ag行政费比例 - 会员返水 x 行政费比例 = 实际盈利, 实际盈利 x 退拥比例 + ag有效投注 x 退水比例 = 代理佣金</p>
            </div> }

            {this.state.activeTab == 1 && 
              <div className="proxy-algorithm">
                <p>会员输赢:红色(正数)-代表玩家赢的钱,绿色(负数)-代表玩家输的钱.可获佣金:红色(正数)-代表要支付代理费给代理商,绿色(亏损)-代表无需支付</p>
                <h3>代理佣金计算公式:</h3>
                <p>体育输赢总和 -</p>
                <p className="grapha">（体育输赢总和 x 体育行政费比例） - 会员返水 x 行政费比例 = 实际盈利,实际盈利x退佣比例+体育有效投注x退水比例=代理佣金1;</p>
                <p>沙巴输赢总和 -</p>
                <p className="grapha">（沙巴输赢总和 x 沙巴行政费比例） - 会员返水 x 行政费比例 = 实际盈利,实际盈利x退佣比例+沙巴有效投注x退水比例=代理佣金2;</p>
                <p>MG输赢总和 -</p>
                <p className="grapha">（MG输赢总和 x MG行政费比例） - 会员返水 x 行政费比例 = 实际盈利,实际盈利x退佣比例+MG有效投注*退水比例=代理佣金3;</p>
                <p>BBIN输赢总和 -</p>
                <p className="grapha">（BBIN输赢总和 x BBIN行政费比例） - 会员返水 x 行政费比例 = 实际盈利,实际盈利x退佣比例+BBIN有效投注x退水比例=代理佣金4;</p>
                <p>AG输赢总和 -</p>
                <p className="grapha">（AG输赢总和 x AG行政费比例） - 会员返水 x 行政费比例 = 实际盈利,实际盈利x退佣比例+AG有效投注x退水比例=代理佣金5;</p>
                <p className="grapha">可获佣金:代理佣金1+代理佣金2+代理佣金3+....+代理佣金11-存款手续费-取款手续费=代理可拿佣金;</p>
                <p className="grapha">入款总量和出款总量:只用于计算本月代理下属会员的资金流水统计和计算手续费之用。由于会员可能上个月还有余额存在或者目前还有余额，会存在和本月游戏报表不符，所以仅供参考。</p>
              </div>
            }

          </div>
        </div>
      </div>
    );
  }

};

function mapStateToProps({agent, userModule, app}) {
  console.log(['info', agent.agent.get('info')]);
  return {
    info: agent.agent.get('info'),
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(ProxyContainer));