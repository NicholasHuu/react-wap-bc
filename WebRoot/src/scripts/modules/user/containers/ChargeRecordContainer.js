import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import InfiniteScroll  from 'react-infinite-scroller';

import Header from '../components/Header';
import NullRecord from '../components/NullRecord';
import Back from '../../../components/Back';
import DateFilter from '../components/DateFilter';
import PeriodChoice from '../../../components/PeriodChoice';
import {loadChargeRecord, viewChargeRecord} from '../actions/Charge';
import {format} from '../../../utils/datetime';
import ChargeRecordItem from '../components/ChargeRecordItem';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import {loadUserPanelInfo, loadSystemCode} from '../actions/User';
import TabSwitcher from '../components/TabSwitcher';
import {datePeriod} from '../../../utils/datetime';
import PTR from '../../../utils/pulltorefresh';

import {CHARGE_STATUS_EXAMINE, CHARGE_STATUS_SUCCESS, CHARGE_STATUS_FAILD} from '../constants/ChargeConstant';

const menuOptions = [ ['charge', '充值记录'], ['withdraw' ,'提现记录'] ];
const periodOptions = [ ['today', '今天'], ['oneweek', '一周'], ['onemonth', '一月'] ] ;

class ChargeRecordContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.page = 1;
    this.pageSize = 20;
    this.state = {
      hasMore: true,
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
    this.state.page = 1;
    dispatch(loadUserPanelInfo());
    dispatch(loadSystemCode());
    dispatch(loadChargeRecord(this.state.day,this.state.type, this.state.page, this.pageSize ,(data)=>{
      _this.closeLoading();
    }));
  }

  getPeriodChoice(num){
    const {dispatch} = this.props;
    this.state.page = 1;
    this.state.day = num;
    this.state.hasMore = true;
    this.openLoading();
    let _this = this;
    dispatch(loadChargeRecord(this.state.day,this.state.type,this.state.page, this.pageSize, (data)=>{
      _this.closeLoading();
    }));
  }

  changeListSelect(value){
    const {dispatch} = this.props;
    this.state.page = 1;
    this.state.type = value;
    this.state.hasMore = true;
    this.openLoading();
    let _this = this;
    dispatch(loadChargeRecord(this.state.day,this.state.type,this.state.page, this.pageSize, (data)=>{
      _this.closeLoading();
    }));
  }

  loadMoreItems(page) {
    const {dispatch} = this.props;
    this.state.page = page;
    dispatch(loadChargeRecord(this.state.day,this.state.type, this.state.page , this.pageSize));
  }
  
  componentWillReceiveProps(nextProps) {
    this.closeLoading();
    let chargeRecord = nextProps.chargeRecord;
    let apiRes = chargeRecord.get('apiRes');
    let hasMore = nextProps.chargeRecord.get('orderItemsHasMore');
    this.setState({
      hasMore
    });
  }

  onMenuTabChange(tab) {
    const {history} = this.props;
    if (tab == 'withdraw') {
      return history.push(`/user/withdraw/log`);  
    } else {
      return history.push(`/user/chargerecord`);
    }
  }

  goDetailPage(item) {
    const {dispatch, history} = this.props;
    dispatch(viewChargeRecord(item));
    history.push(`/user/chargerecord/${item.hkOrder}`);
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
      mainElement: '.user-order-info',
      refreshHandler({close, handler}) {
        dispatch(loadChargeRecord(self.state.day, self.state.type, self.state.page, self.pageSize ,(data)=>{
          close();
        }));
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    clearInterval(this.loadUserTimer);
    this.setupPullToRefresh(true);
  }
  
  render() {
    const {chargeRecord,userModule} = this.props;
    let selectList = [];
    if (userModule.user.get('panelMenu').huikuan) {
      selectList = userModule.user.get('panelMenu').huikuan || [];
    }
    let list = [];
    for(let i = 0 ; i<selectList.length; i++){
      let obj = {};
      obj.value= selectList[i].codeName;
      obj.text = selectList[i].codeShowName;
      list.push(obj);
    }

    let recordItemsRender = <NullRecord />;
    let chargeHistories = chargeRecord.get('recordHistories')[this.state.day];
    if (chargeHistories && chargeHistories.length) {
      recordItemsRender = chargeHistories.map((item, index) => {
        let status = "";
        if(!item.hkCheckStatus){
          status = CHARGE_STATUS_EXAMINE;
        }else{
          if(item.hkCheckStatus == 1){
            status = CHARGE_STATUS_SUCCESS;
          }else{
            status = CHARGE_STATUS_FAILD;
          }
        }
        return <ChargeRecordItem onClick={this.goDetailPage.bind(this, item)} status={status} item={item} key={index+ '-index'} />
      });
    }

    let _this = this;
    return (
    	<div className="page page-charge-record">
      <Header {...this.props}>
        <Back to={'/user'}/>
        <h3>充值记录</h3>
      </Header>
      <div className="page-body">
      	<div className="user-order-info">

        <TabSwitcher onChange={this.onMenuTabChange} defaultTab={ 'charge' }  tabs={menuOptions} ></TabSwitcher>
        
        <TabSwitcher onChange={this.getPeriodChoice} timeTab={true} tabs={periodOptions}></TabSwitcher>

        <div className={"order-info-list " + (chargeHistories.length && 'not-empty-items')}>
          <InfiniteScroll 
          ref={(scroll) => { this.scroll = scroll} }
          pageStart={1}
          loadMore={this.loadMoreItems} 
          hasMore={this.state.hasMore} 
          initialLoad={false}
          loader={ <div key={'unique'} className="loader">加载中</div> }>
            {recordItemsRender}
          </InfiniteScroll> 
        </div>
      </div>
      </div>
    </div>
    );
  };
};

function mapStateToProps(state) {
  const {userModule} = state;
  const {app} = state;
  return {
    chargeRecord: userModule.chargeRecord,
    userModule,
    app
  };
}
ChargeRecordContainer.propTypes = {
  chargeRecord: PropTypes.object.isRequired
};



export default connect(mapStateToProps)(withRouter(ChargeRecordContainer));