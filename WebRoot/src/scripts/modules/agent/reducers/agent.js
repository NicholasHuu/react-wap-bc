import {Map, List} from 'immutable';
import * as AgentConstant from '../constants/AgentConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';

let handlers = {
  [AgentConstant.REQUEST_AGENT_MEMBER]: (state, action) => {
    if (action.data.errorCode == RES_OK_CODE) {
      let members = state.get('members');
      if (action.pageNo == 1) {
        members = [];
      }
      members = members.concat(action.data.datas);
      state = state.set('members', members);
    }
    state = state.set('apiRes', action.data);
    return state;
  }
};

handlers[AgentConstant.REQUEST_AGENT_REPORT_SUMMARY] = (state, action) => {
  if (action.data.errorCode == RES_OK_CODE) {
    state = state.set('summary', action.data.datas);
  }
  return state;
};

handlers[AgentConstant.REQUEST_AGENT_HISTORY_DETAIL] = (state, action) => {
  if (action.data.errorCode == RES_OK_CODE) {
    let details = state.get('details');
    details[action.flat] = action.data.datas;
    state = state.set('details', details);
  }
  return state;
};

handlers[AgentConstant.REQUEST_AGENT_INFO] = (state, action) => {
  if (action.data.errorCode == RES_OK_CODE) {
    state = state.set('info', action.data.datas);
  }
  return state;
};

const initState = Map({
  members: [],
  apiRes: {},
  summary: {},
  info: {},
  details: {

  },
});

export default function(state = initState, action) {
  let handler = handlers[action.type];
  return handler ? handler(state, action): state;
};