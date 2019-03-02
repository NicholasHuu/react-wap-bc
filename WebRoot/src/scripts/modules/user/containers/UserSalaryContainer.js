import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import TabSwitcher from '../components/TabSwitcher';
import UserSalaryDetailContainer from './UserSalaryDetailContainer';
import PostSalaryContainer from './PostSalaryContainer';
import ChildSalaryContainer from './ChildSalaryContainer';
import ChildSalaryForm from '../components/ChildSalaryForm';
import {alert, confirm} from '../../../utils/popup';
import {buildQuery} from '../../../utils/url';
import {loadChildSalary, testChildSalaryExist} from '../actions/UserOrder';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import * as validate from '../utils/validate';

const tabOptions = [ ['mysalary', '我的日薪'], ['postsalary', '日薪发放'], ['subsalary', '下级日薪'], ['newsalary', '新增下级日薪'] ];

class UserSalaryContainer extends Component {
  
  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSearchWithAccount = this.onSearchWithAccount.bind(this);

    this.state = {
      flag: 1,
    };

    this.crtTab = '';
    this.rejustCrtTab(props);
  }

  rejustCrtTab(props) {
    const {location} = props;
    if (location.pathname ==  '/user/salary/post') {
      this.crtTab = 'postsalary';
    } else if (location.pathname == '/user/salary') {
      this.crtTab = 'mysalary';
    } else if (location.pathname == '/user/salary/child') {
      this.crtTab = 'subsalary';
      this.state.flag = 0;
    } else if (location.pathname == '/user/salary/add') {
      this.crtTab = 'newsalary';
    }
  }

  componentDidMount() {
    let info = this.props.userModule.user.get('info');
    if (!info.hasWithdrawProfile) {
      this.props.history.push(`/user/setWithdraw`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location != this.props.location) {
      this.rejustCrtTab(nextProps);
    }
  }

  onTabChange(tab) {
    const {history} = this.props;
    if (tab == 'postsalary') {
      this.state.flag = 1;
      history.push('/user/salary/post');
    } else if (tab == 'mysalary') {
      this.state.flag = 1;
      history.push('/user/salary');
    } else if (tab == 'subsalary') {
      this.state.flag = 0;
      history.push('/user/salary/child');
    } else if (tab == 'newsalary') {
      this.state.flag = 1;
      history.push('/user/salary/add');
    }
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
    const {dispatch, history} = this.props;
    let self = this;
    confirm(html, '搜索', (popup) => {
      let account = accountRef.value.trim();
      if (account.length <= 0 || !validate.name(account)) {
        ReactDOM.findDOMNode(msgRef).textContent = "请输入4-16位数字/字母或组合的帐号";
        return ;
      }

      testChildSalaryExist(account, (data) => {
        if (data.errorCode == RES_OK_CODE) {
          const query = buildQuery({username: account});
          history.replace(`/user/salary/child?${query}`);
        } else {
          ReactDOM.findDOMNode(msgRef).textContent = data.msg;
        }
      });

    }, {
      className: 'popup-search',
    });
  }

  onAddSalaryFinish() {
    console.log(['child salary add finish']);
  }
  
  render() {
    const {history} = this.props;
    return (
      <div className="page page-user-salary">
        <Header {...this.props}>
          <Back to={'/user'} />
          
          <h3>日薪管理</h3>


          {this.state.flag == 0 && <span onClick={this.onSearchWithAccount}>Search Icon</span> }

        </Header>
        
        <div className="page-body">

          <div className="page-body-inner">
            <TabSwitcher defaultTab={this.crtTab} onChange={this.onTabChange} tabs={tabOptions}></TabSwitcher>

            <Route component={UserSalaryDetailContainer} exact path="/user/salary" />
            
            <Route component={PostSalaryContainer}  path="/user/salary/post" />
            
            <Route component={ChildSalaryContainer}  path="/user/salary/child" />

            <Route history={history} onFinish={this.onAddSalaryFinish} component={ChildSalaryForm} path="/user/salary/add" />
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
    app
  };
}

export default withRouter(connect(mapStateToProps)(UserSalaryContainer));