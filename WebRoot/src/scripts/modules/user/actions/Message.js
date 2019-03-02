import * as MessageConstant from '../constants/MessageConstant';

import {get, post, put} from '../../../utils/url';
import {userMessageAPI, 
  systemMessageAPI, 
  readMessageAPI, 
  deleteMessageAPI, 
  countMessageAPI,
  chatMessageItemsAPI,
  chatDetailAPI,
  deleteChatAPI,
  pushChatMessageAPI,} from '../utils/API';

export function loadMessageItems(msgType, pageNo = 1, pageSize = 10) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    let actionType = MessageConstant.REQUEST_SYSTEM_MESSAGE_ITEMS;
    let body = {
      pageNo,
      pageSize,
      type: msgType
    };
    let url = userMessageAPI();
    if (msgType == MessageConstant.MESSAGE_USER) {
      actionType = MessageConstant.REQUEST_USER_MESSAGE_ITEMS;
    }
    post(url, body)
    .then(res => res.json())
    .then(data => {
      try {
        dispatch({
          type: actionType,
          data: data,
          pageNo
        });
      } catch (e) {
        // console.error(e);
      }
    });
  }
}

export function readMessage(code) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');

    post(readMessageAPI(), {
      userName,
      code
    });
  };

}

export function deleteMessage(code) {
  
   var actionType = MessageConstant.REQUEST_DELETE_USER_MESSAGE;
  
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(deleteMessageAPI(), {
      userName,
      code
    })
    .then(res => res.json())
    .then(data => {
      data.code = code;
      dispatch({
        type: actionType,
        data,
      });
    });
  }
}

export function countMessage() {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    if (userName) {
      post(countMessageAPI(), {
        userName
      })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: MessageConstant.REQUEST_COUNT_MESSAGE,
          data,
        });
      });
    }
  }
}

export function loadChatMessageItems(status, currentPage, cb = () =>{}) {
  return (dispatch, getState) => {
    post(chatMessageItemsAPI(), {
      status,
      currentPage
    })
    .then( res => res.json())
    .then( data => {
      dispatch({
        type: MessageConstant.REQUEST_CHAT_MESSAGE_ITEMS,
        data,
        page: currentPage
      });
      cb();
    })
  };
}

export function loadChatDetails(id, cb = () => {}) {
  return (dispatch, getState) => {
    post(chatDetailAPI(), {
      id
    })
    .then( res => res.json() )
    .then( data => {
      dispatch({
        type: MessageConstant.REQUEST_CHAT_DETAILS,
        data
      });
      cb(data);
    });
  };
}

export function chat(groupKey, content, cb = () => {}) {
  post(pushChatMessageAPI(), {
      groupKey,
      content
  })
  .then(res => res.json())
  .then( data => {
      cb(data);
  });
}

export function chatDelete(ids, cb = () => {}) {
  post(deleteChatAPI(), {
    id: ids.join(';')
  })
  .then(res => res.json())
  .then( data => {
    cb(data);
  });
}