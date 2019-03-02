import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';

import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';
import {sendSMSCode, verifySMSCode} from '../actions/User';

import PhoneGetPasswordForm from '../components/PhoneGetPasswordForm';

class ForgetPwdContainer extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPhoneCode = this.onPhoneCode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {userModule, history}  = nextProps;
    if (userModule.user.get('auth').get('isLogin')) {
      history.push('/user');
    }
  }
  
  onSubmit(values) {
    const {account, code} = values;
    const {dispatch, history} = this.props;
    dispatch(verifySMSCode(account, '', code, (data) => {
      if (data.errorCode == RES_OK_CODE) {
        history.push('/user/forget/reset');
      } else {
        alert(data.msg);
      }
    }));
  }

  onPhoneCode(values, cb = () => {}) {
    sendSMSCode(values['account'], '', (data) => {
      if (data.errorCode == RES_OK_CODE) {
        cb(true);
      } else {
        alert(data.msg);
        cb(false);
      }
    });
  }

  render() {
    return (
      <div>
        <Header {...this.props}>
          <Back />
          <h3>忘记密码</h3>
        </Header>
        <div className="page-body">
          <PhoneGetPasswordForm onSubmitHandler={this.onSubmit} onCodeGetHandler={this.onPhoneCode}/>
        </div>
      </div>
    );
  }
};

function mapStateToProps({userModule, app}) {
  return {
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(ForgetPwdContainer));