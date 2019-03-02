import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route } from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {alert} from '../../../utils/popup';
import {loadAllLottery, loadLotteryOrderItems} from '../actions/UserOrder';
import LotterySwitcher from '../components/LotterySwitcher';
import DatePeriodSwitcher, {periodes} from '../components/DatePeriodSwitcher';
import LotteryOrderItem from '../components/LotteryOrderItem';
import LoadingComponent from '../../../components/LoadingComponent';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {parseQuery} from '../../../utils/url';
import PTR from '../../../utils/pulltorefresh';
import * as validate from '../utils/validate';
import LotteryOrderDetailContainer from './LotteryOrderDetailContainer';

import InfiniteScroller from 'react-infinite-scroller';

const ALL_LOTTERY_LABEL = '所有彩种';

class LotteryOrderContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      viewLotterySwitcher: false,
      viewDatePeriodFilter: false,
      periodText: periodes[0]['text'],
      period: periodes[0],
      lotteryText: ALL_LOTTERY_LABEL,
      lotteryCode: '',
    };

    const {location} = props;
    let query = parseQuery(location.search);
    this.query = query;
    this.state.account = query.username || '';

    this.toggleLotterySwitcher = this.toggleLotterySwitcher.bind(this);
    this.togglePeriodChange = this.togglePeriodChange.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.filterOrderWithAccount = this.filterOrderWithAccount.bind(this);
    this.searchWithAccount = this.searchWithAccount.bind(this);
    
    // 分页数据
    this.resetPager();
  }

  resetPager() {
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;
  }

  isAgent() {
    const {user} = this.props;
    return user.get('info').isAgent == 1;
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadAllLottery());
    let account = (this.refs.account || {value: this.state.account}).value.trim();
    // 默认选择今天记录
    this.openLoading();
    dispatch(loadLotteryOrderItems({
      account,
      startTime: periodes[0].from,
      finishTime: periodes[0].to,
    }, this.crtPage, () => {
      this.closeLoading();
    }));
  }

  onLotteryChanged(lotteryCode, lotteryText) {
    if (lotteryText == '') lotteryText = ALL_LOTTERY_LABEL;

    this.setState({
      lotteryCode,
      lotteryText
    });
    this.refs.scroller.pageLoaded = 1;

    this.openLoading();

    let account = (this.refs.account || {value: ''}).value.trim();
    const {dispatch} = this.props;
    dispatch(loadLotteryOrderItems({
      lotteryCode: lotteryCode,
      startTime: this.state.period.from,
      finishTime: this.state.period.to,
      account
    }));

    this.toggleLotterySwitcher();
  }

  onPeriodChanged(period) {
    this.setState({
      periodText: period.text,
      period,
    });

    this.refs.scroller.pageLoaded = 1;

    this.openLoading();

    const {dispatch} = this.props;
    let account = (this.refs.account || {value: ''}).value.trim();
    dispatch(loadLotteryOrderItems({
      lotteryCode: this.state.lotteryCode,
      startTime: period.from,
      finishTime: period.to,
      account,
    }));

    this.togglePeriodChange();
  }

  toggleLotterySwitcher() {
    this.setState( {viewLotterySwitcher: !this.state.viewLotterySwitcher} );
  }

  togglePeriodChange() {
    this.setState( {viewDatePeriodFilter: !this.state.viewDatePeriodFilter} )
  }

  isDetailPage(props) {
    const {location} = props;
    return location.pathname.search(/\d+/) != -1;
  }

  componentWillReceiveProps(nextProps) {
    const {lotteryOrderItems, location} =  nextProps;
    if (lotteryOrderItems.items.length > 0 || this.props.lotteryOrderItems !== lotteryOrderItems) {
      this.closeLoading();
      this.totalPage = lotteryOrderItems.totalPage;
    }

    if (this.isDetailPage(nextProps)) {
      this.setupPullToRefresh(true);
    } else {
      this.setupPullToRefresh();
    }

  }

  loadMoreItems(page) {
    this.crtPage = page;
    let account = (this.refs.account || {value: ''}).value.trim();
    if (page > this.totalPage ) {
      this.hasMore = false;
      return ;
    } else {
      const {dispatch} = this.props;
      let params = {
        'lotteryCode' :this.state.lotteryCode,
        'startTime': this.state.period.from,
        'finishTime': this.state.period.to,
      };
      if (account.length > 0) {
        params['account'] = account;
      }
      dispatch(loadLotteryOrderItems(params, page));
    }
  }

  filterOrderWithAccount(cb = () => {}) {
    
    if (this.isDetailPage(this.props)) {
      return ;
    }

    let account = (this.refs.account || {value: ''}).value.trim();
    let event = null;
    if (typeof cb != 'function') {
      event = cb;
      cb = () => {};
    }
    const {dispatch} = this.props;
    this.refs.scroller.pageLoaded = 1;
    if (event && !validate.name(account)) {
      alert('请正确输入用户名(4-16位英文字母以及数字组合)');
      return ;
    }
    this.resetPager();
    this.openLoading();
    dispatch(loadLotteryOrderItems({
      'lotteryCode' :this.state.lotteryCode,
      'startTime': this.state.period.from,
      'finishTime': this.state.period.to,
      'account': account 
    }, this.crtPage, data => {
      cb();
      this.closeLoading();

      if (data.errorCode != RES_OK_CODE) {
        alert(data.msg);
      }
    }));
    
  }

  searchWithAccount(el) {
    this.setState({
      account: el.target.value.trim()
    });
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch, match} = this.props;
    let self = this;
    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.page-body-inner',
      refreshHandler({close, handler}) {
        self.resetPager();
        self.filterOrderWithAccount(() => {
          close();
        });
      }
    });
  }

  componentDidUpdate() {
    if (!this.isDetailPage(this.props)) {
      this.setupPullToRefresh();  
    }
    
  }

  componentWillUnmount() {
    if (!this.isDetailPage(this.props)) {
      this.setupPullToRefresh(true);  
    }
  }

  render() {
    
    let self = this;
    const {lotteryOrderItems, location, match} =  this.props;
    let isDetailPage = this.isDetailPage(this.props);

    return (
    
      <div>

        <Route path="/user/lotteryorder/:id" component={LotteryOrderDetailContainer} />
        
        {!isDetailPage && <div className="page lottery-order-page">
          <Header {...this.props}>
            <Back />
            <h3 onClick={ this.toggleLotterySwitcher } >{this.state.lotteryText} <i className={"arrow-down " + ( this.state.viewLotterySwitcher ? 'view': '' ) }></i></h3>
            <h4 onClick={ this.togglePeriodChange  }>{this.state.periodText}</h4>
            
            { this.state.viewLotterySwitcher &&  <LotterySwitcher defaultLotteryCode={this.state.lotteryCode} lotteryItems={this.props.lotteryItems} lotterySwitched={this.onLotteryChanged.bind(self)}/> }

            {this.state.viewDatePeriodFilter && <DatePeriodSwitcher onPeriodChange={this.onPeriodChanged.bind(self)}/>}

          </Header> 
          
          <div className="page-body">

            <div className="page-body-inner">
              { this.isAgent() && this.query.from != 'play' && 
                <div className="user-filter">
                  <input ref={'account'} type="text" onChange={this.searchWithAccount} value={this.state.account} placeholder="输入下级账号" className="input" />
                  <button className="btn btn-orange" onClick={this.filterOrderWithAccount}>搜索</button>
                </div>
              }

              { lotteryOrderItems.items.length <= 0 && <p className="no-data">暂无数据</p>}

              <InfiniteScroller 
                ref="scroller"
                initialLoad={false} 
                pageStart={this.pageStart} 
                loadMore={this.loadMoreItems} 
                hasMore={this.hasMore} 
                loader={ <div key={'loader'} className="loader"></div> }>
                { lotteryOrderItems.items.map( (item, index) => {
                  return <LotteryOrderItem history={this.props.history} key={index} orderItem={item} />
                } ) }
              </InfiniteScroller>
            </div>
            
          </div>

        </div> }
    
      </div>

      
    );
  }

};

LotteryOrderContainer.propTypes = {
  
};

LotteryOrderContainer.defaultProps = {
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    user: userModule.user,
    userModule,
    lotteryItems: userModule.order.get('lotteryItems'),
    lotteryOrderItems: userModule.order.get('lotteryOrderItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryOrderContainer));



