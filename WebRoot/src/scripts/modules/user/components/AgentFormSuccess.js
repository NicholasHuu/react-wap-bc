import React, {Component, PropTypes} from 'react';
import {APPLY_BONUS, APPLY_DEDUCT} from '../constants/UserConstant';
import copy from 'copy-to-clipboard';
import {alert} from '../../../utils/popup';
import FormNotice from '../../../components/FormNotice';
import {openGame} from '../../../utils/site';
import {authPromoLink} from '../../../actions/AppAction';
import {RES_OK_CODE} from '../../../constants/AppConstant';
class AgentFormSuccess extends Component {

  constructor(props){
    super(props);
    this.oneKeyCopy = this.oneKeyCopy.bind(this);
  }

  agentTypeLabel() {
    const {agentInfo} = this.props;
    if (agentInfo.agentType == APPLY_BONUS) {
      return '退拥类型';
    } else {
      return '退水类型';
    }
  }

  oneKeyCopy() {
    let {agentInfo} = this.props;
    agentInfo = agentInfo['agent'];
    let text = agentInfo.agentUrl;
    copy(text);
    let _this = this;
    alert("已经复制到粘贴板");
  }

  goReportPage(reportUrl){
    // 推广链接
    authPromoLink(reportUrl, (data) => {
      if (data.errorCode == RES_OK_CODE ) {
        let url = data.datas.backUrl;
        window.location.href = url;
      } else {
        alert(data.msg);
      }
    });
  }

  render() {
    let {agentInfo, userModule} = this.props;
    agentInfo = agentInfo['agent'];
    let url = agentInfo.agentUrl;
    let reportUrl = agentInfo.agentReportUrl;
    return (
      <div className="agent-body">
        <div className="agent-item agent-title">
          <div className="inner"><i></i>{agentInfo.agentStatusDes}</div>
        </div>
        <div className="agent-item agent-form">
          <ul>
            <li><span>推广地址 :</span><span>{agentInfo.agentUrl}</span><i onClick={this.oneKeyCopy}>复制</i></li>
            <li><span>代理账号 :</span><span>{userModule.user.get('auth').get('userName')}</span></li>
            <li><span>代理类型 :</span><span>{agentInfo.type && agentInfo.type.typeName}</span></li>
            <li><span>邮箱地址 :</span><span>{agentInfo.agentMail}</span></li>
            <li><span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注 :</span><span>{agentInfo.remark}</span></li>
            <li><span>代理报表 :</span><span className="agent-list"><i onClick={this.goReportPage.bind(this,reportUrl)}>进入</i></span></li>
          </ul>

        </div>
      </div>
    )
  }
};

export default AgentFormSuccess;