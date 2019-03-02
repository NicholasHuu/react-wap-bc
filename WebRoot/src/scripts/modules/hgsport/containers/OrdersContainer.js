import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link ,withRouter} from 'react-router';

import {parseQuery} from '../../../utils/url';
import Header from '../../../components/Header';
import Back from '../../../components/Back';
import NavTabs from '../components/NavTabs';
import NotLogin from '../components/NotLogin';
import OrderRecord from '../components/OrderRecord';

import FilterBar from '../../../components/FilterBar';
import {loadSportBallItems, loadSportBallTypes, loadOrder as loadOrderAction} from '../actions/HgActionPart';
import LoadingComponent from '../../../components/LoadingComponent';

import DatePicker from '../../../components/DatePicker';
import {format} from '../../../utils/datetime';
import PeriodChoice from '../../../components/PeriodChoice';
import InfiniteScroll from 'react-infinite-scroller';

class OrdersContainer extends LoadingComponent {
  constructor(props){
    super(props);
    const {location} = this.props;
    let query = parseQuery(location.search);
    this.defaultBall = query.ball;
    if (!this.defaultBall) {
      this.defaultBall = 'ft';
    }
    this.ball = this.defaultBall;
    this.onBallChange = this.onBallChange.bind(this);
    this.infiniteLoadMore = this.infiniteLoadMore.bind(this);

    this.pageSize = 10;
    this.state = {
      hasMore: true,
      day : 'today',
      pageNo : 1
    };
  }

  resetPage() {
    this.state.pageNo = 1;
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadSportBallItems());
    this.loadSportOrders();
  }

  componentWillReceiveProps(nextProps) {
    let apiRes = nextProps.hgsport.huangguan.get('apiRes');
    if (apiRes.datas) {
      this.closeLoading();
    }

    let hasMore = nextProps.hgsport.huangguan.get('orderItemsHasMore');
    this.setState({
      hasMore
    });

  }

  onBallChange(ball) {
    this.openLoading();
    this.ball = ball;
    this.resetPage();
    this.loadSportOrders();
  }

  loadSportOrders() {
    const {dispatch} = this.props;
    dispatch(loadOrderAction(this.state.day, this.ball, this.state.pageNo, this.pageSize));
  }

  infiniteLoadMore(page) {
    this.state.pageNo = page;
    this.loadSportOrders();
  }

  getPeriodChoice(num){
    const {dispatch} = this.props;
    this.state.pageNo = 1;
    this.state.day = num;
    this.hasMore = false;
    this.scroll.pageLoaded = 0;
    this.openLoading();
    this.loadSportOrders();
  }
  changeListSelect(){
    console.log(1);
  }
  render() {
    const {userModule} = this.props;
    const {huangguan} = this.props.hgsport;
    let orderItems = huangguan.get('orderItems');
    let isLogin = userModule.user.get('auth').get('isLogin');
    orderItems = orderItems || [];
    let _this = this;
    let list = [];
    return(
      <div className="hg-page order-page">
        <Header {...this.props} className="hgsport-header">
          <Back backTo={'/hgsport'}  />
          <FilterBar defaultValue={this.ball} options={huangguan.get('sportBalls')} onChange={this.onBallChange} />
          <NavTabs />
        </Header>
        <div className="page-body">
          {!isLogin ? <NotLogin />: 
            <div>
              <div className="hgsport-order-date-picker clearfix">
                <PeriodChoice noSelect={true} list={""}  type={""} onChange={_this.changeListSelect.bind(_this)} event={_this.getPeriodChoice.bind(_this)} />              
              </div>
              <InfiniteScroll 
                pageStart={1}
                initialLoad={false}
                ref={(scroll) => { this.scroll = scroll} }
                loadMore={this.infiniteLoadMore}
                hasMore={this.state.hasMore}
                loader={<div className="loader">加载中</div> }>
                <OrderRecord {...this.props} items ={orderItems} />
              </InfiniteScroll>
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  const {app,userModule, hgsport} = state;
  return {
    app,
    userModule,
    hgsport
  }
}

export default connect(mapStateToProps)(withRouter(OrdersContainer));