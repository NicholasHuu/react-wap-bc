import {Map, List} from 'immutable';
import {REQUEST_LOTTERY_MAIN, 
  REQUEST_LOTTERY_DETAIL, 
  REQUEST_PLAY_METHOD,
  HIDE_OR_VIEW_YL,
  REQUEST_LOTTERY_RESULT,
  REQUEST_OPEN_INFO,
  SAVE_LOTTERY_ORDER,
  DELETE_LOTTERY_ORDER,
  CLEAN_LOTTERY_ORDER,
  SUBMIT_LOTTERY_ORDER,
  REQUEST_CHASE_QS,
  GENERATE_CHASE_QS,
  CLEAN_CHASE_QS,
  REQUEST_LOTTERY_TREND,
  QUICK_VIEW_HISTORY_COUNT,
  REQUEST_TINY_USER_RESOURCE,
  REQUEST_NUMBERS} from '../constants/LotteryConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';

const initState = Map({
  config: {
    
  },
  gameDetails: {
    
  },
  tinyUserResource: {

  },
  chaseQs: [],
  selectedOrder:[],
  lastSelectOrder: null,
  viewYl: false,
  traceItems: [], // 追号数据
  canTrace: true, // 是否允许追号
  crtInfo: {
    crtQs: '',
    crtFullQs: '',
    leftSecond: 0,
    msg: '',
    yl: {},
    openNums: [{
      qs: '026',
      num: '5 2 8 0 0 ',
      sw: '小双',
      gw: '小双',
    }, {
      qs: '025',
      num: '6 7 1 1 8',
      sw: '小单',
      gw: '小双',
    }],
  },
  // 追号数据
  trend: {
    
  }, 
});

let handlers = {

  [REQUEST_TINY_USER_RESOURCE]: (state, action) => {
    if (action.data.errorCode == RES_OK_CODE) {
      state = state.set('tinyUserResource', action.data.datas);
    }

    return state;
  },

  [REQUEST_PLAY_METHOD]: (state, action) => {
    if (action.data.errorCode == RES_OK_CODE) {
      let config = Object.assign({}, state.get('config'));
      let menu = action.data.datas.menu;

      for (let menuItem of menu) {
        let old = config[menuItem['menuCode']];
        if (typeof old != 'undefined') {
          menuItem.gameList = old.gameList;
        }
        config[menuItem['menuCode']] = menuItem;
      }
      
      state = state.set('config', config);
    }
    return state;
  },

  [REQUEST_LOTTERY_DETAIL]: (state, action) => {
    if (action.data.errorCode == RES_OK_CODE) {
      state = state.set('gameDetails', action.data.datas);
      let config = state.get('config');
      if (typeof config[action.lottery] == 'undefined') {
        config[action.lottery] = {};
      }
      config[action.lottery]['gameList'] = action.data.datas.gameList;
      state = state.set('canTrace', !!action.data.datas.trace);

    }

    return state;
  },

  [HIDE_OR_VIEW_YL]: (state, action) => {
    let viewYl = state.get('viewYl')
    if (action.data.force) {
      viewYl = false;
    } else {
      viewYl = !viewYl;
    }
    state = state.set('viewYl', viewYl);
    return state;
  },

  [REQUEST_LOTTERY_RESULT]: (state, action) => {
    if (action.data.errorCode == RES_OK_CODE) {
      let results = action.data.datas.openResult;
      let openNums = [];
      for (let item of results) {
        openNums.push({
          qs: item.qsFormat,
          num: item.openResult.join(',')
        });
      }

      if (openNums.length < QUICK_VIEW_HISTORY_COUNT) {
        for (let i = 0; i < QUICK_VIEW_HISTORY_COUNT - openNums.length; i++) {
          openNums.push({
            qs: '',
            num: '',
          });
        }
      }

      let crtInfo = state.get('crtInfo');
      crtInfo = Object.assign({}, crtInfo);
      crtInfo.openNums = openNums;

      state = state.set('crtInfo', crtInfo);
    }

    return state;
  },

  [REQUEST_OPEN_INFO]: (state, action) => {
    
    if (action.data.errorCode == RES_OK_CODE) {
      let crtInfo = state.get('crtInfo');
      crtInfo = Object.assign({}, crtInfo);
      crtInfo.crtQs = action.data.datas.paiqiResult.qsFormat;
      crtInfo.crtFullQs = action.data.datas.paiqiResult.qs;
      crtInfo.leftSecond = action.data.datas.paiqiResult.closeTime;
      crtInfo.isClose = action.data.datas.paiqiResult.isClose == 1;
      crtInfo.closeDes = action.data.datas.paiqiResult.closeDes;
      crtInfo.yl = action.data.datas.yl ? action.data.datas.yl: {};
      crtInfo.msg =  '';

      state = state.set('crtInfo', crtInfo);
    } else if (action.data.errorCode == '000012') {
      crtInfo.msg = action.data.msg;
    }

    return state;
  },

  [SAVE_LOTTERY_ORDER]: (state, action) => {
    const {lottery, gameCode, num, zhushu, bs, unit} = action.data;
    let config = state.get('config');
    let gameCodeName = '';
    // 找出 gameCode 的名字
    for (let item of config[lottery].gameList) {
      for (let sitem of item.list) {
        if (sitem.gameCode == gameCode) {
          gameCodeName = sitem.currentGameName;
        }
      }
    }
    let orders = state.get('selectedOrder');
    action.data.gameCodeName = gameCodeName;
    orders.push(action.data);
    state = state.set('selectedOrder', orders.clone());
    state = state.set('lastSelectOrder', action.data);

    return state;
  },

  [DELETE_LOTTERY_ORDER]: (state, action) => {
    let index = action.data.orderId;
    let orders = state.get('selectedOrder');
    orders.splice(index, 1);

    return state.set('selectedOrder', orders.clone());
  },

  [CLEAN_LOTTERY_ORDER]: (state, action) => {
    console.log(['clean lottery order']);
    state = state.set('selectedOrder', []);
    state = state.set('chaseQs', []);
    return state;
  },

  [SUBMIT_LOTTERY_ORDER]: (state, action) => {

    return state;
  },

  [REQUEST_CHASE_QS]: (state, action) => {

    return state;
  },

  [GENERATE_CHASE_QS]: (state, action) => {
    state = state.set('chaseQs', action.data);
  
    return state;
  },

  [CLEAN_CHASE_QS]: (state, action) => {
    state = state.set('chaseQs', []);

    return state;
  },

  [REQUEST_LOTTERY_TREND]: (state, action) => {
    state = state.set('trend', action.data.datas);

    return state;
  }

};

export default (state = initState, action) => {
  let handler = handlers[action.type];
  return handler ? handler(state, action): state
};