import * as TransferConstant from '../constants/TransferConstant';
import {Map, List} from 'immutable';

const initState = Map({
  logItems: [],
  apiRes: {},
  orderItemsHasMore : true
});

export default function (state = initState, action) {
  switch (action.type) {
    case TransferConstant.REQUEST_TRANSFER_LOG:
      let pageNo = action.pageNo;
      if (action.data.datas.resultList.length > 0 ) {
        state = state.set('orderItemsHasMore', true);
        if(pageNo == 1){
          state = state.set('logItems', action.data.datas.resultList);  
        }else{
          let oldRecords = state.get('logItems');
          oldRecords = oldRecords.concat(action.data.datas.resultList);
          state = state.set('logItems', oldRecords);
        }
      }else {
        if (action.pageNo == 1) {
         state = state.set('logItems', []); 
        }

        state = state.set('orderItemsHasMore', false);
      }
      state = state.set('apiRes', action.data);
      break;
  }
  return state;
}
