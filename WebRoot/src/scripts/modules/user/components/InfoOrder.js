import React, {PropTypes, Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import InfiniteScroll  from 'react-infinite-scroller';

import OrderListItem from './OrderListItem';
import {format} from '../../../utils/datetime';

import {loadUserOrderItems} from '../actions/UserOrder';
import LoadingComponent from '../../../components/LoadingComponent';
import PeriodChoice from '../../../components/PeriodChoice';
import NullRecord from '../components/NullRecord';
import {loadPlatformItems} from '../actions/PlatformTransfer';
import TabSwitcher from '../components/TabSwitcher';

const periodOptions = [ ['today', '今天'], ['oneweek', '7天内'], ['onemonth', '30天内'] ];

class InfoOrder extends LoadingComponent {

  constructor(props) {
    super(props);
    this.pageNo = 1;
    this.pageSize = 10;
    this.onChange = this.onChange.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.getPeriodChoice = this.getPeriodChoice.bind(this);
    this.state = {
      day : 'today',
      page : 1,
      hasMore : true,
      flat: '',
    }
  }

  componentWillMount() {
    let _this = this;
    const {dispatch} = this.props;
    this.state.flat = this.props.curFlat;
    dispatch(loadUserOrderItems(this.state.day, this.state.flat, this.state.page, this.pageSize ,(data)=>{
      _this.closeLoading();
    }));
  }

  componentDidMount() {
    this.closeLoading();
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
    const {dispatch} = this.props;
    let {order} = nextProps.userModule;
    let apiRes = order.get('apiRes');
    let hasMore = order.get('orderItemsHasMore');
    this.state.hasMore = hasMore;
    if(this.state.flat != nextProps.curFlat){
      this.state.flat = nextProps.curFlat;
      dispatch(loadUserOrderItems(this.state.day, nextProps.curFlat, this.state.page, this.pageSize ,(data)=>{
        this.closeLoading();
      }));
    }
  }

  loadMoreItems(page) {
    this.pageNo = page;
    const {dispatch} = this.props;
    dispatch(loadUserOrderItems(this.state.day, this.state.flat, this.pageNo, this.pageSize));
  }
  
  getPeriodChoice(num){
    const {dispatch} = this.props;
    this.state.day = num;
    this.state.page = 1;
    this.state.hasMore = true;
    this.scroll.pageLoaded = 0;
    this.openLoading();
    let _this = this;
    dispatch(loadUserOrderItems(this.state.day,this.state.flat, this.state.page , this.pageSize ,(data)=>{
      _this.closeLoading();
    }));
  }

  onChange(flat) {
    const {dispatch} = this.props;
    this.state.page = 1;
    this.state.hasMore = true;
    this.state.flat = flat;
    this.scroll.pageLoaded = 0;
    this.openLoading();
    let _this = this;
    dispatch(loadUserOrderItems(this.state.day,this.state.flat, this.state.page , this.pageSize ,(data)=>{
      _this.closeLoading();
    }));
  }

  render() {
    const {order, platform} = this.props.userModule;
    let platformItems = platform.get('platformItems');
    let selectBoxOptions = [];
    for (let item of platformItems) {
      selectBoxOptions.push({
        text: item.flatName,
        value: item.flat
      });
    }
    let orderItemsComponent = <NullRecord />;
    let totalBetIn = order.get('statSummary').betIns; // 投注
    let totalBetInSure = order.get('statSummary').betIncomes;  // 有效投注
    let totalWin = order.get('statSummary').betUsrWins; // 输赢
    let hasOrderItems = false;
    if (order.get('orderItems') && order.get('orderItems').length) {
        orderItemsComponent = order.get('orderItems').map((item, index) => {
        hasOrderItems = true;
        return <OrderListItem {...this.props} item={ item } key={index} />  
      });
    }
    let _this = this;
    return (
      <div className="user-order-info">
        <TabSwitcher timeTab={true} tabs={periodOptions} onChange={_this.getPeriodChoice}/>
        <div className={ "order-info-list " + ( orderItemsComponent.length > 0 ? 'has-result': '' )  }>
          <InfiniteScroll 
            pageStart={1} 
            ref={(scroll) => { this.scroll = scroll }} 
            loadMore={this.loadMoreItems} 
            initialLoad={false}
            hasMore={this.state.hasMore} 
            loader={ <div key={'loader'} className="loader"></div> }>
              {orderItemsComponent}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
};

InfoOrder.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userModule: PropTypes.object.isRequired
};


export default withRouter(InfoOrder);