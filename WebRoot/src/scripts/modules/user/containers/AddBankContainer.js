import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import Header from '../components/Header';
import Back from '../../../components/Back';
import BankBindForm from '../components/BankBindForm';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';

import {loadBankCodes, saveUserBankItem} from '../actions/UserWithdraw';

class AddBankContainer extends Component {

  constructor(props) {
    super(props);
    this.onBindCard = this.onBindCard.bind(this);
    this.onProcess = false;
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadBankCodes());
  }
  
  onBindCard(values) {
    if (this.onProcess) {
      return ;
    }
    const {dispatch, history} = this.props;
    if (!values) {
      alert('请填写银行卡资料');
      return false;
    } else if (values.bank == '') {
      alert('请选择收款银行');
      return false;
    } else if (values.accountNumber == '') {
      alert('请输入正确的银行卡号');
      return false;
    } else if (values.bankAddress == '') {
      alert('请输入开户行地址');
      return false;
    } else if (values.withdrawpwd == '') {
      alert('请输入资金密码');
      return false;
    } else if (!values.withdrawpwd.match(/\d{4}/g)){
      alert('请输入4位纯数字资金密码');
      return false;
    } else if (values.withdrawpwd.length > 4){
      alert('请输入4位纯数字资金密码');
      return false;
    } else {
      let _this = this;
      _this.onProcess = true;

      const {match,withdraw} = this.props;
      let bankName = match.params.bankName;
      let bankCodes = withdraw.get('bankCodes');
      console.log(bankCodes);
      let valuesBankCode = "";
      for(var i = 0;i < bankCodes.length; i++){
        if(bankCodes[i]['bankCnName'] == bankName){
          valuesBankCode = bankCodes[i]['bankCode'];
        }
      }
      dispatch(saveUserBankItem(
        valuesBankCode, 
        values.accountNumber, 
        values.bankAddress, 
        values.withdrawpwd, (data) => {
          _this.onProcess = false;
          alert(data.msg, popup => {
            popup.close();
            if (data.errorCode == RES_OK_CODE) {
              history.push('/user/bankcard');
            }
          });
        }));
    }
  }

  render() {
    const {match, withdraw, userModule} = this.props;
    let bankName = match.params.bankName;
    
    let bankCodes = withdraw.get('bankCodes');
    if(!bankCodes){
      return null
    }

    let banks = bankCodes.map(bankItem => {
      return { code: bankItem.bankCnName, name: bankItem.bankCnName};
    });

    return (
      <div className="addbank-page page">
        <div className="inner">
          <Header {...this.props}>
            <Back  backTo={'/user/bankcard'} />
            <h3>绑定银行卡</h3>
          </Header>
          <div className="page-body">
            <BankBindForm bankName={bankName} realName={userModule.user.get('info').userRealName} banks={banks} onBindCard={this.onBindCard}/>
          </div>
        </div>
      </div>
    );
  }
};

AddBankContainer.propTypes = {
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {userModule, app, withdraw: userModule.withdraw};
}

export default connect(mapStateToProps)(withRouter(AddBankContainer));