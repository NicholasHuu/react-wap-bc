import React, {PropTypes, Component} from 'react';

import t from 'tcomb-form';
import {Link} from 'react-router-dom';
import ImageCode from './ImageCode';
import {alert} from '../../../utils/popup';
import FormNotice from '../../../components/FormNotice';

const Form = t.form.Form;
const schema = t.struct({
  username: t.String,
  password: t.String,
  code: t.String
});
const options = {
  fields: {
    username: {
      label: '帐号',
      attrs: {
        placeholder: '输入用户名',
        className: 'account',
      }
    },
    password: {
      label: '密码',
      type: 'password',
      attrs: {
        placeholder: '输入密码',
        className: 'password',
      },
    },
    code: {
      label: '验证码',
      type: 'number',
      attrs: {
        placeholder: '输入验证码',
        className: 'captcha-code',
      },
    },
  }
};

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: '',
        password: '',
        code: '',
      },
    };
    this.onLogin = this.onLogin.bind(this);
    this.onForgetPwd = this.onForgetPwd.bind(this);
    this.onLoginInputChange = this.onLoginInputChange.bind(this);
  }
  
  onLogin() {
    this.props.onLogin(this.state.value);
  }

  onForgetPwd() {
    alert('请联系24小时客服找回密码');
  }

  onLoginInputChange(value, path) {
    this.state.value = Object.assign(this.state.value, value);
  }

  render() {
    return (
      <div className='form form-type2'>
        <div className="inner">

          <Form ref='form' value={this.state.value} onChange={this.onLoginInputChange} type={schema} options={options} />
          <ImageCode {...this.props} />
          
          <div className="form-links">
            <Link to="/user/forget">忘记密码</Link>
            <Link to='/register'>注册帐号>></Link>
          </div>
          <div className="btn-wrap">
            <button className='btn btn-submit btn-light-blue' onClick={this.onLogin}>登 录</button>
          </div>
          <FormNotice msg="login"></FormNotice>
        </div>
          
      </div>
    );
  }
};

LoginForm.defaultProps = {
  onLogin: () => {},
};

LoginForm.propTypes = {
  onLogin: PropTypes.func
};

export default LoginForm;

