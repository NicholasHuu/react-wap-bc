import * as Constant from '../constants/HgConstant';
import * as API from '../utils/API';

import {get, post, put, parseQuery} from '../../../utils/url';


export function loadSportBallItems(timeType, location, defaultBall = null) {
  return (dispatch, getState) => {
    post(API.sportBallURL())
    .then( res  => res.json())
    .then (data => {

    
      if (timeType) {
        let query = parseQuery(location.search);
        // 加载盘口
        let firstBall = data.datas[0].rType;
        if (query.ball) {
          firstBall = query.ball;
        } else if (defaultBall) {
          firstBall = defaultBall;
        }
        let rType = query.rType;

        dispatch(loadSportBallTypes(firstBall, timeType, rType));
      }

      dispatch({
        type: Constant.REQUEST_SPORT_BALL,
        data
      });
    });
  };
}

export function loadSportBallTypes(ball, timeType, rType, activeName, cb = () => {}) {
  return (dispatch, getState) => {
    post(API.sportBallTypeURL(), {
      ballType: ball
    })
    .then(res => res.json())
    .then(data => {
      data.ball = ball;
      dispatch({
        type: Constant.REQUEST_SPORT_BALL_TYPES,
        data
      });
      
      if (!rType) {
        if (data.datas.length) {
          rType = data.datas[0].rType;

          // 滚球 写死 ????
          if (timeType == 'roll' && ball == 'bk') {
            rType = 're_main';
          }
          if (timeType == 'roll' && ball == 'ft') {
            rType =  're';
          }
        } 
      }
     
      dispatch(loadSportPeiyu(timeType, rType, activeName, cb));
    });
  };
}

export function loadSportPeiyu(timeType, rType, activeName, cb = () => {}) {
  return (dispatch, getState) => {
    post(API.sportPeiyuURL(), {
      timeType, 
      rType
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        activeName,
        type: Constant.REQUEST_SPORT_PEIYU,
        data
      });

      cb(data);
    });
  };
}

export function loadSportDetail(query, cb) {
  return (dispatch, getState) => {
    post(API.sportDetailURL(), query)
    .then(res => res.json())
    .then(data => {
      if (typeof cb == 'function') {
        cb(data);
      } else {
        dispatch({
          type: Constant.REQUEST_SPORT_DETAIL,
          data
        });
      }
    });
  };
}

export function saveOrder(query, cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    query.userName = userName;
    post(API.saveOrderURL(), query)
    .then(res => res.json())
    .then(data => {
      cb(data);
    });
  };
}

export function loadOrder(time, ballType,  pageNo = 1, pageSize = 10,  ) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(API.loadOrderURL(), {
      userName,
      time,
      ballType,
      pageNo,
      pageSize,
    })
    .then(res => res.json())
    .then(data => {
      data.pageNo = pageNo;
      dispatch({
        type: Constant.REQUEST_ORDER_ITEMS,
        data
      });
    });
  };
}

export function getSportRule(ruleCode, cb = ()=>{}, ruleType = "sport_rule_type"){
  return (dispatch ,getState) => {
    post(API.getSportRuleURL(),{
      ruleCode,
      ruleType
    })
    .then(res => res.json())
    .then(data => {
      cb();
      dispatch({
        type: Constant.REQUEST_SPORT_RULE,
        data
      })
    })
  }
}

export function tempSaveSelectedOrder(data) {
  return {
    type: Constant.TEMP_SAVE_ORDER_DETAIL,
    data
  };
}

export function deleteOrder(order) {
  return {
    type: Constant.DELETE_SELECTED_ORDER,
    data: order
  };
}

export function resetTempSelectedOrder() {
  return {
    type: Constant.RESET_TEMP_SAVED_ORDER_DETAIL,
  }
}

export function setActiveName(val) {
  return {
    type: Constant.SET_ACTIVE_NAME,
    data : val
  }
}
