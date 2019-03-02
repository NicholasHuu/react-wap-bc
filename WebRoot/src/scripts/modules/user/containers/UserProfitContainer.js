import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';

import TabSwitcher from '../components/TabSwitcher';
import UserProfitItem from '../components/UserProfitItem';
import {loadLotteryFunds, 
  loadUserProfit,
  loadUserFlatProfit,
  loadAllLottery} from '../actions/UserOrder';

import {parseQuery} from '../../../utils/url';
import PTR from '../../../utils/pulltorefresh';

import HeaderChose from '../components/HeaderChose';
const periodOptions = [ ['1', '今天'], ['7', '一周'], ['30', '一月'] ];

class UserProfitContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.onDatePeriodChange = this.onDatePeriodChange.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.loadFundItems = this.loadFundItems.bind(this);
    this.onDatePeriodChange = this.onDatePeriodChange.bind(this);
    this.switchGameType = this.switchGameType.bind(this);
    
    this.period = periodOptions[0][0];

    // 分页数据
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;
    this.state = {
      flatType: ''
    }
  }

  parseQuery() {
    const {location} = this.props;
    return parseQuery(location.search);
  }

  isFromSearch() {
    let query = this.parseQuery();
    if (Object.keys(query).length > 0) {
      return true;
    }

    return false;
  }

  loadFundItems(cb = () => {}) {

    let params = {};
    let period = this.period;
    let from = '';
    let to = '';
    let d = new Date();
    let f = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    if (period*1 == 1) {
      to = moment(f).add(24 * 60 * 60 - 1 ,'seconds').format('YYYY-MM-DD HH:mm:ss');
      from = moment(f).format("YYYY-MM-DD HH:mm:ss");
    } else if (period*1 == 7) {
      to = moment().format('YYYY-MM-DD HH:mm:ss');
      from = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
    } else if (period*1 == 30) {
      to = moment().format('YYYY-MM-DD HH:mm:ss');
      from = moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss');
    }
    params = {
      startTime: from,
      finishTime: to,
      flag: 1,
      flatType: this.state.flatType
    };
    const {dispatch} = this.props;
    if(params.flatType == 'lottery'){
      dispatch(loadUserProfit(params, this.crtPage, cb));
    }else{
      dispatch(loadUserFlatProfit(params, this.crtPage, cb));
    }
  }

  componentWillReceiveProps(nextProps) {
    const {userProfitItems} =  nextProps;
    if (userProfitItems.items.length > 0 || this.props.userProfitItems !== userProfitItems) {
      this.closeLoading();
      this.totalPage = userProfitItems.totalPage;
    }
  }

  componentWillMount() {
    const {userModule} = this.props;
    let value = userModule.user.get('otherGameTypeList')[0].value;
    this.state.flatType = value;
    this.loadFundItems();
  }

  resetPager() {
    // 分页数据
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;
    let scroller = this.refs.scroller;
    scroller.pageLoaded = this.pageStart;
  }

  onDatePeriodChange(tab) {
    this.period = tab;
    this.resetPager();
    this.loadFundItems();
  }

  loadMoreItems(page) {
    console.log(['page', page, this.totalPage]);
    if (page > this.totalPage) {
      this.hasMore = false;
      return ;
    } else {
      this.crtPage = page;
      this.loadFundItems();
    }
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;
    let self = this;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.page-body-inner',
      refreshHandler({close, handler}) {
        self.resetPager();
        self.loadFundItems(() => {
          close();
        });
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }
  switchGameType(gameValue){
    console.log(gameValue);
    this.state.flatType = gameValue;
    this.loadFundItems();
  }
  render() {
    const {userProfitItems,userModule} = this.props;
    let gameList = userModule.user.get('otherGameTypeList');
    return <div className="page page-lottery-funds">
        <Header {...this.props}>
          <Back />
          <h3>个人盈亏</h3>
          <div><HeaderChose swithItem={this.switchGameType.bind(this)} list={gameList} /></div>
        </Header>

        <div className="page-body">
          <div className="page-body-inner">
            { this.isFromSearch() || <TabSwitcher timeTab={true} tabs={periodOptions} onChange={this.onDatePeriodChange}></TabSwitcher> }

            {userProfitItems.items.length <= 0 && <p className="no-data">暂无数据</p>}

            <div className="lottery-funds">

              <InfiniteScroller
                ref={ "scroller" }
                initialLoad={false} 
                pageStart={this.pageStart} 
                loadMore={this.loadMoreItems} 
                hasMore={this.hasMore} 
                loader={ <div key={'loader'} className="loader"></div> }
              >
              
              {userProfitItems.items.map( (item, index) => {
                return <UserProfitItem key={index} item={item} /> 
              } )}

              </InfiniteScroller>

            </div>
          </div>
        </div>
    </div>;
  }
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userProfitItems: userModule.order.get('userProfitItems'),
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(UserProfitContainer));