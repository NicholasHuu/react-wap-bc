import {Map, List} from 'immutable';

const initState = Map({
  allowBanks: [{
    name: '兴业银行',
    code: 'xyyy'
  }, {
    name: '农业银行',
    code: 'nyyy'
  }],
});

export default function Bank(state = initState, action) {
  return state;
}