import {Map, List} from 'immutable';
import * as OrderConstant from '../constants/OrderConstant';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import {migratePagedAction} from './';

const initState = Map({
  apiRes: {},
  lotteryItems: [],
  lotteryOrderItems: {  // 彩票订单
    items: [],
    totalPage: 0,
    totalRows: 0,
  },
  fundTypes: [{
    code: '1',
    name: '扣款',
  }, {
    code: '2',
    name: '投注返点'
  }, {
    code: '3',
    name: '下级投注返点',
  }, {
    code: '4',
    name: '奖金派送',
  }, {
    code: '5',
    name: '撤单返款',
  }, {
    code: '6',
    name: '中奖停追撤单返款',
  }],
  lotteryOrderDetail: {

  },
  lotteryTraceItems: { // 追号订单
    items: [],
    totalPage: 0,
    totalRows: 0,
  },
  lotteryTraceDetail: {
    resultList: [],
    appendScheme: {},
    appendLottery: {},
  },
  lotteryFundItems: {
    items: [],
    totalPage: 0,
    totalRows: 0
  },
  userProfitItems: {
    items: [],
    totalPage: 0,
    totalRows: 0
  },
  teamProfitItems: {
    items: [],
    totalPage: 0,
    totalRows: 0,
    currentUserName: '',
  },
  promoLinks: [],
  selfSalary: {}, // 个人日薪明细
  childSalaryItems: {
    items: [],
    totalPage: 0,
    totalRows: 0
  }, // 下级日薪明细
  salaryDetailItems: {
    items: [],
    totalPage: 0,
    totalRows: 0
  }, // 日薪发放
  orderItems: [], // 普通订单
  orderItemsHasMore: true,
  statSummary: {
    betIncomes: 0,
    betIns: 0,
    betUsrWins: 0,
  },
  teamMemberOfAgent: {
    items: [],
    totalPage: 0,
    totalRows: 0
  },
  teamMemberOfAccount: {
    items: [],
    totalPage: 0,
    totalRows: 0
  },
});

export default function Order(state = initState, action) {
  switch (action.type) {
    
    case OrderConstant.REQUEST_ALL_LOTTERY:
      
      if (action.data.errorCode == RES_OK_CODE) {
        let items = action.data.datas.lotteryList;
        items.unshift({
          lotteryCode: '',
          lotteryName: '所有彩种'
        });
        state = state.set('lotteryItems', items); 
      }

      return state;

    break;

    case OrderConstant.REQUEST_LOTTERY_ORDER_ITEMS:
      
      state = migratePagedAction(action, state, 'lotteryOrderItems');

      return state;

    break;

    case OrderConstant.REQUEST_LOTTERY_ORDER_DETAIL:
      
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('lotteryOrderDetail', action.data.datas);
      } else {
        state = state.set('lotteryOrderDetail', {
          error: action.data.errorCode,
        });
      }

      return state;
    
    break;

    case OrderConstant.REQUEST_ORDER_ITEMS:
      let pageNo = action.pageNo;
      if (action.data.datas.betIncomes) {
        let statSummary = state.get('statSummary');
        statSummary.betIncomes = action.data.datas.betIncomes;
        statSummary.betIns = action.data.datas.betIns;
        statSummary.betUsrWins = action.data.datas.betUsrWins;
        state = state.set('statSummary', statSummary);
      }

      if (action.data.datas.list && action.data.datas.list.length > 0) {
        state = state.set('orderItemsHasMore',true);
        if (pageNo == 1) {
          state = state.set('orderItems', action.data.datas.list);  
        } else {
          let oldItems = state.get('orderItems');
          if (action.data.datas.list.length > 0 ) {
            oldItems = oldItems.concat(action.data.datas.list);
          }
          state = state.set('orderItems', oldItems);
        }
      }else{
        
        if (action.pageNo == 1) {
         state = state.set('orderItems', []); 
        }

        state = state.set('orderItemsHasMore', false);
      }
      state = state.set('apiRes', action.data);
      
      break;
    
    case OrderConstant.REQUEST_LOTTERY_TRACE_ITEMS:

      state = migratePagedAction(action, state, 'lotteryTraceItems');

    break;

    case OrderConstant.REQUEST_LOTTERY_TRACE_DETAIL:
      
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('lotteryTraceDetail', action.data.datas);
      }

    break;

    case OrderConstant.REQUEST_LOTTERY_FUNDS_LOG:
      
      state = migratePagedAction(action, state, 'lotteryFundItems');

    break;

    case OrderConstant.REQUEST_USER_PROFIT:
      
      state = migratePagedAction(action, state, 'userProfitItems');

    break;

    case OrderConstant.REQUEST_TEAM_PROFIT:
      
      state = migratePagedAction(action, state, 'teamProfitItems');
      let teamProfitItems = state.get('teamProfitItems');
      teamProfitItems.currentUserName = action.data.datas.currentUserName; 
      
    break;

    case OrderConstant.REQUEST_PROMO_LINKS:
      
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('promoLinks', action.data.datas.resultList);
      }

      return state;

    break;

    case OrderConstant.REQUEST_SELF_SALARY:
      
      if (action.data.errorCode == RES_OK_CODE) {
        state = state.set('selfSalary', action.data.datas.resultList[0] || {});
      }
      return state;
    
    break;

    case OrderConstant.REQUEST_CHILD_SALARY:
      state = migratePagedAction(action, state, 'childSalaryItems');
    break;

    case OrderConstant.REQUEST_SALARY_DETAIL:
      state = migratePagedAction(action, state, 'salaryDetailItems');
      
    break;

    case OrderConstant.REQUEST_TEAM_MEMBER_OF_AGENT:
      state = migratePagedAction(action, state, 'teamMemberOfAgent');
    break;

    case OrderConstant.REQUEST_TEAM_MEMBER_OF_ACCOUNT:
    
      state = migratePagedAction(action, state, 'teamMemberOfAccount');

    break;

  }
  return state;
}