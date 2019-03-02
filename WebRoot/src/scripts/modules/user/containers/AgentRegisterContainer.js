import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import AgentRegisterForm from '../components/AgentRegisterForm';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';

import {alert} from '../../../utils/popup';
import {name, password} from '../utils/validate';
import {parseQuery} from '../../../utils/url';
import {registerWithAgentCode} from '../actions/User';
import {RES_OK_CODE} from '../../../constants/AppConstant';

class AgentRegisterContainer extends Component {

  constructor(props) {
    super(props);

    this.query = {};

    this.state = {
      imageCodeTime: new Date().getTime()
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentWillMount() {
    bodyClass('agent-register-body');
    console.log('设置body class');
    const {match, location} = this.props;
    this.query = parseQuery(location.search);
  }

  componentWillUnmount() {
    resetBodyClass();
    console.log('重置body class');
  }

  onFormSubmit(values) {
    const {history} = this.props;
    if (!!!values.account) {
      alert('请输入4-16位数字/字母或组合作为帐号');
    } else if ( name(values.account)  == false) {
      alert('请输入4-16位数字/字母或组合作为帐号');
    } else if (!!!values.password) {
      alert('请输入6-16位数字/字母或组合作为密码');
    } else if ( password(values.password) == false ) {
      alert('请输入6-16位数字/字母或组合作为密码');
    } else if (!!!values.cfmPassword || values.cfmPassword != values.password) {
      alert('两次密码输入不一致');
    } else if (!!!values.yzm) {
      alert('请输入验证码');
    } else {
      if (!!!this.query.code) {
        alert('未找到代理编号, 注册失败');
      } else {
        values.code = this.query.code;
        registerWithAgentCode({
          account: values.account,
          password: values.password,
          yzm: values.yzm,
          code: values.code
        }, data => {
          this.setState({
            imageCodeTime: new Date().getTime()
          });
          if (data.errorCode == RES_OK_CODE) {
            alert(data.msg, (popup) => {
              
              popup.close();
              history.replace('/login');

            });
          } else {
            alert(data.msg);
          }
        });
      }
    }
  }

  render() {
    return (
      <div className="page login-page page-agent-register">
        
        <div className="wrapper">
          
          <div className="form-wrapper">

            <img src="/misc/images/img-header.png" className="img-header"/>

            <div className="inner">
              <h3>用户注册</h3>
              <AgentRegisterForm imageCodeState={this.state.imageCodeTime} onSubmit={this.onFormSubmit} />
            </div>

          </div>

        </div>

      </div>
    );
  }

};

export default connect()(withRouter(AgentRegisterContainer));