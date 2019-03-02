import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';

import TabSwitcher from '../components/TabSwitcher';
import HeaderChose from '../components/HeaderChose';
import LotteryFundsItem from '../components/LotteryFundsItem';
import {loadLotteryFunds, 
  loadAllLottery} from '../actions/UserOrder';

import LotteryFundsDetailContainer from './LotteryFundsDetailContainer';
import {parseQuery, buildQuery} from '../../../utils/url';
import PTR from '../../../utils/pulltorefresh';

const periodOptions = [ ['1', '今天'], ['7', '一周'], ['30', '一月'] ];

class LotteryFundsContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.onDatePeriodChange = this.onDatePeriodChange.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.loadFundItems = this.loadFundItems.bind(this);
    this.onDatePeriodChange = this.onDatePeriodChange.bind(this);
    this.goSearchPage = this.goSearchPage.bind(this);
    this.onViewDetail = this.onViewDetail.bind(this);
    this.goBack = this.goBack.bind(this);

    let query = this.parseQuery();
    
    this.period = query.period ? query.period: periodOptions[0][0];

    // 分页数据
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;

    console.log(['in constructor']);

    this.state = {
      detailComponent: null,
      gameType: 0,
      searchShow: true,
    };
  }

  parseQuery() {
    const {location} = this.props;
    return parseQuery(location.search);
  }

  isFromSearch() {
    let query = this.parseQuery();
    //console.log(['search query', query, Object.keys(query).length == 1 && typeof query.period != 'undefined']);
    if (Object.keys(query).length > 0) {
      if (Object.keys(query).length == 1 && typeof query.period != 'undefined') {
        return false;
      }
      return true;
    }

    return false;
  }

  loadFundItems(cb = () => {}) {
    //console.log(['loadFundItems', this.period, this.isFromSearch()]);
    let params = {};
    if (this.isFromSearch()) {
      params = this.parseQuery();
      params['finishTime'] += ' 23:59:59';
      params['startTime'] += ' 00:00:00';
    } else {
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
        gameType: this.state.gameType
      };
    }

    const {dispatch} = this.props;
    dispatch(loadLotteryFunds(params, this.crtPage, cb));

  }

  componentWillReceiveProps(nextProps) {
    const {fundItems, dispatch} =  nextProps;
    if (fundItems.items.length > 0 || this.props.fundItems !== fundItems) {
      this.closeLoading();
      this.totalPage = fundItems.totalPage;
    }
    if (nextProps.location !== this.props.location) {
      console.log(['location', nextProps.location]);
      setTimeout( () => this.loadFundItems() ); // 延迟请求
    }
  }

  componentWillMount() {
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
    if (page > this.totalPage) {
      this.hasMore = false;
      return ;
    } else {
      this.crtPage = page;
      this.loadFundItems();
    }
  }

  goSearchPage() {
    const {history} = this.props;
    history.push('/user/lotteryfunds/search?period='+this.period);
  }

  onViewDetail(item) {
    let {match} = this.props;
    match.params.id = item.id;
    let props = Object.assign({}, this.props);
    props.onBack = () => {
      this.setState({
        detailComponent: null,
      });
    };
    let component = React.createElement(LotteryFundsDetailContainer, props);
    this.setState({
      detailComponent: component
    });
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

  goBack() {
    const {history} = this.props;
    if (this.isFromSearch()) {
      let query = this.parseQuery();
      let params = {};
      if (query.period) {
        params['period'] = query.period;
      }
      history.replace('/user/lotteryfunds?'+ buildQuery(params));
    } else {
      history.goBack();
    }
  }
  switchGameType(gameValue){
    if(gameValue != 0){
      this.state.searchShow = false;
    }else{
      this.state.searchShow = true;
    }
    this.state.gameType = gameValue;
    this.loadFundItems();
  }
  render() {
    const {fundItems,userModule} = this.props;
    let gameList = userModule.user.get('gameTypeList');
    let self = this;
    return <div className="page page-lottery-funds">
        
        { !this.state.detailComponent && <Header {...this.props}>
          
          <a onClick={ this.goBack } />
            
          <h3>账变记录</h3>
          <div><HeaderChose swithItem={this.switchGameType.bind(this)} list={gameList} /></div>
          <span className={this.state.searchShow ? '' : 'hidden'} onClick={this.goSearchPage}>Search Icon</span>

        </Header> } 

        <div className="page-body">

          <div className="page-body-inner">

            { !this.isFromSearch() && <TabSwitcher defaultTab={this.period} timeTab={true} tabs={periodOptions} onChange={this.onDatePeriodChange}></TabSwitcher> }

            {fundItems.items.length <= 0 && <p className="no-data">暂无数据</p>}

            <div className="lottery-funds">

              <InfiniteScroller
                ref={ "scroller" }
                initialLoad={false} 
                pageStart={this.pageStart} 
                loadMore={this.loadMoreItems} 
                hasMore={this.hasMore} 
                loader={ <div key={'loader'} className="loader"></div> }
              >
              
              {fundItems.items.map( (item, index) => {
                return <LotteryFundsItem onClick={self.onViewDetail} key={index} item={item} /> 
              } )}

              </InfiniteScroller>

            </div>
          </div>
        </div>

        {this.state.detailComponent && <div ref="detailWrap" className="detail-wrap">
          {this.state.detailComponent}
        </div> }
    </div>;
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    fundItems: userModule.order.get('lotteryFundItems'),
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryFundsContainer));