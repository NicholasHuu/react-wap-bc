import React, {Component, PropTypes} from 'react';
import {APPLY_BONUS, APPLY_DEDUCT, AGENT_STATUS_BLOCKED} from '../constants/UserConstant';

class AgentFormFail extends Component {

  agentTypeLabel() {
    let {agentInfo} = this.props;
    agentInfo = agentInfo.agent;
    if (agentInfo.agentType == APPLY_BONUS) {
      return '退拥类型';
    } else {
      return '退水类型';
    }
  }

  render() {
    
    let {agentInfo, userModule} = this.props;
    agentInfo = agentInfo.agent;
    let agentClsName = 'agent-fail';
    if (agentInfo.status == AGENT_STATUS_BLOCKED) {
      agentClsName = 'agent-blocked';
    }
    return(
      <div className={"agent-body "+agentClsName}>
        <div className="agent-item agent-title">
          <div className="inner"><i></i>{agentInfo.agentStatusDes}</div>
        </div>
        <div className="agent-item agent-form">
          <ul>
            <li><span>代理账号</span> : <span>{userModule.user.get('auth').get('userName')}</span></li>
            <li><span>代理类型</span> : <span>{agentInfo.type.typeName}</span></li>
            <li><span>邮箱地址</span> : <span>{agentInfo.agentMail}</span></li>
            {agentInfo.status != AGENT_STATUS_BLOCKED && <li><span>申请理由</span>: <span>{agentInfo.content}</span></li>}
            <li><span>备注</span> : <span>{agentInfo.remark}</span></li>
          </ul>

        </div>

      </div>

    )
  }
};

export default AgentFormFail;