import {Map, List} from 'immutable';
import {REQUEST_ELECT_TYPES, REQUEST_ELECT_GAME_ITEMS, RES_OK_CODE} from '../constants/AppConstant';

const initState = Map({
  types: [],
  gameItems: Map({
    ag: ([])
  }),
  apiRes: {},
});

const menuCode = 'electronic';

export default function (state = initState, action) {
  switch (action.type) {
    case REQUEST_ELECT_TYPES:
      
      if (action.data.errorCode == RES_OK_CODE) {
        for (let _m of action.data.datas) {
          if (_m.menuCode == menuCode) {
            state = state.set('types', _m.flatMenuList);
          }
        }
      }
      
      break;
    case REQUEST_ELECT_GAME_ITEMS:
      let flat = action.data.flat;
      let list = action.data.datas.list;
      let gameItems = state.get('gameItems');
      let flatGameItems = gameItems.get(flat);

      if (!flatGameItems) {
        flatGameItems = ([]);
      }
      if (action.data.pageNo == 1) {
        flatGameItems = (list);
      } else {
        flatGameItems = flatGameItems.concat((list));
      }
     
      gameItems = gameItems.set(flat, flatGameItems);
      state = state.set('gameItems', gameItems);
      state = state.set('apiRes', action.data);
      break;
  }
  return state;
}