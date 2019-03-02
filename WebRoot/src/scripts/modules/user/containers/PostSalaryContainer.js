import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import InfiniteScroller from 'react-infinite-scroller';
import t from 'tcomb-form';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';
import TabSwitcher from '../components/TabSwitcher';
import {loadSalaryDetailItems, postSalary} from '../actions/UserOrder';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import PTR from '../../../utils/pulltorefresh';
import FormNotice from '../../../components/FormNotice';

const Form = t.form.Form;

const struct = t.struct({
  zjPassword: t.String
});

const options = {
  fields: {
    zjPassword: {
      label: '资金密码',
      attrs: {
        placeholder: '输入资金密码',
      },
      type: 'password',
    },
  }
};

const periodOptions = [ ['1', '今天'], ['7', '一周'], ['30', '一月'] ];

class PostSalaryContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    
    this.crtTab = periodOptions[0][0];

    this.state = {
      viewDetail: false,
      crtItem: {},
      formValues: {

      },
    };
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

  getPeriodFromTab(period) {
    let d = new Date();
    let f = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    let to , from ;
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

    return [from, to]
  }

  onTabChange(tab) {
    this.crtTab = tab;
    
    this.resetPager();
    this.loadSalaryItems();
  }

  componentDidMount() {
    const {userModule, history} = this.props;
    let hasWithdrawProfile = userModule.user.get('info').hasWithdrawProfile;
    if (!hasWithdrawProfile) {
      history.push('/user/setWithdraw');
      return ;
    }
    this.loadSalaryItems();
  }

  componentWillReceiveProps(nextProps) {
    const {salaryDetailItems} =  nextProps;
    if (salaryDetailItems.items.length > 0 || this.props.salaryDetailItems !== salaryDetailItems) {
      this.closeLoading();
      this.totalPage = salaryDetailItems.totalPage;
    }
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

  loadSalaryItems(cb = () => {}) {
    let [from, to] = this.getPeriodFromTab(this.crtTab);
    let params = {
      startTime: from,
      finishTime: to
    };
    const {dispatch} = this.props;
    dispatch(loadSalaryDetailItems(params, this.crtPage, cb));
  }

  goPostSalaryFormPage(item) {
    this.setState({
      viewDetail: true,
      crtItem: item
    });
  }

  hidePostSalaryForm() {
    this.setState({
      crtItem: {},
      viewDetail: false
    });
  }

  onSubmitHandler() {
    let zjPassword = this.state.formValues.zjPassword;
    if (!zjPassword || zjPassword.length <= 0) {
      alert('请输入资金密码');
    } else {
      postSalary(zjPassword, this.state.crtItem.id, data => {
        alert(data.msg, popup => {
          if (data.errorCode == RES_OK_CODE) {
            this.hidePostSalaryForm();
            this.setState({
              formValues: {},
              crtItem: this.state.crtItem.status = '已发放'
            });

          } else {
            //
          }
          popup.close();
        });
      });
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
      mainElement: '.salary-items',
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
    const {salaryDetailItems} = this.props;
    return (
      <div>
        
        <FormNotice className="post-salary-container-msg" msg="rxff"></FormNotice>

        <TabSwitcher onChange={this.onTabChange} timeTab={true} tabs={periodOptions}></TabSwitcher>

        <div className="salary-items">
          
          {salaryDetailItems.items.length <= 0 && <p className="no-data">暂无数据</p>}

          <ul>
            <InfiniteScroller
              ref={ "scroller" }
              initialLoad={false} 
              pageStart={this.pageStart} 
              loadMore={this.loadMoreItems} 
              hasMore={this.hasMore} 
              loader={ <div key={'loader'} className="loader"></div> }
            >

            { salaryDetailItems.items.map( (item, index) => {
              return <li key={index} onClick={this.goPostSalaryFormPage.bind(this, item)}>
                <div>
                  <label>用户</label>
                  <span>{item.userName}</span>
                </div>
                <div>
                  <label>日薪金额</label>
                  <span>{item.salaryMoney}</span>
                </div>
                <div><label>状态</label><span>{item.status}</span></div>
              </li>
            }) }
              
            </InfiniteScroller>
          </ul>
        </div>

        {this.state.viewDetail && <div className="page page-post-salary-detail">  

          <Header>
            <a onClick={this.hidePostSalaryForm.bind(this)} />
            <h3>日薪管理</h3>
          </Header>

          <div className="page-body">
        
            <ul>
              <li className="summary">
                <label>用户名</label>
                <span className="color-orange">{this.state.crtItem.userName}</span>
              </li>
              <li>
                <label>日期</label>
                <span>{this.state.crtItem.date}</span>
              </li>
              <li>
                <label>投注人数</label><span>{this.state.crtItem.personCount}</span>
              </li>
              <li>
                <label>亏损情况</label>
                <span>{this.state.crtItem.lossCount}</span>
              </li>
              <li><label>投注金额</label><span>{this.state.crtItem.betMoney}</span></li>
              <li>
                <label>日薪金额</label>
                <span>{this.state.crtItem.salaryMoney}</span>
              </li>
              <li><label>日薪总额</label><span>{this.state.crtItem.salaryAmount}</span></li>
            </ul>

            { this.state.crtItem.statusValue == 0 &&  <div className="withdraw-form form-type2">
              <div className="inner">
                <Form onChange={ values => this.setState({formValues: values}) } ref="form" options={options} value={this.state.formValues} type={struct}></Form>
              </div>
              <div className="btn-wrap">
                <button onClick={this.onSubmitHandler} className="btn btn-submit btn-light-blue">发放日薪</button>
              </div>
            </div> }

          </div>
          
        </div> }

      </div>
    );
  }
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    salaryDetailItems: userModule.order.get('salaryDetailItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(PostSalaryContainer));