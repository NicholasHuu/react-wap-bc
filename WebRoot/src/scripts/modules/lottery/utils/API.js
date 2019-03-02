
export function gamesListAPI() {
  return `/cp/game/list`;
}

export function gameTypeAPI(gameid) {
  return `/cp/type/${gameId}`;
}

export function getOpenResultAPI(){
  return `/cp/results/list`;
}

export function getOpenResultResultAPI(){
  return `/cp/results/detail/list`;
}

export function gamePankouListAPI() {
  return `/cp/item/list`;
}

export function platformPeiyuAPI() {
  return `/cp/refreshRate`;
}

export function platFormInfoAPI() {
  return `/cp/lottoGetGameInfo`;
}

export function saveOrderAPI() {
  return `/cp/order/saveOrder`;
}

export function getLMOrderAPI() {
  return `/cp/order/goLmOrder`;
}

export function getMultiGroupOrderAPI() {
  return `/cp/order/goMultiGroupOrder`;
}

export function getPlatformOrderAPI(userName,beginTimeStr,endTimeStr,gameCode,pageNo){
  return `/cp/order/list`;
}

export function getGroupOrderAPI(){
  return `/cp/order/getGroupOrderList`;
}

export function winningListAPI() {
  return `/cp/order/winningList`;
}

export function gameRuleAPI() {
  return `/rules/query`;
}

export function sliderAPI() {
  return `/main/banner/list`;
}