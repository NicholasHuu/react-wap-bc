import React, {Component, PropTypes} from 'react';

import t from 'tcomb-form';
import FormNotice from '../../../components/FormNotice';

import {mobileNum, name as nameValidate} from '../utils/validate';
import {alert} from '../../../utils/popup';

const Form = t.form.Form;

const schema = t.struct({
  account: t.String,
  phone: t.Number,
  code: t.String,
});

const codeTimer = 60;

class PhoneGetPasswordForm extends Component {
  
  constructor(props) {
    super(props);
    this.onFormChange = this.onFormChange.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onGetPhoneCode = this.onGetPhoneCode.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.state = {
      values: {
        account: '',
        code: ''
      },
    };
    this.timerHandler = null;
    this.timerSecond = codeTimer;    
    let self = this;
    this.options = {
      fields: {
        account: {
          label: '用户名',
          attrs: {
            placeholder: '请输入用户名',
          },
        },
        phone: {
          type: 'number',
          label: '手机号',
          attrs: {
            placeholder: '请输入手机号码',
          },
        },
        code: {
          label: '验证码',
          template: t.form.Form.templates.textbox.clone({
            renderInput(locals) {
              return (
                <div className="phone-code-wrap">
                  <input placeholder={locals.attrs.placeholder} type="text" value={locals.value} onChange={(event) => { locals.onChange(event.target.value) }} />
                  <button onClick={locals.attrs.onGetPhoneCode} className={ "btn btn-get-code "}>获取验证码</button>
                </div>
              );
            }
          }),
          attrs: {
            onGetPhoneCode: self.onGetPhoneCode,
            placeholder: '请输入验证码',
          }
        } 
      }
    };
  }

  startTimer(btn) {
    
    let self = this;
    
    self.timerHandler = setInterval(() => {
      
      if (self.timerSecond < 1) {
        clearInterval(self.timerHandler);
        self.timerSecond = codeTimer;
        self.timerHandler = null;
        btn.innerHTML = '获取验证码';
        btn.className = btn.className.replace(/btn\-gray/g, '');
      } else {
        self.timerSecond = self.timerSecond - 1;
        btn.innerHTML = ( self.timerSecond < 10 ? '0'+self.timerSecond: self.timerSecond ) + '秒重新获取';
        if (btn.className.indexOf('btn-gray') == -1) {
          btn.className = btn.className + ' btn-gray';  
        }
      }

      self.options = Object.assign({}, self.options);

    }, 1000);

  }

  onGetPhoneCode(event) {
    // 倒计时运行中
    if (this.timerHandler) {
      return ;
    }
    let values = this.state.values;
    let account = values['account'] || '';
    if ( account.trim().length <= 0 || !nameValidate(account.trim()) ) {
      alert('请输入4-16位数字/字母或组合的帐号');
      return ;
    }

    let target = event.target;
    this.props.onCodeGetHandler(this.state.values, ok => {

      if (ok) {
        this.startTimer(target);  
      }
    });
    
  }

  onFormChange(values, path) {
    this.state.values = Object.assign({}, this.state.values, values);
  }

  onSubmitHandler(value, path) {
    let values = this.state.values;
    if (!values.account.trim() || !nameValidate(values.account)) {
      alert('请输入4-16位数字/字母或组合的帐号');
    } else if (!values.code) {
      alert('请正确输入验证码');
    } else {
      this.props.onSubmitHandler(this.state.values);
    }
  }

  render() {
    console.log(['values', this.state.values]);
    return (
      <div className="withdraw-form form-type2 form-type-fgp">
        <div className="inner">
          <Form value={this.state.values} onChange={this.onFormChange} ref="form" options={this.options} type={schema}></Form>
          <p className="tip"><FormNotice msg="forgetpwd"></FormNotice></p>
          <div className="btn-wrap">
            <button onClick={this.onSubmitHandler} className="btn btn-submit btn-light-blue">确认</button>
          </div>
        </div>
      </div>
    );
  }
};

PhoneGetPasswordForm.propTypes = {
  onCodeGetHandler: PropTypes.func,
  onSubmitHandler: PropTypes.func
};

PhoneGetPasswordForm.defaultProps = {
  onCodeGetHandler: () => {},
  onSubmitHandler: () => {},
};

export default PhoneGetPasswordForm;