import {Map, List} from 'immutable';
import {REQUEST_SPORT_ITEMS, RES_OK_CODE} from '../constants/AppConstant';

const initState = Map({
  sports: ([])
});

const menuCode = 'sport';

export default function Sport(state = initState, action) {
  switch (action.type) {
    case REQUEST_SPORT_ITEMS:
      if (RES_OK_CODE == action.data.errorCode) {
        for (let _m of action.data.datas) {
          if (_m.menuCode  == menuCode) {
            state = state.set('sports', _m.flatMenuList);
          }
        }
      }
      break;
  }
  return state;
}