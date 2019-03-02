import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import t from 'tcomb-form';

import ModifyAccountPsw from '../components/ModifyAccountPsw';
import ModifyMoneyPsw from '../components/ModifyMoneyPsw';
import Header from '../components/Header';
import Back from '../../../components/Back';
import {loadUserInfo, updateNickname} from '../actions/User';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';

const Form = t.form.Form;
const options = {
  fields: {
    oldnick: {
      label: '昵称',
      attrs: {
        readOnly: 'readonly',
      },
    },
    nickname: {
      label: '昵称',
      attrs: {
        placeholder: '请输入昵称',
      },
    },
  },
};

let schema = t.struct({
  oldnick: t.String,
  nickname: t.String
});

class NicknameContainer extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      values: {
        oldnick: props.info.nickName,
      },
    };
    
    this.disableOldNickname(props);

    this.updateNickname = this.updateNickname.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadUserInfo());
  }

  disableOldNickname(props) {
    // 设置新昵称情况下 不需要输入旧昵称
    if (!props.info.nickName) {
      schema = t.struct({
        nickname: t.String
      });
    } else {
      schema = t.struct({
        oldnick: t.String,
        nickname: t.String
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      values: {
        oldnick: nextProps.info.nickName,
      },
    });
    this.disableOldNickname(nextProps);

  }

  updateNickname() {
    const {history} = this.props;
    let values = this.state.values;
    if (values.nickname.trim().length <= 0 || values.nickname.trim().length > 10) {
      alert('请输入正确的昵称(10个字符内)');
    } else {
      updateNickname(values.nickname, data => {
        if (data.errorCode == RES_OK_CODE) {
          alert('设置成功');
          const {dispatch} = this.props;
          dispatch(loadUserInfo(() => {
            history.goBack();
          }));
          
        } else {
          alert(data.msg);
        }
      });
    }
  }

  render() {
    return (
      <div className="page page-nickname">
        <Header {...this.props}>
          <Back backTo={'/user/info'}/>
          <h3>设置昵称</h3>
        </Header>
        <div className="page-body">
          <div className="inner">
            <div className="form form-type2">
              
              <Form ref='form' options={options} onChange={ (values) => { this.setState( {values} ) } } type={schema} value={this.state.values} />
                
              <div className="btn-wrap">
                <button className="btn btn-orange" onClick={this.updateNickname}>{ this.props.info.nickName ? '确认修改': '确认' }</button>
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

export default connect(mapStateToProps)(withRouter(NicknameContainer));