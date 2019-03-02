import {Map, List} from 'immutable';

import * as AppConstant from '../constants/AppConstant';

const initState = Map({
  login: [],
  register: [],
  home: [],
  footer: [],
  articleList: []
});

export default function (state = initState, action) {
  let data = action.data;
  switch (action.type) {
    case AppConstant.REQUEST_REGION_BRICK:
      if (data.errorCode == AppConstant.RES_OK_CODE) {
        let regionCode = data.regionCode;
        state = state.set(regionCode, data.datas);
      }
      break;

    case AppConstant.REQUEST_DYNAMIC_ARTICLE_LIST:

      if (data.errorCode == AppConstant.RES_OK_CODE) {
        state = state.set('articleList', action.data.datas);
      }
      break;

    case AppConstant.CLEAN_DYNAMIC_ARTICLE: 
      state = state.set('home', []).set('articleList', []);
      break;
  }

  return state;
}