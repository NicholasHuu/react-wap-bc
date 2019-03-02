import * as LotteryConstant from '../constants/LotteryConstant';
import {get,post, parseQuery} from '../../../utils/url';
import {gamesListAPI, 
  gameTypeAPI , 
  getOpenResultAPI, 
  getOpenResultResultAPI, 
  gamePankouListAPI,
  platFormInfoAPI,
  saveOrderAPI,
  getLMOrderAPI,
  getMultiGroupOrderAPI,
  getGroupOrderAPI,
  getPlatformOrderAPI,
  winningListAPI,
  gameRuleAPI,
  sliderAPI,
  platformPeiyuAPI} from '../utils/API';

import {homeElectricMenuAPI} from '../../../utils/url';

export function getLotteryGames() {
  return (dispatch, getState) => {
    post(homeElectricMenuAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: LotteryConstant.REQUEST_LOTTERY_GAMES,
        data: data
      });
    });
  };
}

export function getLotteryGameTypes(gameid) {
  return (dispatch, getState) => {
    get(gameTypeAPI(gameid))
    .then(res => res.json())
    .then(json => {
      let data = JSON.parse(json);
      dispatch({
        type: LotteryConstant.REQUEST_LOTTERY_TYPES,
        data: data
      });
    });
  };
}

export function getOpenResult(){
  return (dispatch,getState) => {
    post(getOpenResultAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: LotteryConstant.REQUEST_OPEN_RESULT,
        data: data
      });
    })
  }
}

export function resetOpenResultResult() {
  return {
    type: LotteryConstant.REQUEST_OPEN_RESULT_DETAIL,
    data: {
      errorCode: '000000',
      msg: 'success',
      datas:　{
        
      }
    }
  };
}

export function getOpenResultResult(gameCode,pageNo){
  return (dispatch,getState) => {
    post(getOpenResultResultAPI(),{
      gameCode,
      pageNo
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: LotteryConstant.REQUEST_OPEN_RESULT_DETAIL,
        pageNo: pageNo,
        data: data
      });
    })
  }
}

export function loadPlatformPankou(gameCode, location) {
  return (dispatch, getState) => {
    post(gamePankouListAPI(), {
      gameCode
    })
    .then(res => res.json())
    .then(data => {
      
      let query = parseQuery(location.search);

      let pankou = data.datas.defaultItemCode;
      if (query.pankou) {
        pankou = query.pankou;
      }
      
      dispatch({
        type: LotteryConstant.REQUEST_LOTTERY_PANKOU,
        data
      });
      // 加载彩票开盘信息 
      dispatch(loadPlatformInfo(data.datas.gameCode, pankou));
      
      // 加载赔率
      let itemCode = query.pankou ? query.pankou: data.datas.defaultItemCode;
      dispatch(loadPlatformPeiyu(gameCode, itemCode));
    });
  };
}

export function loadPlatformPeiyu(gameCode, itemCode) {
  return (dispatch, getState) => {
    post(platformPeiyuAPI(), {
      gameCode,
      itemCode
    })
    .then(res =>res.json())
    .then(data => {

      dispatch({
        type: LotteryConstant.REQUEST_LOTTERY_PEIYU,
        data
      });

    });
  };
}

export function loadPlatformInfo(gameCode, itemCode) {
  return (dispatch, getState) => {
    let lottery = getState().lotteryModule.lottery;
    let platformTypes = lottery.get('gameTypes');
    let pankouTypes = lottery.get('pankouItems');

    post(platFormInfoAPI(), {
      gameCode,
      itemCode
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: LotteryConstant.REQUEST_LOTTERY_INFO,
        data
      });
    });
  };
}

export function tempSaveSelectedPeiyu(selectedPeiyu) {
  return {
    type: LotteryConstant.TEMP_SAVE_SELECTED_PEIYU,
    data: selectedPeiyu
  };
}

export function saveOrder(gameCode, jsons, cb= () => {}, orderFlag = 'normal') {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');

    post(saveOrderAPI(), {
      gameCode,
      userName,
      orderFlag,
      jsons: JSON.stringify(jsons)
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
    });
  };
}

export function getLmOrder(gameCode, nums, rrtype, pabc, cb = () => {},  dm1 = 0, dm2 = 0) {
  return (dispatch, getState) => {
    post(getLMOrderAPI(), {
      gameCode,
      nums,
      rrtype,
      pabc,
      dm1,
      dm2
    })
    .then(res => res.json())
    .then(data => {
      
      cb(data);

      dispatch(preOrderItems(data));
    });
  };
}

export function preOrderItems(data) {
  return {
    type: LotteryConstant.REQUEST_PREORDER_ITEMS,
    data
  }; 
}

export function getMultiGroupOrder(gameCode, nums, multilen, cb = () => {}) {
  return (dispatch, getState) => {
    post(getMultiGroupOrderAPI(), {
      gameCode,
      cids: nums.join(','),
      multilen
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
      
      dispatch(multiGroupOrder(data));
    });
  };
}

export function multiGroupOrder(data) {
  return {
    type: LotteryConstant.REQUEST_MULTI_GROUP_ORDER,
    data
  };
}

export function getPlatformOrder(userName, beginTimeStr, endTimeStr, gameCode, pageNo, cb = () => {}){
  return ( dispatch,getState ) => {
    post(getPlatformOrderAPI(),{
      userName,
      beginTimeStr,
      endTimeStr,
      gameCode,
      pageNo
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
      dispatch({
        type:LotteryConstant.REQUEST_LOTTERY_ORDER,
        data: data,
        pageNo
      });
    })
  }
}

export function getGroupOrder(gameCode, itemCode, xzlxCode, multilen, nums, cb = () => {}) {
  return (dispatch, getState) => {
    post(getGroupOrderAPI(), {
      gameCode,
      itemCode,
      xzlxCode,
      multilen,
      number: nums.join(','),
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
      
      dispatch({
        type: LotteryConstant.REQUEST_MULTI_GROUP_ORDER,
        data
      });
    });
  };
}

export function getWinList() {
  return (dispatch, getState) => {
    post(winningListAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: LotteryConstant.REQUEST_WINNING_LIST,
        data
      });
    });
  }
}

export function getGameRule(ruleCode) {
  return (dispatch, getState) => {
    post(gameRuleAPI(), {
      ruleType: 'cp_rule_type',
      ruleCode
    })
    .then(res => res.json())
    .then(data => {
      data.ruleCode = ruleCode;
      dispatch({
        type: LotteryConstant.REQUEST_GAME_RULE,
        data
      });
    });
  };
}

export function loadSlider(code = 'lottbanner') {
  return (dispatch, getState) => {
    post(sliderAPI(), {
      code
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: LotteryConstant.REQUEST_LOTTERY_SLIDER,
        data
      });
    });
  };
}