import {Map, List} from 'immutable';
import {REQUEST_BBIN_ITEMS, RES_OK_CODE} from '../constants/AppConstant';

const initState = Map({
  items: []
});

const menuCode = 'bbin';

export default function (state = initState, action) {
  switch (action.type) {
    case REQUEST_BBIN_ITEMS:
      if (action.data.errorCode == RES_OK_CODE) {
        for (let _m of action.data.datas) {
          if (_m.menuCode == menuCode) {
            state = state.set('items', _m.flatMenuList);
          }
        }
      }
      break;
  }
  return state;
}