import {REQUEST_LOTTERY_MAIN, 
  REQUEST_PLAY_METHOD,
  REQUEST_LOTTERY_DETAIL,
  HIDE_OR_VIEW_YL,
  REQUEST_LOTTERY_RESULT,
  REQUEST_OPEN_INFO,
  SAVE_LOTTERY_ORDER,
  DELETE_LOTTERY_ORDER,
  CLEAN_LOTTERY_ORDER,
  SUBMIT_LOTTERY_ORDER,
  REQUEST_CHASE_QS,
  GENERATE_CHASE_QS,
  CLEAN_CHASE_QS,
  REQUEST_LOTTERY_TREND,
  QUICK_VIEW_HISTORY_COUNT,
  REQUEST_TINY_USER_RESOURCE,
  REQUEST_NUMBERS} from '../constants/LotteryConstant';
import {post} from '../../../utils/url';
import {lotteryMainAPI, 
  playMethodAPI, 
  numbersAPI, 
  lotteryDetailAPI, 
  lotteryResultAPI, 
  openInfoAPI, 
  submitOrderAPI,
  lotteryTrendAPI,
  memberTinyResourceAPI,
  chaseQsAPI} from '../utils/API';

export function loadLotteryMain(lotteryCode = '') {
  return dispatch => {
    post(lotteryMainAPI())
    .then( res => res.json())
    .then(data => {

      dispatch({
        type: REQUEST_LOTTERY_MAIN,
        data
      });

      // 解析彩票号码
      dispatch({
        type: REQUEST_PLAY_METHOD,
        data
      });

      // 如果传入了彩票代码 则加载彩票详情内容
      if (lotteryCode) {
        dispatch(loadLotteryDetail(lotteryCode, data.datas.menu[0].gameList[0].list[0].gameCode));
      }
      
    });
  };
}

export function loadTinyUserResource() {
  return dispatch => {
    post(memberTinyResourceAPI())
    .then( res => res.json() )
    .then(data => {
      
      dispatch({
        type: REQUEST_TINY_USER_RESOURCE,
        data
      });

    });
  };
}

export function loadLotteryDetail(lotteryCode) {
  return dispatch => {
    post(lotteryDetailAPI(), {
      lotteryCode
    })
    .then( res => res.json())
    .then( data => {

      dispatch({
        type: REQUEST_LOTTERY_DETAIL,
        lottery: lotteryCode,
        data 
      });

    });
  };
}

export function hideViewYl(force = false) {
  return {
    type: HIDE_OR_VIEW_YL,
    data: {
      force,
    }
  };
}

export function loadOpenResult(lotteryCode) {
  return dispatch => {
    post(lotteryResultAPI(), {
      lotteryCode,
      count: QUICK_VIEW_HISTORY_COUNT
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: REQUEST_LOTTERY_RESULT,
        data
      });
    });
  }
}

export function loadOpenInfo(lotteryCode, gameCode) {
  return dispatch => {
    post(openInfoAPI(), {
      lotteryCode,
      gameCode,
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: REQUEST_OPEN_INFO,
        data
      });
    });
  };
}

// 保存订单
export function saveOrder(lottery, gameCode, num, zhushu, bs, unit, bonusType) {
  return {
    type: SAVE_LOTTERY_ORDER,
    data: {
      lottery,
      gameCode,
      num,
      zhushu,
      bs,
      unit,
      bonusType
    }
  };
}

// 删除订单 - orderId 为订单列表数组的索引值
export function cancelOrder(orderId) {
  return {
    type: DELETE_LOTTERY_ORDER,
    data: {
      orderId
    }
  }
}

// 清除订单列表
export function cleanOrder() {
  return {
    type: CLEAN_LOTTERY_ORDER,
  };
}

// 提交订单
// TODO:: 追号
export function submitOrder(cb = () => {}, isTrace = 0 , traceWinStop = 0) {
  return (dispatch, getState) => {

    let state = getState();
    const {lotteryTimes} = state;

    let lottery = lotteryTimes.lottery;
    let selectedOrders = lottery.get('selectedOrder');
    let lastOrder = lottery.get('lastSelectOrder');
    let crtQs = lottery.get('crtInfo').crtFullQs;

    if (selectedOrders.length <= 0 ) return ;
  

    let amount = 0; // 总金额
    let counts = 0; // 总注数
    let bs = 1; // 倍数
    let orders = [];
    let traceOrder = [];
    for (let order of selectedOrders) {
      amount += order.bs * order.zhushu * order.unit.value;
      counts += order.zhushu;
      orders.push({
        lotteryGame: order.gameCode,
        content: order.num.full,
        counts: order.zhushu,
        unit: order.unit.value,
        bounsType: order.bonusType,
        multiple: order.bs,
      });
    }
    
    // 追号
    let chaseItems = lottery.get('chaseQs');
    if (chaseItems.length > 0) {


      for (let item of chaseItems ) {
        if (item.checked || typeof item.checked == 'undefined') {
          traceOrder.push({
            qs: item.lqs,
            betMultiple: item.bs
          }); 
        }
      }
    } else {
      traceOrder.push({
        qs: crtQs,
        betMultiple: bs
      });
    }

    let postdata = {
      lotteryCode: lastOrder.lottery,
      amount,
      counts,
      isTrace,
      traceWinStop,
      order: JSON.stringify(orders),
      traceOrder: JSON.stringify(traceOrder) 
    };

    post(submitOrderAPI(), postdata)
    .then(res => res.json())
    .then(data => {
      cb(data);
      dispatch({
        type: SUBMIT_LOTTERY_ORDER,
        data
      });
    });
  };
}

export function getChaseQs(params, cb) {
  return dispatch => {
    post(chaseQsAPI(), params)
    .then(res => res.json())
    .then(json => {
      dispatch({
        type: REQUEST_CHASE_QS,
        data: json
      });

      cb(json);
    });
  };
}

export function cleanChaseQs() {
  return {
    type: CLEAN_CHASE_QS
  };
}

export function generateChaseQs(data) {
  return {
    type: GENERATE_CHASE_QS,
    data
  }
}

export function loadLotteryTrend(lotteryCode) {
  return (dispatch, getState) => {
    post(lotteryTrendAPI(), {
      lotteryCode
    })
    .then( res => res.json())
    .then( data => {
      dispatch({
        type: REQUEST_LOTTERY_TREND,
        data
      });
    });
  };
}