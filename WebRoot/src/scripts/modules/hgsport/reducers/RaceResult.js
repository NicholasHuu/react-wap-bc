import {Map, List} from 'immutable';
import * as RaceConstant from '../constants/RaceResultConstant';
import {RES_OK_CODE, RES_MAINTAIN_CODE} from '../../../constants/AppConstant'; 

const initState = Map({
  gameResults: [],
  isMaintain: false,
  maintainMsg: '',
});

export default function (state = initState, action) {
  switch (action.type)  {
    case RaceConstant.REQUEST_RACE_RESULT:

      if (RES_MAINTAIN_CODE == action.data.errorCode) {
        state = state.set('isMaintain', true);
        state = state.set('maintainMsg', action.data.msg);
      } else {
        state = state.set('isMaintain', false);
        state = state.set('maintainMsg', '');
      }
      
      state = state.set('gameResults', action.data.datas);
      break;
  }

  return state;
}