import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {alert} from '../../../utils/popup';
import Back from '../../../components/Back';
import Header from '../../../components/Header';
import TabSwitcher from '../components/TabSwitcher';
import LotteryTraceItem from '../components/LotteryTraceItem';

import {bodyClass, resetBodyClass} from '../../../actions/AppAction';

import { loadLotteryTraceItems } from '../actions/UserOrder';
import LoadingComponent from '../../../components/LoadingComponent';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {parseQuery} from '../../../utils/url';
import PTR from '../../../utils/pulltorefresh';

import LotteryTraceDetailContainer from './LotteryTraceDetailContainer';
import PrivateRoute from '../../../containers/PrivateRouteContainer';

import InfiniteScroller from 'react-infinite-scroller';

const tabs = [
  ['all', '全部'],
  ['1', '进行中'],
  ['0', '已完成'], 
];

class LotteryTraceContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: '',
    };

    this.loadTraceItems = this.loadTraceItems.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.filterWithAccount = this.filterWithAccount.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);

    const {location} = props;
    let query = parseQuery(location.search);
    this.state.account = query.username || '';
    
    this.query = query;

    // 分页数据
    this.initPager();

    // 状态
    this.status = tabs[1][0];

  }

  initPager() {
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;
    (this.refs.scroller || {}).pageLoaded = 1;
  }

  onStatusChange(tab) {
    this.status = tab;
    this.initPager();
    this.openLoading();
    this.loadTraceItems(() => this.closeLoading());
  }

  isAgent() {
    const {user} = this.props;
    return user.get('info').isAgent == 1;
  }

  componentWillMount() {
    bodyClass('chase-body');
    this.loadTraceItems();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
    resetBodyClass();
  }

  loadMoreItems(page) {
    this.crtPage = page;
    if (this.crtPage > this.totalPage) {
      this.hasMore = false;
      return ;
    } else {
      this.loadTraceItems();
    }
  }

  filterWithAccount(cb = () =>{}) {
    let self = this;

    let event = null;
    if (typeof cb != 'function') {
      event = cb;
      cb = () => {};
    }
    
    this.openLoading();
    this.initPager();
    this.loadTraceItems((data) => {
      this.closeLoading();
      typeof cb == 'function' && cb();
      if (data.errorCode != RES_OK_CODE) {
        self.setState({
          errorMsg: data.msg
        });
        alert(data.msg);
      }
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
        self.initPager();
        self.filterWithAccount(() => {
          close();
        });
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillReceiveProps(nextProps) {
    const {traceItems} = nextProps;
    if (traceItems.items.length != this.props.traceItems.items.length || traceItems.items != this.props.traceItems.items) {
      this.closeLoading();
      this.totalPage = traceItems.totalPage;
    }

    if (this.props.location != nextProps.location && nextProps.location.pathname == '/user/tracehistory') {
      this.initPager();
      this.openLoading();
      this.loadTraceItems( () => {
        this.closeLoading();
      });
    }
  }

  loadTraceItems(cb = () => {}) {
    let account = ( ( this.refs.account || {value: ''} ).value || this.state.account ).trim();
    const {dispatch} = this.props;
    dispatch(loadLotteryTraceItems({
      account,
      status: (this.status == 'all' ? '': this.status)
    }, this.crtPage, cb));
  }

  render() {

    const {traceItems, history, location} = this.props;
    let query = this.query;

    let isDetail = location.pathname.search(/\d+/) != -1;

    return (
      
      <div>
      
        {!isDetail && <div className="page page-lottery-trace">
          
          <Header {...this.props}>
            <Back />
            <h3>追号记录</h3>
          </Header>
    
          <div className="page-body">
            
            <div className="page-body-inner">
              <TabSwitcher defaultTab={tabs[1][0]} onChange={this.onStatusChange} tabs={tabs}></TabSwitcher>

                {this.isAgent() && query.from != 'play' && 
                  <div className="user-filter">
                    <input ref={'account'} type="text" onChange={ event => this.setState({account: event.target.value.trim()}) } value={this.state.account} placeholder="输入下级账号" className="input" />
                    <button className="btn btn-orange" onClick={this.filterWithAccount}>搜索</button>
                  </div>
                }

                {traceItems.items.length <= 0 && this.state.errorMsg != '' && <p className="no-data">{this.state.errorMsg}</p>}

                {traceItems.items.length <= 0 && this.state.errorMsg == '' && <p className="no-data">暂无数据</p>}

                <div className="trace-items">
                  <InfiniteScroller 
                    ref="scroller"
                    initialLoad={false} 
                    pageStart={this.pageStart} 
                    loadMore={this.loadMoreItems} 
                    hasMore={this.hasMore} 
                    loader={ <div key={'loader'} className="loader"></div> }>
                    { traceItems.items.map( (item, index) => {
                      return <LotteryTraceItem history={this.props.history} key={index} traceItem={item} />
                    } ) }
                  </InfiniteScroller>
                </div>
            </div>
          </div>
        </div>}

        <PrivateRoute component={LotteryTraceDetailContainer} path="/user/tracehistory/:id/:number" />

      </div>

      
    );
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    user: userModule.user,
    userModule,
    traceItems: userModule.order.get('lotteryTraceItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryTraceContainer));