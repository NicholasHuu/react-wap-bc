import {post} from '../../../utils/url';
import {agentMemberAPI, 
  agentReportSummaryAPI, 
  agentDetailReportAPI, 
  agentInfoAPI} from '../utils/API';
import {DateFromString} from '../../../utils/datetime';
import * as AgentConstant from '../constants/AgentConstant';

export function loadAgentMembers(pageNo = 1, pageSize = 10) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(agentMemberAPI(), {
      userName,
      pageSize,
      pageNo
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AgentConstant.REQUEST_AGENT_MEMBER,
        data,
        pageNo
      });
    });
  };
}

export function loadReportSummary(date) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    let d = DateFromString(date);
    post(agentReportSummaryAPI(), {
      userName,
      qs: d.getFullYear() + '' + (d.getMonth() + 1 )
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AgentConstant.REQUEST_AGENT_REPORT_SUMMARY,
        data
      });
    });
  };
}

export function loadReportDetail(flat, date) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(agentDetailReportAPI(), {
      userName,
      webflag: flat,
      qs: date
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AgentConstant.REQUEST_AGENT_HISTORY_DETAIL,
        data,
        flat
      });
    });
  };
}

export function loadAgentInfo() {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(agentInfoAPI(), {
      userName
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AgentConstant.REQUEST_AGENT_INFO,
        data
      });
    });
  };
}