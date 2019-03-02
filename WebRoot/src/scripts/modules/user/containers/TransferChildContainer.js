import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {alert} from '../../../utils/popup';
import {teamMemberTransfer} from '../actions/UserOrder';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import t from 'tcomb-form';

const schema = t.struct({
  account: t.String,
  money: t.String,
  zjPassword: t.String,
  remark: t.maybe(t.String),
});

const options = {
  fields: {
    account: {
      label: '转账用户',
      attrs: {
        readOnly: 'readonly',
      },
    },
    money: {
      label: '转账金额',
      attrs: {
        placeholder: '输入转账金额',
      },
    },
    zjPassword: {
      label: '资金密码',
      type: 'password',
      attrs: {
        placeholder: '输入资金密码',
      },
    },
    remark: {
      label: '备注',
      attrs: {
        placeholder: '输入备注内容',
      },
    },
  },
};

const Form = t.form.Form

class TransferChildContainer extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      values: {
        account: '',
      },
      item: null
    };
    
    this.onFormChange = this.onFormChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  componentDidMount() {

    let info = this.props.userModule.user.get('info');
    if (!info.hasWithdrawProfile) {
      this.props.history.push(`/user/setWithdraw`);
    }

    const {match, history, teamAgent, teamAccount} = this.props;
    let id = match.params.id;
    let item = teamAgent.items.filter(item => item.id == id);
    if (item.length <= 0 ) {
      item = teamAccount.items.filter(item => item.id == id);
    }
    item = item[0];
    if (!item) {
      return history.goBack();
    }
    this.setState({
      item,
      values: {
        account: item.userName,
      },
    });
  }

  onFormChange(values) {
    this.setState({
      values
    });
  }

  onSubmit() {
    let values = this.state.values;
    if ( isNaN(values.money*1) ) {
      alert('请输入正确的金额');
    } else if (values.money.length <= 0) {
      alert('请输入转账金额');
    } else if (values.money <= 0) {
      alert('请输入有效金额');
    } else if (values.zjPassword.trim().length <= 0) {
      alert('请输入资金密码');
    } else {
      const {history} = this.props;
      if (this.process) return;
      this.process = true;
      teamMemberTransfer(values, data => {
        this.process = false;
        if (data.errorCode == RES_OK_CODE) {
          alert('转账成功', popup => {
            popup.close();
            history.goBack();
          });
        } else {
          alert(data.msg);
        }
      });
    }
  }

  render() {
    const {item} = this.state;
    if (!item) return null;
    return (
      <div className="page page-transfer-child">
      
        <Header {...this.props}>
          <Back />
          <h3>下级转账</h3>
        </Header>

        <div className="page-body">
          <div className="transfer-child-form form-type2">
            <div className="wrap">
              <Form options={options} type={schema} ref={"form"} onChange={this.onFormChange} value={this.state.values}></Form>
              <button onClick={this.onSubmit} className="btn btn-orange">确认</button>
            </div>
          </div>

        </div>

      </div>
    );
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    teamAgent: userModule.order.get('teamMemberOfAgent'),
    teamAccount: userModule.order.get('teamMemberOfAccount'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(TransferChildContainer));