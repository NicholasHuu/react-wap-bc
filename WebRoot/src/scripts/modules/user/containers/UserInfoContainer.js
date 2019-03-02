import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import LoadingComponent from '../../../components/LoadingComponent';

import Header from '../components/Header';
import Back from '../../../components/Back';
import UserDetailInfo from '../components/UserDetailInfo';
import UserSecurityInfo from '../components/UserSecurityInfo';
import BankInfo from '../components/BankInfo';
import {loadUserInfo,changeUserBasicInfo,loadUserPanelInfo, updateNickname} from '../actions/User';
import {alert,message} from '../../../utils/popup';
import {loadUserBankItems} from '../actions/UserWithdraw';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import PTR from '../../../utils/pulltorefresh';

class UserInfoContainer extends LoadingComponent {
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadUserInfo());
  }

  handleModify(bname){
    const {dispatch,history} = this.props;
    updateNickname(bname, (data) => {
      alert(data.msg);
    });
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.user-detail-info',
      refreshHandler({close, handler}) {
        dispatch(loadUserInfo(() => {
          close();
        }));
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

    return (
      <div className="user-info-page page">
        <div className="inner">
          <Header {...this.props}>
            <Back />
            <h3>个人资料</h3>
          </Header>
          <div className="page-body">
            <UserDetailInfo onChange={this.handleModify.bind(this)} user={this.props.userModule.user} />
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps(state) {
  const {app, userModule} = state;
  return {
    app, userModule
  };
}

export default connect(mapStateToProps)(UserInfoContainer);