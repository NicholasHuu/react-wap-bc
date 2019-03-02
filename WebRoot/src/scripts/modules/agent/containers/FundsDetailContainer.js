import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {parseQuery} from '../../../utils/url';
import {loadReportDetail} from '../actions/AgentAction';

import Back from '../../../components/Back';
import Header from '../../../components/Header';

class FundsDetailContainer extends Component {

  constructor(props) {
    super(props);
    this.loadFundsDetail = this.loadFundsDetail.bind(this);
  }

  componentDidMount() {
    this.loadFundsDetail();
  }

  loadFundsDetail() {
    const {match, location, dispatch} = this.props;
    let query = parseQuery(location.search);
    dispatch(loadReportDetail(match.params.platform, query.date));
  }

  render() {
  
    const {details, match} = this.props;
    let flat = match.params.platform;
    let detail = details[flat] || {};

    return (
      <div>
        <Header className="agentreport-header" {...this.props}>
          <Back backTo={'/agentreport/funds'}/>
          <h3>资金报表</h3>
        </Header>
        <div className="agentreport-con">
          <div className="funds-detail-con">
            <table>
              <tbody>
                <tr>
                  <td>会员输赢</td>
                  <td><span className="green">{detail.betUsrWin}</span></td>
                </tr>
                <tr>
                  <td>退拥比例</td>
                  <td>{detail.tyRate}%</td>
                </tr>
                <tr>
                  <td>有效投注</td>
                  <td>{detail.betIncome}</td>
                </tr>
                <tr>
                  <td>退水比例</td>
                  <td>{detail.tsRate}%</td>
                </tr>
                <tr>
                  <td>会员返水</td>
                  <td>{detail.waterBack}</td>
                </tr>
                <tr>
                  <td>行政费用</td>
                  <td>{detail.xzFee}</td>
                </tr>
                <tr>
                  <td>佣金</td>
                  <td className="red">{detail.commsTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

};

function mapStateToProps({agent, userModule, app}) {
  return {
    details: agent.agent.get('details'),
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(FundsDetailContainer));