import {Map, List} from 'immutable';
import * as ChargeConstant from '../constants/ChargeConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';

const initState = Map({
  apiRes: {},
  recordHistories: {
    today: [],
    oneweek: [],
    onemonth: [],
    threemonth: []
  },
  crtRecordDetail: {
    
  },
  orderItemsHasMore: true,
});
export default function chargeRecord(state = initState, action) {
  switch (action.type) {
    case ChargeConstant.REQUEST_CHARGE_RECORD_HISTORY:

      if (action.data.errorCode == RES_OK_CODE) {
        let pageNo = action.pageNo;
        let pageSize = action.pageSize;
        let timeType = action.timeType;
        
        state = state.set('orderItemsHasMore', action.data.datas.length >= pageSize );

        if ( pageNo == 1 ) {
          let recordHistories = state.get('recordHistories');
          recordHistories[timeType] = action.data.datas;
          state = state.set('recordHistories', recordHistories);
        } else {
          let oldRecords = state.get('recordHistories');
          if (typeof oldRecords[timeType] == 'undefined') {
            oldRecords[timeType] = [];
          }

          oldRecords[timeType] = oldRecords[timeType].concat(action.data.datas);

          state = state.set('recordHistories', oldRecords);
        }

        state = state.set('apiRes', action.data);
      }
      
      break;

    case ChargeConstant.VIEW_CHARGE_RECORD:

      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('crtRecordDetail', action.data);
      }

      break;
  }
  return state;
}