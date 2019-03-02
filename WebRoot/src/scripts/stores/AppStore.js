import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
let _store = null;

export default function appStore(initState = {}) {
  _store = compose(createStoreWithMiddleware(rootReducer, initState));
  return _store;
};