import {Map, List} from 'immutable';
import * as MessageConstant from '../constants/MessageConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import {migratePagedAction} from './';

const initState = Map({
  apiRes: {
  },
  messages: [],
  sysMessages: [],
  userMessages: [],
  userUnreadMsgFlag: 0,
  systemUnreadMsgFlag: 0,
  chatMessageItems: {
    items: [],
    totalPage: 0,
    totalRows: 0
  },
  chatDetails: [],
});

export default function Message(state = initState, action) {

  let data = action.data;
  let msgList = [];
  let crtPage = 0;
  switch (action.type) {
  
    case MessageConstant.REQUEST_COUNT_MESSAGE:
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('userUnreadMsgFlag', data.datas.messageCount*1);  
      }
      break;

    case MessageConstant.REQUEST_USER_MESSAGE_ITEMS:

      state = state.set('apiRes', data);
      if (data.datas.length <= 0) {
        if (action.pageNo > 1) {
          return state;  
        } else {
          state = state.set('userMessages', []);
          return state;
        }
      }

      crtPage = action.pageNo;
      if (crtPage == 1) {
        state = state.set('userMessages', data.datas);
      } else {
        msgList = state.get('userMessages');
        msgList = msgList.concat(data.datas);
        state = state.set('userMessages', msgList);
      }

      return state;
    case MessageConstant.REQUEST_SYSTEM_MESSAGE_ITEMS:
  
      state = state.set('apiRes', data);
      if (data.datas.length <= 0) {
        if (action.pageNo > 1) {
          return state;  
        } else {
          state = state.set('sysMessages', []);
          return state;
        }
      }

      crtPage = action.pageNo;
      if (crtPage == 1) {
        state = state.set('sysMessages', data.datas);
      } else {
        msgList = state.get('sysMessages');
        msgList = msgList.concat(data.datas);
        state = state.set('sysMessages', msgList);
      }
    
      return state;

    case MessageConstant.REQUEST_DELETE_USER_MESSAGE:
      if (action.data.errorCode == RES_OK_CODE) {
        let messages = state.get('userMessages');
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].id == action.data.id) {
            messages.splice(i, 1);
            break;
          }
        }
        state = state.set('userMessages', messages);
      }
      state = state.set('apiRes', action.data);
      return state;

    case MessageConstant.REQUEST_DELETE_SYSTEM_MESSAGE:
      if (action.data.errorCode == RES_OK_CODE) {
        let messages = state.get('sysMessages');
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].id == action.data.id) {
            messages.splice(i, 1);
            break;
          }
        }
        state = state.set('sysMessages', messages);
      }
      state = state.set('apiRes', action.data);
      return state;

    case MessageConstant.REQUEST_CHAT_MESSAGE_ITEMS:
      
      state = migratePagedAction(action, state, 'chatMessageItems');

    break;

    case MessageConstant.REQUEST_CHAT_DETAILS:
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('chatDetails', action.data.datas.resultList);
      }
    break;

  }

  return state;
}