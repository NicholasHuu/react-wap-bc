import {combineReducers} from 'redux';

import user from './User';
import message from './Message';

import bank from './Bank';
import chargeRecord from './ChargeRecord';
import platform from './Platform';
import order from './Order';
import transferlog from './TransferLog';
import withdraw from './Withdraw';
import charge from './Charge';
import {RES_OK_CODE} from '../../../constants/AppConstant';

export const migratePagedAction = (action, state, key) => {
  if (action.data.errorCode == RES_OK_CODE) {
    let items = Object.assign({}, state.get(key));
    if (action.page == 1) {
      items = {
        items: action.data.datas.resultList,
      };
    } else {
      items.items = items.items.concat(action.data.datas.resultList);
    }
    items.totalRows = action.data.datas.totalRows;
    items.totalPage = action.data.datas.totalPages;
    console.log(['items', items]);
    state = state.set(key, items);
  } else {
    state = state.set(key, {
      totalRows: 0,
      totalPages: 0,
      items: [],
    });
  }

  return state;
}

const reducers = combineReducers({
  user,
  message,
  bank,
  chargeRecord,
  platform,
  order,
  withdraw,
  transferlog,
  charge
});

export default reducers;