import * as WithdrawConstant from '../constants/WithdrawConstant';

import {get, post} from '../../../utils/url';
import {withdrawLogsAPI, 
  bankCodesAPI,
  saveBankAPI,
  userWithdrawAPI,
  userBankListAPI} from '../utils/API';
import {format} from '../../../utils/datetime';

export function loadWithdrawRecord(time,type="", pageNo = 1, pageSize = 10,callback = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(withdrawLogsAPI(), {
      userName,
      time,
      type,
      pageNo,
      pageSize
    })
    .then(res => res.json())
    .then(json => {
      callback(json);
      dispatch({
        pageNo,
        type: WithdrawConstant.REQUEST_WITHDRAW_ITEMS,
        data: json
      });
    });
  };
}

export function loadUserBankItems(cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(userBankListAPI(), {
      userName
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: WithdrawConstant.REQUEST_USER_BANK_ITEMS,
        data
      });
      cb();
    });
  };
}

export function loadBankCodes() {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(bankCodesAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: WithdrawConstant.REQUEST_BANK_CODES,
        data
      });
    });
  };
}

export function saveUserBankItem(bankType, bankCard, bankAddress, withdrawPwd, cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(saveBankAPI(), {
      userName,
      bankType,
      bankCard,
      bankAddress,
      withdrawPwd
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
    });
  };
}

export function userWithdraw(balance, withdrawPwd, bankCode, cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(userWithdrawAPI(), {
      userName,
      balance,
      withdrawPwd,
      bankCode
    })
    .then( res => res.json())
    .then(data => {
      cb(data);
    });
  };
}

export function viewWithdrawLog(item) {
  return {
    type: WithdrawConstant.VIEW_WITHDRAW_LOG,
    data: item
  };
}