import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import AdBanner from '../../../components/AdBanner';
import Card from '../../../components/Card';

class HomeContainer extends Component {

  constructor(props) {
    super(props);
    this.goMyMember = this.goMyMember.bind(this);
    this.goCapitalStatemenet = this.goCapitalStatemenet.bind(this);
    this.goProxyInformation = this.goProxyInformation.bind(this);
  }

  goProxyInformation() {
    const {history} = this.props;
    history.push('/agentreport/proxy');
  }
  
  goMyMember() {
    const {history} = this.props;
    history.push('/agentreport/member');
  }

  goCapitalStatemenet() {
    const {history} = this.props;
    history.push('/agentreport/funds');
  }

  render() {
    return (
      <div>
        <Header className="agentreport-header" {...this.props}>
          <h3>代理系统</h3>
        </Header>
        <div className="agentreport-con">
          <AdBanner image='/misc/images/agentreport/adbanner.jpg' />
          <div className="agentreport-links">
            <Card image='/misc/images/agentreport/my-member.png' title='旗下会员' summary='MY MEMBER' onClick={this.goMyMember} className='agentreport-card' />
            <Card image='/misc/images/agentreport/capital-statement.png' title='资金报表' summary='CAPITAL STATEMENT' onClick={this.goCapitalStatemenet} className='agentreport-card' />
            <Card image='/misc/images/agentreport/proxy-information.png' title='代理信息' summary='PROXY INFORMATION' onClick={this.goProxyInformation} className='agentreport-card' />
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps({userModule, app}) {
  return {
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(HomeContainer));