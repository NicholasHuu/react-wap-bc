import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import BankItems from '../components/BankItems';
import Header from '../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';
import FormNotice from '../../../components/FormNotice';

import {loadUserBankItems,loadBankCodes} from '../actions/UserWithdraw';

class WithdrawContainer extends LoadingComponent {
  
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadUserBankItems());
    dispatch(loadBankCodes());
  }

  componentDidMount() {
    let info = this.props.userModule.user.get('info');
    if (!info.hasWithdrawProfile) {
      this.props.history.push(`/user/setWithdraw`);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }
  
  handleClick(item){
    let bankId = item.id;
    window.location.href = "/#/user/withdraw/form/"+ bankId;
  }

  render() {

    const {match, userModule, withdraw} = this.props;
    let bankItems = withdraw.get('userBankItems');
    let bankCodes = withdraw.get('bankCodes');
    let defaultBank = null;
    if(bankCodes.length){
      defaultBank = bankCodes[0].bankCnName;
    }
    let _this = this;

    return (
      <div className="withdraw-page page">
        <div className="inner">
          <Header {...this.props}>
            <Back to={'/user'} />
            <h3>提现</h3>
          </Header>
          <div className="page-body">
            {bankItems.length <= 0 ? <p className="waring">您还没有绑定银行卡</p>: <BankItems onClick={_this.handleClick} bankLists={bankItems} /> }
          </div>

          { false  && <FormNotice msg="bank"></FormNotice> }

            {bankItems.length < 5 ?
              <Link className="link link-add-bank" to={match.path + "/addbankcard/"+defaultBank}>添加</Link> 
              : ""
            }
        </div>
      </div>
    );
  }
};

WithdrawContainer.propTypes = {
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    withdraw: userModule.withdraw,
    app
  };
}

export default connect(mapStateToProps)(withRouter(WithdrawContainer));