import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import t from 'tcomb-form';

import FormNotice from '../../../components/FormNotice';
import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import {password} from '../utils/validate';

import {resetPassword} from '../actions/User';

const schema = t.struct({
  newpwd: t.String,
  cfmpwd: t.String
});

const Form = t.form.Form;

const options = {
  fields: {
    newpwd: {
      attrs: {
        placeholder: '请输入6-16位英文字母以及数字组合',
      },
      label: <span>新<b className="oneword"></b>密<b className="oneword"></b>码</span>,
    },
    cfmpwd: {
      attrs: {
        placeholder: '请输入确认新密码',
      },
      label: '确认新密码',
    }
  }
};

class ForgetResetPwdContainer extends Component {

  constructor(props) {
    super(props);
    this.onFormChange = this.onFormChange.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.values = {
      newpwd: '',
      cfmpwd: ''
    };
  }

  onFormChange(values) {
    this.values = Object.assign(this.values, values);
  }

  componentWillReceiveProps(nextProps) {
    const {userModule, history}  = nextProps;
    if (userModule.user.get('auth').get('isLogin')) {
      history.push('/user');
    }
  }

  onSubmitHandler() {
    const {key, account, phone} = this.props.smsVerify;
    const {history} = this.props;

    let newpwd = this.values.newpwd;
    let cfmpwd = this.values.cfmpwd;
    if (!password(newpwd)) {
      alert('请输入6-16位数字/字母或组合的新密码');
    } else if (newpwd != cfmpwd) {
      alert('请输入6-16位数字/字母或组合的确认新密码');
    } else {
      //account, phone, key, pwd
      resetPassword(account, phone, key, newpwd, (data) => {
        if (data.errorCode == RES_OK_CODE) {
          alert(data.msg, (popup) => {
            popup.close();
            history.push('/login');
          });
        } else {
          alert(data.msg);
        }
      });
    }
  }

  render() {
    return (<div>
      <Header {...this.props}>
        <Back backTo='/user/forget' />
        <h3>忘记密码</h3>
      </Header>
      <div className="page-body">
        <div className="withdraw-form form-type2 form-type-fgp form-type-rsf">
          <div className="inner">
            <Form onChange={this.onFormChange} ref="form" options={options} type={schema}></Form>
            <p className="tip"><FormNotice msg="forgetpwd"></FormNotice></p>
            <div className="btn-wrap">
              <button onClick={this.onSubmitHandler} className="btn btn-submit btn-light-blue">确认</button>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
};

function mapStateToProps({userModule, app}) {
  return {
    userModule,
    app,
    smsVerify: userModule.user.get('smsVerify'),
  }
}

export default withRouter(connect(mapStateToProps)(ForgetResetPwdContainer));