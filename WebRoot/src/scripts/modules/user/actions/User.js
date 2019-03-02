import * as UserConstant from '../constants/UserConstant';

import {userInfoAPI, 
  changePwdAPI, 
  changeWithdrawAPI, 
  loginAPI, 
  registerAPI, 
  logoutAPI,
  banklistAPI,
  agentInfoAPI,
  securityInfoAPI,
  agentApplyAPI,
  memberResourceAPI,
  mainPanelAPI,
  changeUserBasicInfoAPI,
  relieveBankAPI,
  smsSendAPI,
  verifySMSCodeAPI,
  resetPwdAPI,
  updateNicknameAPI,
  addTeamMemberAPI,
  lotteryHowtoAPI,
  userBalanceAPI,
  bindMobilePhoneAPI,
  updateWithdrawProfileAPI,
  agentRegisterAPI,
  modifyBankInfoAPI} from '../utils/API';

import cache from '../../../utils/cache';

import {get, post, put} from '../../../utils/url';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {loadSystemCode as _loadSystemCode} from './Charge';

export const loadSystemCode = _loadSystemCode;

export function loadUserInfo(cb = () => {}) {
  return (dispatch, getState) => {
    let state = getState();
    post(userInfoAPI())
    .then(res => res.json())
    .then(data => {
      try {
        dispatch({
          type: UserConstant.REQUEST_USER_INFO,
          data: data
        });
        cb();
      } catch (e) {
        console.error(e.toString());
      }
    });
  };
}

export function loadUserBalance() {
  return (dispatch, getState) => {
    post(userBalanceAPI())
    .then( res => res.json())
    .then( data => {
      dispatch({
        type: UserConstant.REQUEST_USER_BALANCE,
        data
      });
    } );
  };
}

export function changeLoginPwd(oldPwd, newPwd, cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(changePwdAPI(), {
      userName,
      newPwd,
      oldPwd
    })
    .then(res => res.json())
    .then(json => {
      cb(json);
    });
  }
}

export function changeWithdrawPwd(oldPwd, newPwd, cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(changeWithdrawAPI(), {
      userName,
      newPwd,
      oldPwd
    })
    .then(res => res.json())
    .then(json => {
      cb(json);
    });
  };
}

export function userLogin(userName = '', password = '', yzm = '', cb = () => {}) {
  return (dispatch, getState) => {
    post(loginAPI(), {
      userName,
      password,
      yzm
    })
    .then(res => res.json())
    .then(data => {
      if (data.errorCode  == RES_OK_CODE) {
        userName = data.datas.userName;
        cb(true);
        dispatch({
          type: UserConstant.REQUEST_USER_LOGIN,
          data: {
            userName
          },
        });
        dispatch(loadUserInfo());
      } else {
        cb(false, data.msg);
      }
    });
  };
}

export function userRegister(params, cb = () => {}) {
  return (dispatch, getState) => {
    post(registerAPI(), params)
    .then(res => res.json())
    .then(data => {
      cb(data);
    });
  };
}

export function userLogout(cb = () => {}) {
  alert("come");
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(logoutAPI(), {
      userName
    })
    .then(res => res.json())
    .then(data => {
      cache.remove('tempOrderData');
      cb(data);
    });
  };
}

export function getBankList(cb = () => {}){
  return (dispatch ,getState) => {
    post(banklistAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: UserConstant.REQUEST_BANK_LIST,
        data: data
      });
      cb();
    })
  }
}

export function securityLog(){
  return (dispatch ,getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(securityInfoAPI(),{
      userName
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: UserConstant.REQUEST_SECURITY_INFO,
        data: data
      });
    })
  }
}


export function changeUserBasicInfo(userQq = null,userMail = null ,callback = () => {}){
  console.log([userQq, userMail]);
  if (!userQq && !userMail) {
    callback({
      errorCode: RES_OK_CODE,
      msg: '', 
    });
  }
  return (dispatch,getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    let body = {
      userName
    };
    if(userQq) {
      body.userQq = userQq;
    }
    if (userMail) {
      body.userMail = userMail;
    }
    post(changeUserBasicInfoAPI(), body)
    .then(res => res.json())
    .then(data => {
      callback(data);
      dispatch({
        type: UserConstant.REQUEST_CHANGE_BASIC_INFO,
        data: data
      });
    })
  }
}

export function loadUserAgentInfo() {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(agentInfoAPI(), {
      userName
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: UserConstant.REQUEST_AGENT_INFO,
        data
      });
    });
  };
}

export function applyUserAgentInfo(agentType, content, agentMail, cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(agentApplyAPI(), {
      userName, 
      agentType,
      content,
      agentMail
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
    });
  };
}

export function loadUserPanelInfo(cb = () => {}) {
  return (dispatch, getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(memberResourceAPI(), {
      userName
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: UserConstant.REQUEST_PANEL_MENU,
        data: data
      });
      cb();
    });
  };
}

export function loadProtocol() {
  return (dispatch, getState) => {
    let key = 'msg010';
    post(mainPanelAPI(), {
      key
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: UserConstant.REQUEST_PROTOCOL,
        data
      });
    });
  };
}

export function relieveBank(id,withdrawPwd,cb = () => {}){
  return (dispatch,getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(relieveBankAPI(),{
      userName,
      id,
      withdrawPwd
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
    })
  }
}

export function modifyBankInfo(id,bankCard,bankAddress,withdrawPwd,bankType,cb = () =>{} ){
  return (dispatch,getState) => {
    let userName = getState().userModule.user.get('auth').get('userName');
    post(modifyBankInfoAPI(),{
      userName,
      bankType,
      bankCard,
      bankAddress,
      withdrawPwd,
      id
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
    })
  }
}

export function sendSMSCode(phone, account, cb = () => {}, businessType = 2) {
  post(smsSendAPI(), {
    phone,
    account,
    businessType
  })
  .then(res => res.json())
  .then(cb);
}

export function verifySMSCode(account, phone, code, cb = () => {}) {
  return dispatch => {
    post(verifySMSCodeAPI(), {
      account,
      phone,
      code
    })
    .then(res => res.json())
    .then(data => {
      cb(data);
      dispatch({
        type: UserConstant.REQUEST_SMS_CODE_VERIFY,
        data,
        account,
        phone
      });
    });
  };
}

export function resetPassword(account, phone, key, pwd, cb = () => {}) {
  post(resetPwdAPI(), {
    account,
    phone,
    key,
    pwd
  })
  .then(res => res.json())
  .then(cb);
}

export function updateNickname(nickName, cb = () =>{}) {
  post(updateNicknameAPI(), {
    nickName
  })
  .then(res => res.json())
  .then(cb);
}

export function updateUserInfo(data, cb = () => {}) {
  post(updateNicknameAPI(), data)
  .then(res => res.json())
  .then(cb);
}

export function addTeamMember(params, cb = () =>{} ) {
  post(addTeamMemberAPI(), params)
  .then(res => res.json())
  .then(cb);
}

export function loadLotteryHowto(code, cb = () => {}) {
  return (dispatch, getState) => {
    post(lotteryHowtoAPI(), {
      lotteryCode: code,
      client: 2
    })
    .then( res => res.json())
    .then( data => {
      cb();
      dispatch({
        type: UserConstant.REQUEST_LOTTERY_HOWTO,
        data,
        lottery: code
      });
    });
  };
}

export function updateWithdrawProfile(params, cb = () => {}) {
  post(updateWithdrawProfileAPI(), params)
  .then( res => res.json() )
  .then( cb );
}

export function bindMobilePhone(mobile, code, cb = () => {}) {
  post(bindMobilePhoneAPI(), {
    mobile, code
  })
  .then(res => res.json())
  .then( cb);
}

export function registerWithAgentCode(values, cb = () => {}) {
  post(agentRegisterAPI(), values)
  .then( res => res.json())
  .then( data => {
    cb(data);
  });
}