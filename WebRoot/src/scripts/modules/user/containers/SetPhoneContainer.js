import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import t from 'tcomb-form';

import ModifyAccountPsw from '../components/ModifyAccountPsw';
import ModifyMoneyPsw from '../components/ModifyMoneyPsw';
import Header from '../components/Header';
import Back from '../../../components/Back';
import {loadUserInfo, updateNickname, sendSMSCode, bindMobilePhone} from '../actions/User';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {mobileNum} from '../utils/validate';
import FormNotice from '../../../components/FormNotice';

const Form = t.form.Form;

const INTERVAL_SECOND = 60;

const schema = t.struct({
  phone: t.String,
  vcode: t.String
});

class SetPhoneContainer extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      values: {
        
      },
    };

    this.updatePhone = this.updatePhone.bind(this);
    this.onGetPhoneCode = this.onGetPhoneCode.bind(this);
    this.timerHandler = null;
    this.timerSecond = INTERVAL_SECOND;

    this.options = {
      fields: {
        phone: {
          label: '手机号',
          attrs: {
            placeholder: '请输入手机号码',
          },
        },
        vcode: {
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
            placeholder: '请输入验证码',
            onGetPhoneCode: this.onGetPhoneCode,
          },
        },
      },
    };
  }

  onGetPhoneCode(event) {
    // 倒计时运行中
    if (this.timerHandler) {
      return ;
    }
    let values = this.state.values;
    let phone = values['phone'] || '';
    if (!mobileNum(phone.trim())) {
      alert('请输入正确的手机号码');
      return ;
    }
    let target = event.target;
    this.onPhoneCode(this.state.values, (ok) => {
      if (ok) {
        this.startTimer(target);
      }
    });
  }

  onPhoneCode(values, cb) {
    sendSMSCode(values['phone'], '', (data) => {
      if (data.errorCode == RES_OK_CODE) {
          cb(true);
      } else {
        cb(false);
        alert(data.msg);
      }
    }, 3);
  }

  startTimer(btn) {
    
    let self = this;
    
    self.timerHandler = setInterval(() => {
      
      if (self.timerSecond < 1) {
        clearInterval(self.timerHandler);
        self.timerSecond = INTERVAL_SECOND;
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

  updatePhone(cb) {
    let values = this.state.values;
    const {history} = this.props;
    let phone = (values['phone'] || '').trim();
    let vcode = values['vcode'];
    if (!mobileNum(phone)) {
      alert('请输入正确的手机号码');
    } else if (vcode.length < 4) {
      alert('请输入正确的验证码');
    } else {
      bindMobilePhone( phone, vcode, (data) => {
        if (data.errorCode == RES_OK_CODE) {
          alert(data.msg, popup => {
            popup.close();
            history.goBack();
          });
        } else{
          alert(data.msg);
        }
      });
    }
  }

  render() {
    return (
      <div className="page page-set-phone">
        <Header {...this.props}>
          <Back />
          <h3>绑定手机号</h3>
        </Header>
        <div className="page-body">
          <div className="inner">
            <div className="form form-type2 form-type-fgp">
              
              <Form ref='form' options={this.options} onChange={ (values) => { this.setState( {values} ) } } type={schema} value={this.state.values} />
              
              <FormNotice msg="bdsj"></FormNotice>  

              <div className="btn-wrap">
                <button className="btn btn-orange" onClick={this.updatePhone}>确认绑定</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps(state) {
  const {app, userModule} = state;
  return {
    app,
    info: userModule.user.get('info'),
    userModule
  };
}

export default connect(mapStateToProps)(withRouter(SetPhoneContainer));