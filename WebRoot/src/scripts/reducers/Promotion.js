import {Map, List} from 'immutable';
import * as AppConstant from '../constants/AppConstant';

const initState = Map({
  items: [],
});

export default function (state = initState, action) {
  switch (action.type) {
    case AppConstant.REQUEST_PROMOTION_ITEMS:
      state = state.set('items', action.data.datas.list);
      break;
  }
  return state;
}