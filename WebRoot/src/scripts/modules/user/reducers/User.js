import * as UserConstant from '../constants/UserConstant';
import * as ChargeConstant from '../constants/ChargeConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {Map, List} from 'immutable';
import {format} from '../../../utils/datetime';

const initState = Map({
  info: {
    hasWithdrawProfile: window._hasSetWithdrawProfile == "true"
  },
  userLevel: {},
  auth: Map({
    isLogin: !!window._userName, // 是否登录
    loginTime: 0, // 登录时间
    lastActive: 0, // 最后活动时间,
    userName: window._userName,
  }),
  protocol: '',
  bankLists: [],
  agentInfo: {
    
  },
  companyChargeChannel: [],
  apiRes: {
    
  },
  panelMenu: {},
  systemCodes: {},
  security : [],
  smsVerify: {
    key: '',
    account: '',
    phone: '',
  },
  lotteryHowto: {

  },
  gameTypeList: [
    {
      label: "彩票记录",
      value: 0,
    },{
      label: "真人记录",
      value: 1,
    },{
      label: "电子记录",
      value: 2,
    },{
      label: "体育记录",
      value: 3,
    },{
      label: "捕鱼记录",
      value: 4,
    }
  ],
  otherGameTypeList: [
    {
      label: "彩票记录",
      value: 'lottery',
    },{
      label: "真人记录",
      value: 'live',
    },{
      label: "电子记录",
      value: 'electronic',
    },{
      label: "体育记录",
      value: 'sport',
    },{
      label: "捕鱼记录",
      value: 'fish',
    }
  ],
});

export default function (state = initState, action) {

  switch (action.type) {
    case UserConstant.REQUEST_PROTOCOL:
      state = state.set('protocol', action.data.datas);
      break;

    case UserConstant.REQUEST_PANEL_MENU:
      state = state.set('panelMenu', action.data.datas);
      break;

    case ChargeConstant.REQUEST_PAYWAY_ITEMS:
      state = state.set('systemCodes', action.data.datas.restMap);
      break;

    case UserConstant.REQUEST_USER_BALANCE:

      let userInfo = state.get('info');
      if (action.data.errorCode == RES_OK_CODE) {
        userInfo['userMoney'] = action.data.datas.memberBalance.balance;

        state = state.set('info', Object.assign({}, userInfo));  
      }

      break;

    case UserConstant.REQUEST_USER_INFO:
      let data = action.data;
      const {errorCode, msg} = data;
      if (data.errorCode == RES_OK_CODE) {
        state = state.set('apiRes', data);
        let info = state.get('info');
        info = Object.assign(info, data.datas.userInfo);
        
        if (info.hasRealName && info.hasWithdrawPwd) {
          info.hasWithdrawProfile = true;
        } else {
          info.hasWithdrawProfile = false;
        }

        state = state.set('info', info);
        state = state.set('userLevel', info.typeDetail || {} );
        state = state.set('auth', Map({
          isLogin: true,
          loginTime: new Date(),
          userName: info.userName,
        }));
      } else {
        state = state.set('auth', Map({
          isLogin: false,
          loginTime:0,
          userName: ''
        }));
      }
      
      break;

    case UserConstant.REQUEST_USER_LOGIN:
      state = state.set('auth', Map({
        isLogin: true,
        loginTime: format(new Date(), 'Y-m-d HH:mm:ss'),
        userName: action.data.userName
      }));
      let auth = state.get('auth');
      break;

    case UserConstant.REQUEST_BANK_LIST :
      let banklist =  action.data.datas;
      state = state.set('bankLists',banklist);
      break;

    case UserConstant.REQUEST_SECURITY_INFO :
      state = state.set('security',action.data.datas);
      break;

    case UserConstant.REQUEST_CHANGE_BASIC_INFO :
      break;

    case UserConstant.REQUEST_AGENT_INFO:
      state = state.set('agentInfo', action.data.datas);
      break;

    case UserConstant.REQUEST_SMS_CODE_VERIFY:
      
      state = state.set('smsVerify', {
        key: action.data.datas.key,
        account: action.account,
        phone: action.phone
      });

      break;

    case UserConstant.REQUEST_LOTTERY_HOWTO:

      let howto = state.get('lotteryHowto');
      howto[action.lottery] = action.data.datas;

      state = state.set('lotteryHowto', Object.assign({}, howto));

      break;

  } 
  return state;
}

