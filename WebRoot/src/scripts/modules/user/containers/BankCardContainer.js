import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import BankItems from '../components/BankItems';
import Header from '../components/Header';
import Back from '../../../components/Back';
import PTR from '../../../utils/pulltorefresh';

import FormNotice from '../../../components/FormNotice';

import {loadUserBankItems,loadBankCodes} from '../actions/UserWithdraw';

class BankCardContainer extends Component {
  
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadUserBankItems());
    dispatch(loadBankCodes());
  }
  
  handleClick(item){
    console.log(item);
    let bankId = item.id;
    let bankCnName = item.bankCnName;
    window.location.href = "/#/user/bankdetail/"+ bankId+"/"+bankCnName;
  }

  componentDidMount() {
    const {history, userModule} = this.props;
    let has = userModule.user.get('info').hasWithdrawProfile;
    if (!has) {
      history.push('/user/setWithdraw');
    }
  }

  setupPullToRefresh(destroy = false) {
      const {dispatch} = this.props;

      PTR.destroyAll();
      if (destroy) {
        return ;
      }
      PTR({
        mainElement: '.bank-items',
        refreshHandler({close, handler}) {
          dispatch(loadUserBankItems(() => {
            close();
          }));
        }
      });
    }

    componentDidUpdate() {
      this.setupPullToRefresh();
    }

    componentWillUnmount() {
      this.setupPullToRefresh(true);
    }
  
  render() {

    const {match, userModule, withdraw} = this.props;
    let bankItems = withdraw.get('userBankItems');
    let _this = this;
    let bankCodes = withdraw.get('bankCodes');
    let defaultBank = null;
    if (bankCodes.length) {
      defaultBank = bankCodes[0].bankCnName;  
    }
    
    return (
      <div className="withdraw-page page">
        <div className="inner">
          <Header {...this.props}>
            <Back to={"/user"}/>
            <h3>银行卡管理</h3>
          </Header>
          <div className="page-body">
            {bankItems.length <= 0 ? <div className="bank-items"><p className="waring">您还没有绑定银行卡</p></div> :<BankItems onClick={_this.handleClick} bankLists={bankItems} /> }
          </div>
          <br />

          {bankItems.length < 5 ?
            <Link className="link link-add-bank" to={"/user/withdraw/addbankcard/"+defaultBank}>
            添加</Link>
            : ""
          }

          
        </div>
      </div>
    );
  }
};



function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    withdraw: userModule.withdraw,
    app
  };
}

export default connect(mapStateToProps)(withRouter(BankCardContainer));