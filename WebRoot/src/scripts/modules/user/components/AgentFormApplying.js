import React, {Component, PropTypes} from 'react';
import {APPLY_BONUS, APPLY_DEDUCT} from '../constants/UserConstant';
import FormNotice from '../../../components/FormNotice';

class AgentFormApplying extends Component {
  
  agentTypeLabel() {
    const {agentInfo} = this.props;
    if (agentInfo.agentType == APPLY_BONUS) {
      return '退拥类型';
    } else {
      return '退水类型';
    }
  }

  render() {
    let {agentInfo, userModule} = this.props;
    let agentDetail = agentInfo['agent'];
    return(
      <div className="agent-body agent-applying">
        <div className="agent-item agent-title">
          <div className="inner"><i></i>{agentDetail.agentStatusDes}</div>
        </div>
        <div className="agent-item agent-form">
          <ul>
            <li><span>代理账号</span> : <span>{userModule.user.get('auth').get('userName')}</span></li>
            <li><span>代理类型</span> : <span>{agentDetail.type && agentDetail.type.typeName}</span></li>
            <li><span>邮箱地址</span> : <span>{agentDetail.agentMail}</span></li>
            <li><span>申请理由</span> : <span>{agentDetail.content}</span></li>
          </ul>

        </div>

      </div>

    )
  }
};

export default AgentFormApplying;