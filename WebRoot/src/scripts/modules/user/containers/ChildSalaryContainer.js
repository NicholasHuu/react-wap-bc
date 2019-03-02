import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import TabSwitcher from '../components/TabSwitcher';

import {loadChildSalary} from '../actions/UserOrder';
import LoadingComponent from '../../../components/LoadingComponent';
import ChildSalaryDetailContainer from './ChildSalaryDetailContainer';
import {parseQuery} from '../../../utils/url';
import PTR from '../../../utils/pulltorefresh';

class ChildSalaryContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.params = {};
    this.resetPager();

    this.state = {
      viewDetail: false,
    };

    const {history} = this.props;

    this.query = parseQuery(history.location.search);
    if (this.query.username) {
      this.params['account'] = this.query.username;
    }
    
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.onDetailBack = this.onDetailBack.bind(this);

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

  loadSalaryItems(cb = () => {}) {
    const {dispatch} = this.props;
    dispatch(loadChildSalary(this.params, this.crtPage, cb));
  }

  loadMoreItems(page) {
    if (page > this.totalPage) {
      this.hasMore = false;
      return ;
    } else {
      this.crtPage = page;
      this.loadSalaryItems();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.salaryItems.items.length > 0 || nextProps.salaryItems != this.props.salaryItems) {
      this.closeLoading();
      this.totalPage = nextProps.salaryItems.totalPage;
    }
    
    // 当前搜索用户名发生变化后重新搜索夏季日薪
    let query = parseQuery(nextProps.location.search);
    if (query.username != this.query.username) {
      this.query = query;
      this.params['account'] = this.query.username || '';
      this.resetPager();
      this.loadSalaryItems();
    }

  }

  onDetailClick(item) {
    const {history, match} = this.props;
    match.params.id = item.id;
    match.onBack = this.onDetailBack;
    this.setState({
      viewDetail: true
    });
  }

  onDetailBack() {
    this.resetPager();
    this.loadSalaryItems();
    console.log(['detail back']);
    this.setState({
      viewDetail: false
    });
  }

  componentWillMount() {
    this.loadSalaryItems();
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
        self.loadSalaryItems(() => {
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
  
  render() {
    const {salaryItems} = this.props;
    let self = this;
    return (
      <div>
        <div className="child-salary-items">
          
          {salaryItems.items.length <= 0 && <p className="no-data">暂无数据</p>}

          <ul>
            <InfiniteScroller
              ref={ "scroller" }
              initialLoad={false} 
              pageStart={this.pageStart} 
              loadMore={this.loadMoreItems} 
              hasMore={this.hasMore} 
              loader={ <div key={'loader'} className="loader"></div> }
            >
              {salaryItems.items.map( (item, index) => {
                return ( <li onClick={self.onDetailClick.bind(self, item)} key={index}>
                  <div>
                    <label>用户</label>
                    <span>{item.userName}</span>
                  </div>
                  <div><label>日薪金额</label><span>{item.salaryMoney}</span></div>
                </li>)
              } )}

            </InfiniteScroller>
          </ul>
        </div>

        {this.state.viewDetail && <div className="child-salary-detail">
          <div className="wrap">
            <ChildSalaryDetailContainer onBack={ this.onDetailBack } {...this.props}/>
          </div>
        </div>}
        
      </div>
      
    );
  }
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    salaryItems: userModule.order.get('childSalaryItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(ChildSalaryContainer));