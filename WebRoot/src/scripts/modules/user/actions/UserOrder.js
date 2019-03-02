import * as OrderConstant from '../constants/OrderConstant';

import {post, get} from '../../../utils/url';
import {orderHistoryAPI, 
    allLotteryAPI, 
    lotteryOrderItemsAPI,
    lotteryOrderDetailAPI, 
    lotteryTraceItemsAPI,
    stopTraceAPI,
    cancelLotteryOrderAPI,
    lotteryFundsAPI,
    userProfitAPI,
    userFlatProfitAPI,
    teamProfitAPI,
    promoLinksAPI,
    deletePromoLinkAPI,
    createPromoLinkAPI,
    userSalaryAPI,
    updateSalaryAPI,
    addSalaryAPI,
    salaryDetailAPI,
    teamMemberAPI,
    updateTeamMemberFdAPI,
    postStationLetterAPI,
    teamMemberTransferAPI,
    updateTeamMemberRemarkAPI,
    postSalaryAPI,
    lotteryTraceDetailAPI} from '../utils/API';
import {format} from '../../../utils/datetime';

export function loadUserOrderItems(time, flat, pageNo = 1, pageSize = 10,cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(orderHistoryAPI(), {
      userName,
      time,
      flat,
      pageNo,
      pageSize
    })
    .then(res => res.json())
    .then(json => {
      cb(json);
      dispatch({
        type: OrderConstant.REQUEST_ORDER_ITEMS,
        data: json,
        pageNo
      });
    });
  };
}

export function loadAllLottery(cb = () => {}) {
  return (dispatch, getState) => {
    post(allLotteryAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_ALL_LOTTERY,
        data
      });
      cb();
    });
  };
}

// params:
//   lotteryCode = '', startTime = '', finishTime = '', account = ''
export function loadLotteryOrderItems(params = {}, currentPage = 1, cb = () => {}) {
  params['currentPage'] = currentPage;
  return (dispatch, getState) => {
    post(lotteryOrderItemsAPI(), params)
    .then( res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_LOTTERY_ORDER_ITEMS,
        data,
        page: currentPage
      });

      cb(data);
    });
  };
}

export function loadLotteryOrderDetail(id, cb = () => {}) {
  return (dispatch, getState) => {
    post(lotteryOrderDetailAPI(), {
      id
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_LOTTERY_ORDER_DETAIL,
        data
      });
      cb();
    });
  };
}

export function loadLotteryTraceItems(params, currentPage = 1, cb = () => {} ) {

  params['currentPage'] = currentPage;

  return (dispatch, getState) => {
    post(lotteryTraceItemsAPI(), params)
    .then(res => res.json())
    .then( data => {
      dispatch({
        type: OrderConstant.REQUEST_LOTTERY_TRACE_ITEMS,
        data,
        page: currentPage
      });
      cb(data);
    });
  };
}

export function loadLotteryTraceDetail(id, number, cb = () => {}) {
  return (dispatch, getState) => {
    post(lotteryTraceDetailAPI(), {
      orderNumber: number,
      orderId: id
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_LOTTERY_TRACE_DETAIL,
        data
      });
      cb();
    });
  };
}

export function stopTrace(orderNumber, cb = () => {}) {
  return (dispatch, getState) => {
    post(stopTraceAPI(), {
      orderNumber
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_STOP_TRACE,
        data
      });

      cb(data);
    });
  };
}

export function cancelLotteryOrder(id, cb = () => {}) {
  return (dispatch, getState) => {
    post(cancelLotteryOrderAPI(), {
      id
    })
    .then( res => res.json() )
    .then( data => {
      cb(data);
    });
  };
}

export function loadLotteryFunds(params, currentPage, cb = () => {}) {
  params['currentPage'] = currentPage;
  return (dispatch, getState) => {
    post(lotteryFundsAPI(), params)
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_LOTTERY_FUNDS_LOG,
        data,
        page: currentPage
      });
      cb();
    });
  };
}

export function loadUserProfit(params, currentPage, cb = () => {}) {
  params['currentPage'] = currentPage;

  return (dispatch, getState) => {
    post(userProfitAPI(), params)
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_USER_PROFIT,
        data,
        page: currentPage
      });
      cb();
    });
  };
}
export function loadUserFlatProfit(params, currentPage, cb = () => {}) {
  params['currentPage'] = currentPage;
  return (dispatch, getState) => {
    post(userFlatProfitAPI(), params)
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_USER_PROFIT,
        data,
        page: currentPage
      });
      cb();
    });
  };
}

export function loadTeamProfit(params, currentPage, cb = () => {}) {
  params['currentPage'] = currentPage;

  return (dispatch, getState) => {
    post(teamProfitAPI(), params)
    .then(res => res.json())
    .then(data => {
      cb(data);
      dispatch && dispatch({
        type: OrderConstant.REQUEST_TEAM_PROFIT,
        data,
        page: currentPage
      });
    });
  };
}

export function loadPromoLinks(cb = () => {} ) {
  return (dispatch, getState) => {
    post(promoLinksAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: OrderConstant.REQUEST_PROMO_LINKS,
        data
      });
      cb();
    });
  };
}

export function deletePromoLink(id, cb = () => {}) {
  post(deletePromoLinkAPI(), {
    id
  })
  .then( res => res.json())
  .then( data => {
      cb(data);
  });
}

export function createPromoLink(params, cb = () => {}) {
  post(createPromoLinkAPI(), params)
  .then(res => res.json())
  .then(data => {
    cb(data);
  });
}

export function loadSelfSalary(cb = () => {}) {
  return (dispatch, getState) => {
    post(userSalaryAPI(), {
      flag: 1,
      currentPage: 1
    })
    .then(res => res.json())
    .then(data => {
      cb();
      dispatch({
        type: OrderConstant.REQUEST_SELF_SALARY,
        data,
      });
    })
  };
}

export function testChildSalaryExist(userName, cb = () => {}) {
  post(userSalaryAPI(), {
    account: userName,
    flag: 0,
  })
  .then( res => res.json() )
  .then( data => {
    cb(data);
  });
}

export function loadChildSalary(params, currentPage = 1, cb = () => {}) {
  params['currentPage'] = currentPage;
  params['flag'] = 0;
  return (dispatch, getState) => {
    post(userSalaryAPI(), params)
    .then( res => res.json() )
    .then( data => {
      cb();
      dispatch({
        type: OrderConstant.REQUEST_CHILD_SALARY,
        data,
        page: currentPage
      });
    });
  }; 
}

export function updateSalarySetting(params, cb) {
  post(updateSalaryAPI(), params)
  .then( res => res.json())
  .then( data => {
    cb(data);
  });
}

export function addSalarySetting(params, cb){
  post(addSalaryAPI(), params)
  .then( res => res.json())
  .then( data => {
    cb(data);
  });
}

export function loadSalaryDetailItems(params, currentPage = 1, cb = () => {}) {
  return (dispatch, getState) => {
    post(salaryDetailAPI(), params)
    .then( res => res.json())
    .then( data => {
      cb();
      dispatch({
        type: OrderConstant.REQUEST_SALARY_DETAIL,
        data,
        page: currentPage
      });
    });
  };
}

export function postSalary(zjPassword, id, cb = () => {}) {
  post(postSalaryAPI(), {
    id,
    zjPassword
  })
  .then(res => res.json())
  .then(cb);
}

function _loadTeamMember(isAgent, account, currentPage, cb, flag = 0) {
  let params = {};
  params['account'] = account;
  params['currentPage'] = currentPage;
  params['flag'] = flag;
  params['isAgent'] = isAgent;
  return (dispatch, getState) => {
    post(teamMemberAPI(), params)
    .then(res => res.json())
    .then(data => {
      cb();
      dispatch({
        type: isAgent == 1 ? OrderConstant.REQUEST_TEAM_MEMBER_OF_AGENT: OrderConstant.REQUEST_TEAM_MEMBER_OF_ACCOUNT,
        data,
        page: currentPage
      });
    });
  };
}

// 获取下级代理
export function loadTeamMemberOfAgent(account, currentPage, cb = () => {}, flag = 0) {
  return _loadTeamMember(1, account, currentPage, cb, flag);
}

// 获取下级会员
export function loadTeamMemberOfAccount(account, currentPage, cb = () => {}, flag = 0) {
  return _loadTeamMember(0, account, currentPage, cb, flag);
}

export function updateTeamMemberFd(id, account, back,liveBack,electronicBack,sportBack,fishBack, cb = () => {}) {
  post(updateTeamMemberFdAPI(), {
    id,
    account,
    back,
    liveBack,
    electronicBack,
    sportBack,
    fishBack,
  })
  .then(res => res.json())
  .then(data => cb(data));
}

export function postStationLetter(type, title, content, receiver, cb = () => {}) {
  post(postStationLetterAPI(), {
    type,
    title,
    content,
    receiver
  })
  .then(res => res.json())
  .then(data => cb(data));
}

export function teamMemberTransfer(params, cb = () => {}) {
  post(teamMemberTransferAPI(), params)
  .then( res => res.json())
  .then(cb);
}

export function updateTeamMemberRemark(id, account, remark, cb = () => {}) {
  post(updateTeamMemberRemarkAPI(), {
    id,
    account,
    remark
  })
  .then( res => res.json())
  .then(cb);
}