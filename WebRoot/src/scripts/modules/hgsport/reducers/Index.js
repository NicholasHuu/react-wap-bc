import {combineReducers} from 'redux';

import huangguan from './Huangguan';
import raceresult from './RaceResult';

const reducers = combineReducers({
  huangguan,
  raceresult
});

export default reducers;