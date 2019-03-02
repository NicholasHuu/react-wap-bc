import {Map, List} from 'immutable';
import {REQUEST_LIVE_GAME_ITEMS, RES_OK_CODE} from '../constants/AppConstant';

const initState = Map({
  items : ([]),
  allList :{}
});

const menuCode = 'live';

export default function(state = initState, action) {
  switch (action.type) {
    case REQUEST_LIVE_GAME_ITEMS:
      if (action.data.errorCode == RES_OK_CODE ) {
        for (let _m of action.data.datas) {
          if (_m.menuCode == menuCode) {
            state = state.set('items', _m.flatMenuList );
          }
        }
        state = state.set('allList', action.data.datas);
      }
      break;
  }
  return state;
}