import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';

import DatePicker from '../../../components/DatePicker';
import FundsSummary from '../components/FundsSummary';
import {format} from '../../../utils/datetime';

import {loadReportSummary} from '../actions/AgentAction';
import {loadPlatformItems} from '../../../modules/user/actions/PlatformTransfer';
import Header from '../../../components/Header';
import Back from '../../../components/Back';

class FundsContainer extends Component {
  
  constructor(props) {
    super(props);
    this.loadSummaryData = this.loadSummaryData.bind(this);
    this.filterSummary = this.filterSummary.bind(this);
    this.state = {
      date: format(null, 'Ym')
    };
  }

  componentDidMount() {
    this.loadSummaryData();
    const {dispatch} = this.props;
    dispatch(loadPlatformItems());
  }

  loadSummaryData(date) {
    const {dispatch} = this.props;
    dispatch(loadReportSummary(date));
  }

  filterSummary(date) {
    this.setState({
      date: format(date, 'Ym')
    });
    this.loadSummaryData(date);
  }

  render() {
    const {match, summary, platforms} = this.props;
    return (
      <div>
        <Header className="agentreport-header" {...this.props}>
          <Back backTo="/agentreport"/>
          <h3>资金报表</h3>
        </Header>
        <div className="agentreport-con">
          <div className="funds-wrapper">
            <div className="date-el">
              <DatePicker onChange={this.filterSummary}/>
            </div>
            <FundsSummary summary={summary}/>
            <div className="platform-items">
              {platforms.map((platform, index) => {
                return (
                <div key={index} className="platform">
                  <p className="name">{platform.flatName}</p>
                  <Link to={`${match.url}/${platform.flat}?date=${this.state.date}`} className="btn-small">详情</Link>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

};

function mapStateToProps({agent, userModule, app}) {

  return {
    summary: agent.agent.get('summary'),
    platforms: userModule.platform.get('platformItems'),
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(FundsContainer));