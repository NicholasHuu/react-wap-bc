import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import t from 'tcomb-form';

import ModifyAccountPsw from '../components/ModifyAccountPsw';
import ModifyMoneyPsw from '../components/ModifyMoneyPsw';
import Header from '../components/Header';
import Back from '../../../components/Back';
import {loadUserInfo, updateUserInfo} from '../actions/User';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';

const Form = t.form.Form;
const options = {
  fields: {
    qq: {
      label: 'QQ',
      attrs: {
        placeholder: '请输入您的联系QQ',
      },
    },
  },
};

let schema = t.struct({
  qq: t.String,
  //nickname: t.String
});

class SetQQContainer extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      values: {
        qq: props.info.qq,
      },
    };
    

    this.updateQQ = this.updateQQ.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadUserInfo());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      values: {
        qq: nextProps.info.qq,
      },
    });

  }

  updateQQ() {
    const {history} = this.props;
    let values = this.state.values;
    let qq = values.qq || '';
    if (qq.trim().length <= 4 || isNaN(qq*1) ) {
      alert('请输入正确的QQ号码');
    } else {
      updateUserInfo({qq}, data => {
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
          <h3>设置QQ</h3>
        </Header>
        <div className="page-body">
          <div className="inner">
            <div className="form form-type2">
              
              <Form ref='form' options={options} onChange={ (values) => { this.setState( {values} ) } } type={schema} value={this.state.values} />
                
              <div className="btn-wrap">
                <button className="btn btn-orange" onClick={this.updateQQ}>{ this.props.info.nickName ? '确认修改': '确认' }</button>
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

export default connect(mapStateToProps)(withRouter(SetQQContainer));