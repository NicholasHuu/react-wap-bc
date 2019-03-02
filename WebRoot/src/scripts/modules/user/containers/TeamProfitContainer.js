import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';
import {alert, confirm} from '../../../utils/popup';

import TabSwitcher from '../components/TabSwitcher';
import UserProfitItem from '../components/UserProfitItem';
import {loadLotteryFunds, 
  loadTeamProfit,
  loadAllLottery} from '../actions/UserOrder';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import HeaderChose from '../components/HeaderChose';
import {parseQuery, buildQuery} from '../../../utils/url';
import PTR from '../../../utils/pulltorefresh';
import * as validate from '../utils/validate';

const periodOptions = [ ['1', '今天'], ['7', '一周'], ['30', '一月'] ];
const flagOptions = [ [0, '团队盈亏详情'], [1, '每日盈亏详情'] ];

class TeamProfitContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.onDatePeriodChange = this.onDatePeriodChange.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.loadFundItems = this.loadFundItems.bind(this);
    this.onDatePeriodChange = this.onDatePeriodChange.bind(this);
    this.onFlagChange = this.onFlagChange.bind(this);
    this.onSearchWithAccount = this.onSearchWithAccount.bind(this);
    this.switchGameType = this.switchGameType.bind(this);
    this.period = periodOptions[0][0];
    this.flag = flagOptions[0][0];
    this.account = '';

    // 分页数据
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;
    this.state = {
      errorMsg: '请输入用户名',
      flag: flagOptions[0][0],
      flatType: ''
    };
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
      account: this.account,
      flag: this.flag,
      flatType: this.state.flatType
    };

    const {dispatch} = this.props;
    dispatch(loadTeamProfit(params, this.crtPage, cb));
  }

  componentWillReceiveProps(nextProps) {
    const {teamProfitItems} =  nextProps;
    if (teamProfitItems.items.length > 0 || this.props.teamProfitItems !== teamProfitItems) {
      this.closeLoading();
      this.totalPage = teamProfitItems.totalPage;
    }
    if (nextProps.location !== this.props.location) {
      let query = parseQuery(nextProps.location.search);
      let userName = query.userName;
      this.openLoading();
      this.account = userName || '';
      this.resetPager();
      this.loadFundItems();
    }
  }

  componentWillMount() {
    let query = this.parseQuery();
    if (query.userName) {
      this.account = query.userName;
    }
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
    if (page > this.totalPage) {
      this.hasMore = false;
      return ;
    } else {
      this.crtPage = page;
      this.loadFundItems();
    }
  }

  onFlagChange(flag){
    this.flag = flag;
    this.setState({
      flag
    });
    this.resetPager();
    this.loadFundItems();
  }

  onSearchWithAccount() {
    let accountRef = null;
    let msgRef = null;
    let html = <div className="account-search-popup">
      <div className="wrap">
        <label>用户名</label>
        <input type="text" ref={ el => accountRef = el } className="account" placeholder="请输入4-16位数字/字母或组合的帐号"/>
        <p className="msg" ref={ el => msgRef = el }></p>
      </div>
    </div>
    const {dispatch} = this.props;
    let self = this;
    confirm(html, '搜索', (popup) => {
      let account = accountRef.value.trim();
      if (account.length <= 0 || !validate.name(account)) {
        ReactDOM.findDOMNode(msgRef).textContent = "请输入4-16位数字/字母或组合的帐号";
        return ;
      }
      loadTeamProfit({
        account: account,
        flag: self.flag,
      }, 1, data => {
        if (data.errorCode != RES_OK_CODE) {
          ReactDOM.findDOMNode(msgRef).textContent = data.msg;
        } else {
          self.account = account;
          self.resetPager();
          self.loadFundItems();
          popup.close();
        }
      })();
    }, {className: 'popup-search'});

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
        self.loadFundItems( () =>  {
          close();
        } );
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }

  onAgentClick(item) {
    const {teamProfitItems, history} = this.props;
    let currentUserName = teamProfitItems.currentUserName;
    if (currentUserName == item.userName) {
      return ;
    }
    history.push(`/user/team/profit?${buildQuery({userName: item.userName})}`);
  }
  switchGameType(flatType){
    this.state.flatType = flatType;
    this.loadFundItems();
  }
  render() {
    const {teamProfitItems,userModule} = this.props;
    let self = this;
    let query = this.parseQuery();
    let gameList = userModule.user.get('otherGameTypeList');
    return <div className="page page-lottery-funds">
        
        <Header {...this.props}>
          
          <Back />
            
          <h3>团队盈亏</h3>
          <div><HeaderChose swithItem={this.switchGameType.bind(this)} list={gameList} /></div>
          {/*<div>{this.state.flag == 0 && <span onClick={this.onSearchWithAccount}>Search Icon</span> }</div>*/}

        </Header>

        <div className="page-body">

          <div className="page-body-inner">
            <TabSwitcher tabs={flagOptions} onChange={this.onFlagChange}></TabSwitcher> 

            <TabSwitcher timeTab={true} tabs={periodOptions} onChange={this.onDatePeriodChange}></TabSwitcher> 

            {teamProfitItems.items.length <= 0 && <p className="no-data">暂无数据</p>}

            <div className="lottery-funds">

              <InfiniteScroller
                ref={ "scroller" }
                initialLoad={false} 
                pageStart={this.pageStart} 
                loadMore={this.loadMoreItems} 
                hasMore={this.hasMore} 
                loader={ <div key={'loader'} className="loader"></div> }
              >
              
              {teamProfitItems.items.map( (item, index) => {
                return <UserProfitItem onClick={this.onAgentClick.bind(this, item)} isMember={ self.flag == 0 } key={index} item={item} /> 
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
    teamProfitItems: userModule.order.get('teamProfitItems'),
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(TeamProfitContainer));