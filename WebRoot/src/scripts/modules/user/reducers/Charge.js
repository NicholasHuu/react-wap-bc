import {Map, List} from 'immutable';
import * as ChargeConstant from '../constants/ChargeConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';

const initState = Map({
  apiRes: {

  },
  onlineQuickPayments: [], // 线上支付 -直接到账
  onlineQuickPaymentsTitle: '',
  offlineQuickPayments: [], // 线下扫码
  offlineQuickPaymentsTitle: '',
  companyBankPayments: [], // 公司银行卡支付
  bankTransferTypeList: [], // 付款方式列表
  chargePaymentItems: [],
  mobileOnlinePayments: [], // 手机在线支付
  mobileOnlinePaymentsTitle: '',
});

export default function Message(state = initState, action) {
  
  switch (action.type) {

    case ChargeConstant.REQUEST_ALL_PAYMENT:
      state = state.set('onlineQuickPayments', action.data.datas.onlineSaoma.list);
      state = state.set('onlineQuickPaymentsTitle', action.data.datas.onlineSaoma.title);
      state = state.set('offlineQuickPayments', action.data.datas.chuantongSaoma.list);
      state = state.set('offlineQuickPaymentsTitle', action.data.datas.chuantongSaoma.title);
      state = state.set('companyBankPayments', action.data.datas.bank.list);
      state = state.set('mobileOnlinePayments', action.data.datas.online.list);
      state = state.set('mobileOnlinePaymentsTitle', action.data.datas.online.title);
      break;

    case ChargeConstant.REQUEST_ONLINE_SCAN_PAYMENT:
      state = state.set('onlineQuickPayments', action.data.datas);
      break;

    case ChargeConstant.REQUEST_OFFLINE_SCAN_PAYMENT:
      state = state.set('offlineQuickPayments', action.data.datas);
      break;

    case ChargeConstant.REQUEST_BANK_SCAN_PAYMENT:
      state = state.set('companyBankPayments', action.data.datas);

      break;

    case ChargeConstant.REQUEST_PAYWAY_ITEMS:
      state = state.set('bankTransferTypeList', action.data.datas.restMap.bank_transfer_type);
      break;

    case ChargeConstant.REQUEST_MOBILE_ONLINE_PAYMENT:
      state = state.set('mobileOnlinePayments', action.data.datas);
      break;
    
  }

  return state;
}