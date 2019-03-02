import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import t from 'tcomb-form';

import ModifyAccountPsw from '../components/ModifyAccountPsw';
import ModifyMoneyPsw from '../components/ModifyMoneyPsw';
import Header from '../components/Header';
import Back from '../../../components/Back';
import {loadUserInfo, updateNickname, updateWithdrawProfile as updateWithdrawProfileAction} from '../actions/User';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import FormNotice from '../../../components/FormNotice';

const Form = t.form.Form;

const INTERVAL_SECOND = 60;

const schema = t.struct({
  withdrawPwd: t.String,
  withdrawPwd2: t.String,
  realName: t.String,
});

const options = {
  fields: {
    withdrawPwd: {
      label: '资金密码',
      type: 'password',
      attrs: {
        placeholder: '输入4位数字',
      },
    },
    withdrawPwd2: {
      label: '确认密码',
      type: 'password',
      attrs: {
        placeholder: '再次确认',
      },
    },
    realName: {
      label: '提款银行卡姓名',
      attrs: {
        placeholder: '请确保信息真实有效',
      },
    },
  },
};

class SetWithdrawProfileContainer extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      values: {
        
      },
    };

    this.updateWithdrawProfile = this.updateWithdrawProfile.bind(this);
  }

  componentDidMount() {
    const {userModule, history} = this.props;
    let hasWithdrawProfile = userModule.user.get('info').hasWithdrawProfile;
    if (hasWithdrawProfile) {
      history.goBack();
    }
  }

  updateWithdrawProfile() {
    const {history, dispatch} = this.props;
    let values = this.state.values;
    if (typeof values['withdrawPwd'] == 'undefined' || isNaN(values['withdrawPwd'] *1) || values['withdrawPwd'].length != 4 ) {
      alert('请输入4位数字作为资金密码');
      return ;
    } else if (values['withdrawPwd'] != values['withdrawPwd2']) {
      alert('两次输入的资金密码不一致');
      return ;
    } else if (typeof values['realName'] == 'undefined') {
      alert('请输入提款银行卡姓名');
    } else {
      if (this.processing) return ;
      this.processing = true;
      updateWithdrawProfileAction(values, data => {
        this.processing = false;
        if (data.errorCode == RES_OK_CODE) {

          dispatch(loadUserInfo(() => {
            alert(data.msg, popup => {
              popup.close();
              history.goBack();
            });
          }));

        } else {
          alert(data.msg);
        }
      });
    }
  }

  render() {
    return (
      <div className="page page-set-withdrawpwd">
        <Header {...this.props}>
          <Back />
          <h3>完善信息</h3>
        </Header>
        <div className="page-body">
          <div className="inner">
            <div className="form form-type2 form-type-fgp">

              <div className="banner">
                <img src="/misc/images/withdraw-profile-banner.png" alt=""/>
                <h2>设置您的资金密码</h2>
                <p>当涉及到提款、银行卡绑定操作时，需要资金密码验证确定是您本人进行操作</p>
              </div>
              
              <Form ref='form' options={options} onChange={ (values) => { this.setState( {values} ) } } type={schema} value={this.state.values} />
              
              <FormNotice msg="wszl"></FormNotice>

              <div className="btn-wrap">
                <button className="btn btn-orange" onClick={this.updateWithdrawProfile}>确认绑定</button>
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
    userModule
  };
}

export default connect(mapStateToProps)(withRouter(SetWithdrawProfileContainer));