import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

import LoadingComponent from '../../../components/LoadingComponent';
import Header from '../components/Header';
import FooterMenu from '../../../components/FooterMenu';
import Back from '../../../components/Back';
import PeriodChoice from '../../../components/PeriodChoice';
import NullRecord from '../components/NullRecord';
import {format} from '../../../utils/datetime';
import TransferLogItem from '../components/TransferLogItem';
import {loadTransferLog} from '../actions/PlatformTransfer';
import InfiniteScroll  from 'react-infinite-scroller';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {CHARGE_STATUS_EXAMINE, CHARGE_STATUS_SUCCESS, CHARGE_STATUS_FAILD, CHANGE_STATUS_EXCEPTION} from '../constants/ChargeConstant';
import TabSwitcher from '../components/TabSwitcher';

const periodOptions = [ ['today', '今天'], ['oneweek', '7天内'], ['onemonth', '30天内'] ];

const menuOptions = [ ['in', '转入记录'], ['out', '转出记录'] ];

import {loadUserPanelInfo} from '../actions/User';

class TransferLogContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.page = 1;
    this.pageSize = 10;
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.state = {
      hasMore : true,
      day : 'today',
      page : 1,
      type: ""
    }
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadUserPanelInfo());
    // let _this = this;
    // dispatch(loadTransferLog(this.state.day, this.state.page, this.pageSize ,(data)=>{
    //   _this.closeLoading();
    // }));
  }
  loadMoreItems(page) {
    this.state.page = page;
    const {dispatch} = this.props;
    dispatch(loadTransferLog(this.state.day,this.state.type, this.state.page));
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
    let transferlog = nextProps.userModule.transferlog;
    let apiRes = transferlog.get('apiRes');
    let hasMore = transferlog.get('orderItemsHasMore');
    this.state.hasMore = hasMore;
  }
  getPeriodChoice(num){
    this.state.day = num;
    this.state.page = 1;
    const {dispatch} = this.props;
    this.hasMore = true;
    this.scroll.pageLoaded = 0;
    this.openLoading();
    let _this = this;
    dispatch(loadTransferLog(this.state.day,this.state.type,1,10,(data)=>{
      _this.closeLoading();
    }));
  }
  changeListSelect(value){
    const {dispatch} = this.props;
    this.state.page = 1;
    this.state.type = value;
    this.hasMore = true;
    this.scroll.pageLoaded = 0;
    this.openLoading();
    let _this = this;
    dispatch(loadTransferLog(this.state.day,this.state.type,this.state.page, this.pageSize, (data)=>{
      _this.closeLoading();
    }));
  }
  render() {
    const {userModule} = this.props;
    const {transferlog} = this.props.userModule;
    let selectList = [];
    if (userModule.user.get('panelMenu').select) {
      selectList = userModule.user.get('panelMenu').select.flat; 
    }

    let list = [];
    for(let i = 0 ; i<selectList.length; i++){
      let obj = {};
      obj.value= selectList[i].code;
      obj.text = selectList[i].name;
      list.push(obj);
    }
    let logItems = <NullRecord />;
    if (transferlog.get('logItems') && transferlog.get('logItems').length > 0) {
      logItems = transferlog.get('logItems').map( (item, index) => {
        let status = "";
        if(1 == item.statusValue){
          status = CHARGE_STATUS_SUCCESS;
        } else if (-1 == item.statusValue) {
          status = CHANGE_STATUS_EXCEPTION;
        } else{
          status = CHARGE_STATUS_FAILD;
        }
        return <TransferLogItem status={status} item={ item } key={index} />;
      });
    }
    let _this = this;
    return (<div className="page page-transfer-log">
      <div className="inner">
        <Header {...this.props}>
          <Back />
          <h3>额度转换记录</h3>
        </Header>
        <div className="page-body">
          
          { false && <TabSwitcher tabs={menuOptions} /> }

          <TabSwitcher tabs={periodOptions} timeTab={true} onChange={_this.getPeriodChoice.bind(this)} />

          <div className="transfer-items">
            <div className="inner">
              <InfiniteScroll 
                pageStart={0}
                ref={(scroll) => { this.scroll = scroll; }} 
                loadMore={this.loadMoreItems} 
                hasMore={this.state.hasMore} 
                initialLoad={true}
                loader={ <div key={'loader'} className="loader">加载中</div> }>
                  {logItems}
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule, app
  };
}

export default connect(mapStateToProps)(TransferLogContainer);