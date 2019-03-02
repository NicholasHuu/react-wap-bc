import {buildQuery} from '../../../utils/url';

export const userInfoAPI = (name) => {
  return `/lotterymember/info`;
};

export const userMessageAPI = () => {
  return `/member/message/list`;
}

export const chargeRecordHistoryAPI = () => {
  return `/lotterymember/record/deposit`;
}

export const systemMessageAPI = () => {
  return `/message/list`;
}

export const readMessageAPI = () => {
  return `/member/message/detail`;
};

export const loadPlatformItemsAPI = () => {
  return `/electronic/flat`;
};

export const loadEduPlatformItemsAPI = () => {
  return `/electronic/flat`;
}

export function loadPlatformBalanceAPI() {
  return `/flat/balance`;
};

export function transferToSystemAPI() {
  return `/flat/withdraw`;
};

export function transferToPlatformAPI() {
  return `/flat/deposit`;
};

export function orderHistoryAPI() {
  return `/flat/record`;
};

export function transferLogAPI() {
  return `/lotterymember/flat/account/transfer`;
}

export function changePwdAPI() {
  return `/lotterymember/info/loginPwdEdit`;
}

export function changeWithdrawAPI() {
  return `/lotterymember/info/withdrawPwdEdit`;
}

export function withdrawLogsAPI() {
  return `/lotterymember/record/withdraw`;
}

export function deleteMessageAPI() {
  return `/member/message/delete`;
}

export function countMessageAPI() {
  return `/lotterymember/message/count`;
}

export function payWithOnlineQuickAPI() {
  return `/lotterypay/thirdPay/pay`;
}

export function onlineQuickPaymentsAPI() {
  return `/member/user/selectFastPayList`;
}

export function companyQuickPaymentsAPI() {
  return `/member/user/selectIncFastPayList`;
}

export function companyBankPaymentsAPI() {
  return `/member/user/selectIncBankPayList`;
}

export function saveCompanyThirdPaymentAPI() {
  return `/member/user/saveIncFastPay`;
}

export function saveCompanyBankPaymentAPI() {
  return `/lotterypay/chuantong/bankPay`;
}

export function userBankListAPI() {
  return `/lotterymember/info/userBankList`;
}

export function bankCodesAPI() {
  return `/lotterymember/info/bankList`;
}

export function saveBankAPI() {
  return `/lotterymember/info/bindBank`;
}

export function userWithdrawAPI() {
  return `/lotteryWithdraw/submit`;
}

export function loginAPI() {
  return `/user/login`;
}

export function registerAPI() {
  return `/user/register`;
}

export function logoutAPI() {
  return `/user/logout`;
}

export function banklistAPI() {
  return `/lotterymember/info/bankList`;
}

export function securityInfoAPI(){
  return `/member/user/log`;
}

export function changeUserBasicInfoAPI(){
  return `/member/user/modify`;
}

export function chargePaymentItemsAPI() {
  return `/lotterypay/allList`;
}

export function saveScanPaymentAPI() {
  return `/lotterypay/chuantong/saomaPay`;
}
 
export function agentInfoAPI() {
  return `/member/agent/info`;
}

export function agentApplyAPI() {
  return `/member/agent/apply`;
}

export function onlineScanPaymentAPI() {
  return `/lotterypay/online/saoma/list`;
}

export function offlineScanPaymentAPI() {
  return `/lotterypay/chuantong/saoma/list`;
}

export function bankPaymentAPI() {
  return `/lotterypay/chuantong/bank/list`;
}

export function systemCodeAPI() {
  return `/lotterymember/sys/code`;
}

export function memberResourceAPI() {
  return `/lotterymember/resource`;
}

export function mainPanelAPI() {
  return `/main/panel`;
}

export function relieveBankAPI(){
  return `/lotterymember/info/removeBank`;
}

export function modifyBankInfoAPI(){
  return `/lotterymember/info/updateBank`;
}

export function mobileOnlinePaymentAPI() {
  return `/lotterypay/online/list`;
}

export function allPaymentAPI() {
  return `/lotterypay/allList`;
}

export function smsSendAPI() {
  return `/lotterycommons/sms/send`;
}

export function verifySMSCodeAPI() {
  return `/lotterypassword/verify`;
}

export function resetPwdAPI() {
  return `/lotterypassword/login/reset`;
}

export function allLotteryAPI() {
  return '/lottery/all';
}

export function lotteryOrderItemsAPI() {
  return '/lotterymember/order';
}

export function lotteryOrderDetailAPI() {
  return `/lotterymember/order/detail`;
}

export function lotteryTraceItemsAPI() {
  return `/lotterymember/order/append`;
}

export function lotteryTraceDetailAPI() {
  return `/lotterymember/order/append/detail`;
}

export function stopTraceAPI() {
  return `/lotterymember/order/append/stop`;
}

export function cancelLotteryOrderAPI() {
  return `/lotterymember/order/stop`;
}

export function lotteryFundsAPI() {
  return `/lotterymember/lottery/account/change`;
}

export function userProfitAPI() {
  return `/lotterymember/lottery/account/yingkui`;
}
export function userFlatProfitAPI() {
  return `/lotterymember/flat/account/yingkui`;
}

export function teamProfitAPI() {
  return `/lotterymember/team/account/yingkui`;
}

export function promoLinksAPI() {
  return `/lotterymember/user/promotion/link`;
}

export function deletePromoLinkAPI() {
  return `/lotterymember/user/promotion/link/delete`;
}

export function createPromoLinkAPI() {
  return `/lotterymember/user/promotion/link/add`;
}

export function userSalaryAPI() {
  return `/lotterymember/user/salary`;
}

export function updateSalaryAPI() {
  return `/lotterymember/user/salary/update`;
}

export function addSalaryAPI() {
  return `/lotterymember/user/salary/add`;
}

export function salaryDetailAPI() {
  return `/lotterymember/user/salary/detail`;
}

export function teamMemberAPI() {
  return `/lotterymember/team/account/manage`;
}

export function updateTeamMemberFdAPI() {
  return `/lotterymember/team/back/update`;
}

export function postStationLetterAPI() {
  return `/lotterymember/add/message/group`;
}

export function teamMemberTransferAPI() {
  return `/lotterymember/transfer/agent`;
}

export function updateTeamMemberRemarkAPI() {
  return `/lotterymember/team/remark/add`;
}

export function chatMessageItemsAPI() {
  return `/lotterymember/message/list`;
}

export function chatDetailAPI() {
  return `/lotterymember/message/content`;
}

export function pushChatMessageAPI() {
  return `/lotterymember/update/message/group`;
}

export function updateNicknameAPI() {
  return `/lotterymember/info/edit`;
}

export function addTeamMemberAPI() {
  return '/lotterymember/agent/register';
}

export function lotteryHowtoAPI() {
  return `/lotterymember/lotteryDetail`;
}

export function deleteChatAPI() {
  return `/lotterymember/delete/message/group`;
}

export function userBalanceAPI() {
  return `/lotterymember/info/balance`;
}

export function updateWithdrawProfileAPI() {
  return `/lotterymember/perfect/register/info`;
}

export function bindMobilePhoneAPI() {
  return `/lotterymember/info/mobileBind`;
}


export function postSalaryAPI() {
  return `/lotterymember/pay/agent`;
}

export function agentRegisterAPI() {
  return `/lottery/user/registByLink`;
}