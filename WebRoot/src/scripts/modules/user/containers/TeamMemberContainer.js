import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import TabSwitcher from '../components/TabSwitcher';
import {alert, confirm} from '../../../utils/popup';

import LoadingComponent from '../../../components/LoadingComponent';
import ChildSalaryDetailContainer from './ChildSalaryDetailContainer';
import {parseQuery, buildQuery} from '../../../utils/url';
import {loadTeamMemberOfAgent, loadTeamMemberOfAccount} from '../actions/UserOrder';
import PTR from '../../../utils/pulltorefresh';
import * as validate from '../utils/validate';

const tabOptions = [ ['agent', '代理会员'], ['member', '普通会员'] ];

class TeamMemberContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.params = {};
    this.crtTab = tabOptions[0][0];
    this.account = '';
    this.resetPager();

    this.state = {
      viewDetail: false
    };
    
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);

  }

  resetPager() {
    // 分页数据
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;
    if (this.refs.scroller) {
      let scroller = this.refs.scroller;
      scroller.pageLoaded = this.pageStart;
    }
  }

  loadMoreItems(page) {
    if (page > this.totalPage) {
      this.hasMore = false;
      return ;
    } else {
      this.crtPage = page;
      this.loadTeamMember();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.crtTab == 'agent') {
      if (nextProps.teamAgent.items.length > 0 || nextProps.teamAgent.items != this.props.teamAgent.items ) {
        this.closeLoading();
        this.totalPage = nextProps.teamAgent.totalPage;
      }
    }
    if (this.crtTab == 'member') {
      if (nextProps.teamAccount.items.length > 0 || nextProps.teamAccount.items != this.props.teamAccount.items ) {
        this.closeLoading();
        this.totalPage = nextProps.teamAccount.totalPage;
      }
    }
    
    // url 发生变化
    if (nextProps.location != this.props.location) {
      let query = parseQuery(nextProps.location.search);
      this.account = query.account || '';
      this.flag = 0;
      this.crtTab = 'agent';
      this.resetPager();
      this.loadTeamMember();
    }

  }

  loadTeamMember(cb = () => {}) {
    let API = loadTeamMemberOfAgent;
    if (this.crtTab == 'member') {
      API = loadTeamMemberOfAccount;
    }
    const {dispatch} = this.props;
    dispatch(API(this.account, this.crtPage, cb, this.flag));
  }

  onDetailClick(item) {
    const {history} = this.props;
    history.push(`/user/teammanager/${item.id}`);
  }

  componentDidMount() {
    const {location} = this.props;
    let query = parseQuery(location.search);
    this.account = query.account || '';
    if (this.account) {
      this.flag = 0;
    }
    this.loadTeamMember();
  }
  
  onTabChange(tab) {
    this.crtTab = tab;
    //this.account = '';
    this.openLoading();
    this.resetPager();
    this.loadTeamMember();
  }

  onSearchClick() {
    let accountRef = null;
    let msgRef = null;
    let html = <div className="account-search-popup">
      <div className="wrap">
        <label>用户名</label>
        <input type="text" ref={ el => accountRef = el } className="account" placeholder="请输入4-16位数字/字母或组合的帐号"/>
        <p className="msg" ref={ el => msgRef = el }></p>
      </div>
    </div>
    const {dispatch, history} = this.props;
    let self = this;
    confirm(html, '搜索', (popup) => {
      let account = accountRef.value.trim();
      if (!validate.name(account)) {
        ReactDOM.findDOMNode(msgRef).textContent = "请输入4-16位数字/字母或组合的帐号";
        return ;
      }
      self.account = account;
      self.flag = 0;
      self.resetPager();
      self.loadTeamMember();
      popup.close();
    }, {className: 'popup-search'});
  }

  searchAgentMembers(item) {
    const {history, location} = this.props;
    if (item.userTypeValue == 1 && item.clickFlag != "0") {
      let url = "/user/teammanager";
      let query = buildQuery({
        account: item.userName 
      });
      let crtQuery = parseQuery(location.search);
      if (crtQuery.account && crtQuery.account == item.userName) {
        this.flag = 0;
        this.account = item.userName;
        this.resetPager();
        this.loadTeamMember();
      } else {
        history.push(`${url}?${query}`);  
      }
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
        self.loadTeamMember( () =>  {
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

  render() {
    const {salaryItems} = this.props;
    let items = [];
    if (this.crtTab == 'member') {
      items = this.props.teamAccount.items;
    } else {
      items = this.props.teamAgent.items;
    }
    let self = this;
    return (
      <div className="page page-team-member">
        <Header {...this.props}>
          <Back />
          <h3>团队管理</h3>
          <span onClick={this.onSearchClick}>搜索</span>
        </Header>
        <div className="page-body">
          <div className="page-body-inner">
            <TabSwitcher defaultTab={this.crtTab} onChange={this.onTabChange} tabs={tabOptions} ></TabSwitcher>
            <div className="child-salary-items">
                
              {items.length <= 0 && <p className="no-data">暂无数据</p>}

              {items.length > 0 && <ul>
                <InfiniteScroller
                  ref={ "scroller" }
                  initialLoad={false} 
                  pageStart={this.pageStart} 
                  loadMore={this.loadMoreItems} 
                  hasMore={this.hasMore} 
                  loader={ <div key={'loader'} className="loader"></div> }
                >
                  {items.map( (item, index) => {
                    return <li key={index}  >
                      <div>
                        <label>用户</label>
                        <span onClick={ this.searchAgentMembers.bind(self, item) } className={ ({true: 'agent', false: ''})[item.userTypeValue == 1 && item.clickFlag != "0"] }>{item.userName}</span>
                      </div>
                      <div onClick={self.onDetailClick.bind(self, item)}><label>{ ({true: '用户余额', false: '团队总余额'})[this.crtTab == 'member']}</label><span>{ ({true: item.userMoney, false: item.teamMoney})[this.crtTab == 'member']}</span></div>
                    </li>
                  } )}
                  
                </InfiniteScroller>
              </ul> }
            </div>
          </div>
        </div>
      </div>
    );
  }
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    teamAgent: userModule.order.get('teamMemberOfAgent'),
    teamAccount: userModule.order.get('teamMemberOfAccount'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(TeamMemberContainer));