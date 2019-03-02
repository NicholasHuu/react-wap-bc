import {combineReducers} from 'redux';

import home from './Home';
import lottery from './Lottery';

const reducers = combineReducers({
  home,
  lottery
});

export default reducers;