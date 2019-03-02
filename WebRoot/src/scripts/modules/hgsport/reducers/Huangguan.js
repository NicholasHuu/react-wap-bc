import {Map, List} from 'immutable';

import * as Constant from '../constants/HgConstant';
import {RES_OK_CODE, RES_MAINTAIN_CODE} from '../../../constants/AppConstant';
import cache from '../../../utils/cache';

const ExpireMinute = 30;

const initState = Map({
  sportBalls: {}, // 球类列表
  ballTypes: [], // 球类盘口
  ballPeiyu: {}, // 球类盘口下的赔率
  apiRes: {},
  sportDetail: {}, // 体育详情
  orderItems: [],
  orderItemsHasMore: true,
  isMaintain: false,
  maintainMsg: '',
  sportRule : "",
  activeName: "",
  refreshTime: 60,
  tempOrderData: [],
});

export default function Huangguan(state = initState, action) {
  switch (action.type) {
    case Constant.SET_ACTIVE_NAME:
      state = state.set('activeName', action.data);
      break;
    case Constant.REQUEST_SPORT_BALL:
      let sports = action.data.datas;
      let sportBalls = {};
      for (let sport of sports) {
        sportBalls[sport.rType] = sport.rName;
      }
      state = state.set('sportBalls', sportBalls);
      state = state.set('ballTypes', []);
      state = state.set('ballPeiyu', {});
      state = state.set('sportDetail', {});
      state = state.set('apiRes', action.data);
      if (RES_MAINTAIN_CODE == action.data.errorCode) {
        state = state.set('isMaintain', true);
        state = state.set('maintainMsg', action.data.msg);
      } else {
        state = state.set('isMaintain', false);
        state = state.set('maintainMsg', '');
      }
      break;
    case Constant.REQUEST_SPORT_BALL_TYPES:
      let ball = action.data.ball;

      state = state.set('ballTypes',action.data.datas || []);
      state = state.set('apiRes', action.data);
      if (RES_MAINTAIN_CODE == action.data.errorCode) {
        state = state.set('isMaintain', true);
        state = state.set('maintainMsg', action.data.msg);
      } else {
        state = state.set('isMaintain', false);
        state = state.set('maintainMsg', '');
      }
      break;
    case Constant.REQUEST_SPORT_PEIYU:
      state = state.set('apiRes', action.data);
      if (RES_MAINTAIN_CODE == action.data.errorCode) {
        state = state.set('isMaintain', true);
        state = state.set('maintainMsg', action.data.msg);
        if(action.activeName){
          state = state.set('activeName',action.activeName);
        }
      } else {
        state = state.set('ballPeiyu', action.data.datas.list);
        state = state.set("refreshTime", action.data.datas.refreshTime);
        state = state.set('isMaintain', false);
        state = state.set('maintainMsg', '');
        if(action.activeName){
          state = state.set('activeName',action.activeName);
        }
      }
      break;
    case Constant.REQUEST_SPORT_DETAIL:
      if (RES_MAINTAIN_CODE == action.data.errorCode) {
        state = state.set('isMaintain', true);
        state = state.set('maintainMsg', action.data.msg);
      } else {
        state = state.set('sportDetail', action.data.datas);
        state = state.set('apiRes', action.data);
        state = state.set('isMaintain', false);
        state = state.set('maintainMsg', '');
      }
      break;
    case Constant.REQUEST_ORDER_ITEMS:
      let pageNo = action.data.pageNo;
      state = state.set('apiRes', action.data);

      if (action.data.datas.length == 10) {
        state = state.set('orderItemsHasMore', true);
      } else {
        state = state.set('orderItemsHasMore', false);
      }
      
      if (pageNo == 1) {
        state = state.set('orderItems', action.data.datas);  
      } else {
        let list = state.get('orderItems');
        if (typeof action.data.datas != 'undefined') {
          list = list.concat(action.data.datas);  
        }
        state = state.set('orderItems', list);
      }

      break;
    case Constant.REQUEST_SPORT_RULE:
      state = state.set('sportRule',action.data.datas.ruleContent)
      
      break;
    case Constant.RESET_TEMP_SAVED_ORDER_DETAIL:
      state = state.set('tempOrderData', []);
      cache.remove('tempOrderData');
      break;
    case Constant.DELETE_SELECTED_ORDER:
      let preorders = state.get('tempOrderData');
      let orderToBeDeleted = action.data;
      let neworders = [];
      for (let order of preorders) {
        if (order.query.gid == orderToBeDeleted.query.gid) {
          continue;
        }
        neworders.push(order);
      }
      state = state.set('tempOrderData', neworders);
      cache.set('tempOrderData', neworders, new Date().getTime() + ExpireMinute * 60 * 1000); // 30分钟过期
      break;
    case Constant.TEMP_SAVE_ORDER_DETAIL:
      let querydata = action.data.query;
      let score = action.data.score;
      if (querydata.rType == 'p3' || querydata.rType == 'bk_p3') {
        let orders = state.get('tempOrderData');
        let isExist = false;
        for (let i = 0; i < orders.length; i++) {
          let orderitem = orders[i];
          if (orderitem.score.gidm === score.gidm) {
            orders[i] = action.data;
            isExist = true;
          }
        }
        if (!isExist) {
          orders.push(action.data);
        }
        
        state = state.set('tempOrderData', orders);

      } else {
        state = state.set('tempOrderData', [action.data]);
      }

      let tempOrderData = state.get('tempOrderData');
      cache.set('tempOrderData', tempOrderData, new Date().getTime() + ExpireMinute * 60 * 1000); // 30分钟过期

      break;
  }

  return state;
}

