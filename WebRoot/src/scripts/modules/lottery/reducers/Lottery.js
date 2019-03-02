import * as LotteryConstant from '../constants/LotteryConstant';
import {RES_OK_CODE, RES_MAINTAIN_CODE} from '../../../constants/AppConstant';
import {Map, List} from 'immutable';

const initState = Map({
  gameTypes: [], // 游戏列表
  // 游戏盘口
  gameItemsInType: {},
  apiOrderRes:{},
  apiRes: {},
  messages : ([]),
  openResult : [],
  lotterySlider: ([]),
  singleResult :[],
  pankouItems: [],
  pankouPeiyu: [],
  platformInfo: {},
  selectedPeiyu: {},
  preOrderList: {
    orderList: [],
    token: '',
  },
  multiGroupOrder: {
    orderList: [],
    token: '',
  },
  platformOrder : [],
  singleResultPageNo : 1,
  singleResultTotalPage: 1,
  winningList: ([]),
  isMaintain: false,
  maintainMsg: '',
  gameRules:{

  }
});

export default function (state = initState, action) {
  let pageNo, pageSize, totalPage, totalSize, data, datas, list;

  switch (action.type) {

    case LotteryConstant.REQUEST_LOTTERY_SLIDER:
      if (action.data.errorCode == RES_OK_CODE) {
        let imgs = [];
        for (let slider of action.data.datas) {
          imgs.push(slider['rsUrl']);
        }
        state = state.set("lotterySlider", imgs);
      }
      break;
    
    case LotteryConstant.REQUEST_GAME_RULE:
      data = action.data;
      if (data.errorCode == RES_OK_CODE) {
        let gameRules = state.get('gameRules');
        gameRules[data.ruleCode] = data.datas;
        state = state.set('gameRules', gameRules);
      }
      break;

    case LotteryConstant.REQUEST_LOTTERY_GAMES:
      data = action.data;
      const menuCode = 'lottery';
      if (data.errorCode == RES_OK_CODE) {
        for (let _m of data.datas) {
          if (_m.menuCode == menuCode) {
            state = state.set('gameTypes', _m.flatMenuList);   
          }
        }
      }
      state.set('apiRes', data);
      break;

    case LotteryConstant.REQUEST_OPEN_RESULT:
      data = action.data;
      if (data.errorCode == RES_OK_CODE) {
        state = state.set('openResult', data.datas);
      }
      state = state.set('apiRes', data);
      break;

    case LotteryConstant.REQUEST_OPEN_RESULT_DETAIL:
      pageNo = action.pageNo;
      totalSize = action.data.datas.totalSize;
      pageSize = action.data.datas.pageSize;
      totalPage = totalSize/pageSize;

      if (action.data.datas.list) {
        
        if(pageNo == 1) {
          state = state.set('singleResult', action.data.datas.list);
        } else {
          list = state.get('singleResult');
          list = list.concat(action.data.datas.list);
          state = state.set('singleResult',list);
        }
        state = state.set('singleResultPageNo', pageNo);
        state = state.set('singleResultTotalPage', pageSize);
        state = state.set('apiRes', action.data);
      }
      break;

    case LotteryConstant.REQUEST_LOTTERY_PANKOU:
      let itemList = action.data.datas.itemList;
      if (!itemList) {
        itemList = [{
          itemCode: action.data.datas.defaultItemCode,
          itemId: action.data.datas.defaultItemId,
          itemName: action.data.datas.defaultItemCode == 'TM' ? '特码': '',
        }];
      }
      state = state.set('pankouItems', itemList);
      state = state.set('apiRes', data);
      break;

    case LotteryConstant.REQUEST_LOTTERY_PEIYU:
      state = state.set('pankouPeiyu', action.data.datas);
      break;

    case LotteryConstant.REQUEST_LOTTERY_INFO:
      
      // 判断维护状态
      if (RES_MAINTAIN_CODE == action.data.errorCode) {
        state = state.set('isMaintain', true);
        state = state.set('maintainMsg', action.data.msg);
      } else {
        state = state.set('isMaintain', false);
        state = state.set('maintainMsg', '');
        state = state.set('platformInfo', action.data.datas);
      }

      break;

    case LotteryConstant.TEMP_SAVE_SELECTED_PEIYU:
      state = state.set('selectedPeiyu', action.data);
      break;

    case LotteryConstant.REQUEST_PREORDER_ITEMS:
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('preOrderList', action.data.datas);
      }
      break;

    case LotteryConstant.REQUEST_MULTI_GROUP_ORDER:
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('multiGroupOrder', action.data.datas);  
      }
      
      break;
    
    case LotteryConstant.REQUEST_LOTTERY_ORDER:
      if (action.data.errorCode == RES_OK_CODE) {
        pageNo = action.pageNo;
        if (pageNo == 1) {
          state = state.set('platformOrder',action.data.datas.list);
        } else {
          list = state.get('platformOrder');
          list = list.concat(action.data.datas.list);
          state = state.set('platformOrder',list);
        }
      }else{
        state = state.set('platformOrder', []);
      }

      state = state.set('apiRes', action.data);
      break;

    case LotteryConstant.REQUEST_WINNING_LIST:
      let items = action.data.datas;
      if (items.length <= 0) {
        items = [{remark: '暂无中奖'}];
      }
      state = state.set('winningList', (items));
      break;
  }

  return state;
}

