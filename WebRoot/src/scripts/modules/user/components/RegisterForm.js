import React, { Component, PropTypes } from "react";

import t from "tcomb-form";
import * as validate from "../utils/validate";
import { alert } from "../../../utils/popup";
import FormNotice from "../../../components/FormNotice";

const UserName = t.refinement(t.String, name => {
  return validate.name(name);
});

const Password = t.refinement(t.String, pwd => {
  return validate.password(pwd);
});

const MobileNum = t.refinement(t.String, num => {
  return validate.mobileNum(num);
});

const WithdrawPwd = t.refinement(t.Number, num => {
  return validate.withdrawalPwd(num);
});

const schema = t.struct({
  account: UserName,
  password: Password,
  password2: Password,
  code: t.String
  // "realName": t.String,
  // "userMobile": MobileNum,
  // 'userQq': t.maybe(t.String),
  // 'withdrawPwd': WithdrawPwd,
  // "userAgent": t.maybe(t.String)
});

const focus = event => {
  let fieldGroup = event.currentTarget.parentNode;
  fieldGroup.className += " focus";
};

const blur = event => {
  let fieldGroup = event.currentTarget.parentNode;
  fieldGroup.className = fieldGroup.className.replace("focus", "");
};

const Form = t.form.Form;
const options = {
  fields: {
    account: {
      label: "帐号",
      attrs: {
        placeholder: "4-16位数字/字母或组合",
        onFocus: focus,
        onBlur: blur
      }
    },
    password: {
      label: "密码",
      type: "password",
      attrs: {
        placeholder: "6-16位数字/字母或组合",
        onFocus: focus,
        onBlur: blur
      }
    },
    password2: {
      label: "确认密码",
      type: "password",
      attrs: {
        placeholder: "再次输入密码",
        onFocus: focus,
        onBlur: blur
      }
    },
    realName: {
      label: "真实姓名",
      attrs: {
        placeholder: "姓名要与绑定的银行卡开户姓名一致",
        onFocus: focus,
        onBlur: blur
      }
    },
    userMobile: {
      label: "手机号码",
      type: "number",
      attrs: {
        placeholder: "真实号码，修改帐号资料时用到",
        onFocus: focus,
        onBlur: blur,
        onKeyDown: event => {
          let input = event.target;
          var key = event.keyCode || event.charCode;
          if (key == 8 || key == 46) {
            return;
          }
          if (input.value.trim().length > 10) {
            event.preventDefault();
          }
        }
      }
    },
    userQq: {
      label: "QQ",
      type: "number",
      attrs: {
        placeholder: "请输入QQ号码",
        onFocus: focus,
        onBlur: blur
      }
    },
    withdrawPwd: {
      label: "资金密码",
      type: "password",
      attrs: {
        onKeyDown: event => {
          let input = event.target;
          var key = event.keyCode || event.charCode;
          if (key == 8 || key == 46) {
            return;
          }
          if (input.value.trim().length > 4) {
            event.preventDefault();
          }
        },
        placeholder: "请输入4位数字",
        onFocus: focus,
        maxLength: 4,
        onBlur: blur
      }
    },
    userAgent: {
      label: "介",
      attrs: {
        placeholder: "",
        onFocus: focus,
        onBlur: blur
      }
    },
    code: {
      label: "邀请码",
      attrs: {
        placeholder: "请输入邀请码",
        onFocus: focus,
        onBlur: blur
      }
    }
  }
};

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.values = {
      account: "",
      password: "",
      password2: "",
      code: ""
      // userAgent: this.props.agent,
      // realName: '',
      // userMobile: '',
      // userQq: '',
      // withdrawPwd: ''
    };
  }

  onSubmit() {
    if (this.props.onEnable) {
      this.props.onRegister(this.values, this.refs.form);
    } else {
      //
    }
  }

  onChange(value, path) {
    this.values = Object.assign(this.values, value);
    this.props.onChange(value, path, this.refs.form);
  }

  render() {
    return (
      <div className="register-form">
        <div className="form">
          <div className="inner">
            <Form
              onChange={this.onChange}
              value={this.values}
              options={options}
              type={schema}
              ref="form"
            />
            <div className="tips">
              <FormNotice msg="register" />
            </div>
            <div className="btn-wrap">
              <button
                onClick={this.onSubmit}
                className={
                  "btn btn-submit btn-light-blue " +
                  (this.props.onEnable ? "" : "btn-disabled")
                }
              >
                注册
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegisterForm.defaultProps = {
  onRegister: () => {},
  onChange: () => {},
  onEnable: true
};

RegisterForm.propTypes = {
  onRegister: PropTypes.func,
  onChange: PropTypes.func,
  onEnable: PropTypes.bool
};

export default RegisterForm;
