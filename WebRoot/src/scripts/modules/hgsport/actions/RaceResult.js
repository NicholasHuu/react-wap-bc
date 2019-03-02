import * as RaceConstant from '../constants/RaceResultConstant';
import {loadRaceResultURL} from '../utils/API';
import {post} from '../../../utils/url';

export function loadRaceResult(date, ballType) {
  return (dispatch, getState) => {
    post(loadRaceResultURL(), {
      date,
      ballType
    })
    .then( res => res.json())
    .then(data => {
      dispatch({
        type: RaceConstant.REQUEST_RACE_RESULT,
        data
      })
    });
  };
}