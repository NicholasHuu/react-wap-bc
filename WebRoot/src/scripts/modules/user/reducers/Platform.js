import * as TransferConstant from '../constants/TransferConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {Map, List} from 'immutable';
const initState = Map({
  platformItems: [],  
  apiRes: {}
});

export default function (state = initState, action) {
  switch (action.type) {
    case TransferConstant.REQUEST_PLATFORM_ITEMS:
      if (action.data.errorCode == RES_OK_CODE) {
        let items = action.data.datas.edu ? action.data.datas.edu: action.data.datas;
        state = state.set('platformItems', items);
        state = state.set('apiRes', action.data);
      }
      break;

    case TransferConstant.REQUEST_PLATFORM_BALANCE:
      let platformItems = state.get('platformItems');
      for (let platform of platformItems) {
        if (platform.flat == action.data.flat) {
          let money = action.data.json.datas;
          if (money != null) {
            platform.flatMoney  = new Number(money).toFixed(2);
          }
        }
      }
      state = state.set('platformItems', platformItems.splice(0));
      break;
  }
  return state;
}