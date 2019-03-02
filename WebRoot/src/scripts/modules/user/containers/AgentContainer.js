import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {withRouter} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {AGENT_STATUS_EDIT, 
  AGENT_STATUS_FAIL, 
  AGENT_STATUS_APPLYING, 
  AGENT_STATUS_SUCCESS,
  AGENT_STATUS_BLOCKED} from '../constants/UserConstant';

import {alert} from '../../../utils/popup';
import LoadingComponent from '../../../components/LoadingComponent';
import AgentFormSuccess from '../components/AgentFormSuccess';
import AgentFormEdit from '../components/AgentFormEdit';
import AgentFormApplying from '../components/AgentFormApplying';
import AgentFormFail from '../components/AgentFormFail';
import {loadUserAgentInfo} from '../actions/User';

const NO_APPLY_CODE = '200032';
const APPLYED_CODE = '200031';

class AgentContainer extends LoadingComponent {

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadUserAgentInfo());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }
  
  render() {
    let agentInfo = this.props.userModule.user.get('agentInfo');    
    let agentInfoCom = null;

    let agentDetail = agentInfo['agent'] || {};

    if (agentInfo.errorCode == NO_APPLY_CODE) {
      agentInfoCom = <AgentFormEdit info={agentDetail} {...this.props}/>;
    } else {
      if(agentDetail.status == AGENT_STATUS_SUCCESS ) {
        agentInfoCom = <AgentFormSuccess {...this.props} />
      }else if(agentDetail.status == AGENT_STATUS_APPLYING) {
        agentInfoCom = <AgentFormApplying {...this.props} />
      }else if(agentDetail.status == AGENT_STATUS_FAIL) {
        agentInfoCom = <AgentFormFail {...this.props} />;
      } else if (agentDetail.status == AGENT_STATUS_BLOCKED) {
        agentInfoCom = <AgentFormFail {...this.props} status={AGENT_STATUS_BLOCKED}/>;
      }
    }

    return (
        <div className="page page-agent">
          <div className="inner">
            <Header {...this.props}>
              <Back />
              <h3>代理信息</h3>
            </Header>
            <div className="page-body">
              {agentInfoCom}
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
    app,
    agentInfo: userModule.user.get('agentInfo'),
  }
}

export default connect(mapStateToProps)(withRouter(AgentContainer));