import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import InfiniteScroll  from 'react-infinite-scroller';

import Header from '../components/Header';
import Back from '../../../components/Back';
import DateFilter from '../components/DateFilter';
import {loadChargeRecord} from '../actions/Charge';
import {loadWithdrawRecord, viewWithdrawLog} from '../actions/UserWithdraw';
import {format} from '../../../utils/datetime';
import WithdrawRecordItem from '../components/WithdrawRecordItem';
import FooterMenu from '../../../components/FooterMenu';
import NullRecord from '../components/NullRecord';
import PeriodChoice from '../../../components/PeriodChoice';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import TabSwitcher from '../components/TabSwitcher';
import PTR from '../../../utils/pulltorefresh';

import {CHARGE_STATUS_EXAMINE, CHARGE_STATUS_SUCCESS, CHARGE_STATUS_FAILD} from '../constants/ChargeConstant';

const menuOptions = [ ['charge', '充值记录'], ['withdraw' ,'提现记录'] ];
const periodOptions = [ ['today', '今天'], ['oneweek', '一周'], ['onemonth', '一月'] ];

class WithdrawLogContainer extends LoadingComponent {

  constructor(props) {
    super(props);
    this.page = 1;
    this.pageSize = 20;
    this.state = {
      hasMore : true,
      day : 'today',
      page : 1,
      type : ""
    }
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.getPeriodChoice = this.getPeriodChoice.bind(this);
    this.onMenuTabChange = this.onMenuTabChange.bind(this);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    let _this = this;
    dispatch(loadWithdrawRecord(this.state.day,this.state.type, this.state.page, this.pageSize,(data)=>{
      _this.closeLoading();
    }));
  }

  onMenuTabChange(tab) {
    const {history} = this.props;
    if (tab == 'withdraw') {
      return history.push(`/user/withdraw/log`);  
    } else {
      return history.push(`/user/chargerecord`);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
    let withdraw = nextProps.withdraw;
    let apiRes = withdraw.get('apiRes');
    let hasMore = nextProps.withdraw.get('orderItemsHasMore');
    this.state.hasMore = hasMore;
  }
  loadMoreItems(page) {
    const {dispatch} = this.props;
    this.state.page = page;
    dispatch(loadWithdrawRecord(this.state.day,this.state.type,this.state.page));
  }
  getPeriodChoice(num){
    const {dispatch} = this.props;
    this.state.day = num;
    this.state.page = 1;
    this.state.hasMore = true;
    this.scroll.pageLoaded = 0;
    this.openLoading();
    let _this = this;
    dispatch(loadWithdrawRecord(this.state.day,this.state.type,1, this.pageSize ,(data)=>{
      _this.closeLoading();
    }));
  }

  changeListSelect(value){
    const {dispatch} = this.props;
    this.state.type = value;
    this.state.hasMore = true;
    this.scroll.pageLoaded = 0;
    this.openLoading();
    let _this = this;
    dispatch(loadWithdrawRecord(this.state.day,this.state.type,1, 10, (data)=>{
      _this.closeLoading();
    }));
  }

  goWithdrawDetail(item) {
    const {dispatch, history} = this.props;
    dispatch(viewWithdrawLog(item));
    history.push(`/user/withdraw/log/${item.userOrder}`);
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;
    let self = this;
    self.state.page = 1;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.page-body-inner',
      refreshHandler({close, handler}) {
        dispatch(loadWithdrawRecord(self.state.day, self.state.type, self.state.page, self.pageSize,(data)=>{
          close();
        }));
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }

  render() {
    const {withdraw,userModule} = this.props;
    let _this = this;
    let selectList = (userModule.user.get('panelMenu').select || {withdraw: []}).withdraw;
    let list = [];
    for(let i = 0 ; i<selectList.length; i++){
      let obj = {};
      obj.value= selectList[i].code;
      obj.text = selectList[i].name;
      list.push(obj);
    }
    let recordItemsRender = <NullRecord />;
    if (withdraw.get('withdrawItems') && withdraw.get('withdrawItems').length) {
      recordItemsRender = withdraw.get('withdrawItems').map((item, index) => {
        let status = "";
        if(!item.status){
          status = CHARGE_STATUS_EXAMINE;
        }else{
          if(item.checkStatus == 1){
            status = CHARGE_STATUS_SUCCESS;
          }else{
            status = CHARGE_STATUS_FAILD;
          }
        }
        return <WithdrawRecordItem onClick={this.goWithdrawDetail.bind(this, item)} status={status} item={item} key={index} />
      });
    }
    return (
      <div className="page page-withdraw-log">
        <div className="inner">
          <Header {...this.props}>
            <Back to={'/user'} />
            <h3>提现记录</h3>
          </Header>
          <div className="page-body">
            
            <div className="page-body-inner">

              <TabSwitcher onChange={this.onMenuTabChange}  defaultTab={ 'withdraw' } tabs={menuOptions} ></TabSwitcher>
              
              <TabSwitcher onChange={this.getPeriodChoice} timeTab={true} tabs={periodOptions}></TabSwitcher>

              <div className={"order-info-list " + ( withdraw.get('withdrawItems').length && 'not-empty-items' )}>
                <InfiniteScroll 
                pageStart={0}
                ref={(scroll) => { this.scroll = scroll; }} 
                initialLoad={true}
                loadMore={this.loadMoreItems} 
                hasMore={this.state.hasMore} 
                loader={ <div className="loader" key={'loader'}>加载中</div> }>
                  {recordItemsRender}
                </InfiniteScroll>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
};

WithdrawLogContainer.propTypes = {
  withdraw: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {userModule} = state;
  const {app} = state;
  return {
    withdraw: userModule.withdraw,
    userModule,
    app
  };
}

export default connect(mapStateToProps)(WithdrawLogContainer);