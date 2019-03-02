import {Map, List} from 'immutable';
import {REQUEST_LOTTERY_MAIN} from '../constants/LotteryConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';

const initState = Map({
  sliders: [],
  marqueeMsgs: [],
  tlotteryItems: [],
});

const handlers = {
  [REQUEST_LOTTERY_MAIN]: (state, action) => {
    if (action.data.errorCode == RES_OK_CODE) {
      // 轮播

      state = state.set('sliders', action.data.datas.banner);

      // 通知
      let noticeArray = action.data.datas.gonggao;
      let _msgs = [];
      for (let notice of noticeArray) {
        _msgs.push(notice.ganggaoContent);
      }
      state = state.set('marqueeMsgs', _msgs);

      // 菜单
      let menuArray = action.data.datas.menu;
      let _items = [];
      for (let menuItem of menuArray) {
        _items.push({
          bg: menuItem.bigPicUrl,
          img: menuItem.bigPicUrl,
          name: menuItem.menuName,
          key: menuItem.menuCode,
          summary: menuItem.remark
        });
      }
      state = state.set('tlotteryItems', _items);
      
    }
    
    return state;
  }
};

export default (state = initState, action) => {
  let handler = handlers[action.type];
  return handler? handler(state, action): state;
};


