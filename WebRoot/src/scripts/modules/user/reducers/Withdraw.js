import * as WithdrawConstant from '../constants/WithdrawConstant';
import {Map, List} from 'immutable';
import {RES_OK_CODE} from '../../../constants/AppConstant';

const initState = Map({
  withdrawItems: [],
  userBankItems: [],
  bankCodes: [],
  orderItemsHasMore: true,
  canAddMoreBank: true,
  crtWithdrawLog: {},
  apiRes: {}
});

export default function (state = initState, action) {

  switch (action.type) {
    case WithdrawConstant.REQUEST_WITHDRAW_ITEMS:
      let pageNo = action.pageNo;

      if (action.data.errorCode == RES_OK_CODE) {
        if (action.pageNo == 1) {
          state = state.set('withdrawItems', []);
        }

        if (action.data.datas.length >= action.pageSize ) { 
          state = state.set('orderItemsHasMore', true);
        } else {
          state = state.set('orderItemsHasMore', false);
        }

        let oldRecords = state.get('withdrawItems');
        oldRecords = oldRecords.concat(action.data.datas);
        state = state.set('withdrawItems', oldRecords);
        state = state.set('apiRes', action.data);
      }

      break;
    case WithdrawConstant.REQUEST_USER_BANK_ITEMS:
      if (action.data.datas) {
        state = state.set('userBankItems', action.data.datas.list);
        state = state.set('canAddMoreBank', action.data.datas.addFlag);
        state = state.set('apiRes', action.data);
      }
      break;
    
    case WithdrawConstant.REQUEST_BANK_CODES:
      if(action.data.datas) {
        state = state.set('bankCodes', action.data.datas);
        state = state.set('apiRes', action.data);
      }
      break;

    case WithdrawConstant.VIEW_WITHDRAW_LOG:
      
      state = state.set('crtWithdrawLog', action.data);

      break;
  }


  return state;
}