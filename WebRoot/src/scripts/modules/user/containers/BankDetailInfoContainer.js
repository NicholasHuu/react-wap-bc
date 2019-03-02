import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import Header from '../components/Header';
import Back from '../../../components/Back';
import {relieveBank,modifyBankInfo} from '../actions/User';
import LoadingComponent from '../../../components/LoadingComponent';
import {RES_OK_CODE, RES_BLOCKED_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';
import {loadBankCodes} from '../actions/UserWithdraw';

class BankDetailInfoContainer extends LoadingComponent {
  constructor(props){
    super(props);
    this.changeBankCard = this.changeBankCard.bind(this);
    this.changeBankAddress = this.changeBankAddress.bind(this);
    const {match} = this.props;
    let currentId = match.params.id;
    const {withdraw} = this.props.userModule;
    let info = withdraw.get('userBankItems');
    let bankCnName,bankCard,bankAddress;
    for(var i in info){
      if(info[i].id == currentId){
        bankCnName = info[i].bankCnName;
        bankCard = info[i].bankCard;
        bankAddress = info[i].bankAddress;
      }
    }
    this.state = {
      bankCnName: bankCnName,
      //bankCard: bankCard,
      bankAddress: bankAddress,
    }
  }
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadBankCodes());
  }
  componentDidMount(){
    this.closeLoading();
  }
  
  relieveBank(id){
    const {dispatch,history} = this.props;
    let password = this.refs.password.value;
    if(!password.match(/^\d{4}$/)){
      alert('请输入正确的资金密码'); 
    }else{
      if (confirm("确认解绑?")) {
        if (this.process) return;
        this.process = true;
        dispatch(relieveBank(id,password, data => {
          this.process = false;
          if (data.errorCode != RES_OK_CODE) {
            alert(data.msg);
          } else {
            alert(data.msg,(popup) => {
              popup.close();
              setTimeout(function(){
                history.push('/user/bankcard');
              },600)
            });
          }
        }));
      }
      
    }
  }

  modifyBankInfo(id,bankType){
    const {dispatch,history} = this.props;
    let bankCard = this.refs.bankCard.value;
    let bankAddress = this.refs.bankAddress.value;
    let withdrawPwd = this.refs.password.value;

    // if (bankCard.length <= 0 ) {
    //   alert('请输入正确的银行卡号');
    // } 
    // else
    if (bankAddress.length <= 0 ) {
      alert('请输入开户地址');
    } else if (!withdrawPwd.match(/^\d{4}$/) ) {
      alert('请输入正确的资金密码');
    } else{
      if (confirm("确认修改?")) {
        if (this.process) return;
        this.process = true;
        dispatch(modifyBankInfo(id,bankCard,bankAddress,withdrawPwd,bankType, data => {
          this.process = false;
          if (data.errorCode != RES_OK_CODE) {
            alert(data.msg);
          } else {
            console.log("come in");
            alert('修改成功',(popup) => {
              popup.close();
              setTimeout(function(){
                history.push('/user/bankcard');
              },600);
            });
          }
        }));
      }
    }

  }

  changeBankCard(){
    this.setState({
      bankCard : this.refs.bankCard.value
    })
  }
  changeBankAddress(){
    this.setState({
      bankAddress : this.refs.bankAddress.value
    })
  }

  bankList(id){
    let type = "modify";
    window.location.href = "/#/user/banklist/"+ type +"/"+ id;
  }

  render() {
    const {match} = this.props;
    const {withdraw} = this.props.userModule;
    let info = withdraw.get('userBankItems');
    let bankCodes = withdraw.get('bankCodes');
    let code = "";
    for(var i = 0;i < bankCodes.length; i++){
      if(match.params.bankName == bankCodes[i]['bankCnName']){
        code = bankCodes[i]['bankCode'];
      }
    }
    let currentId = match.params.id;
    if(!info.length){
      return null;
    }
    let bankCnName = this.props.match.params.bankName;
    for(var i in info){
      if(info[i].id == currentId){
        let id = info[i].id;
        let bankType = info[i].bankType;
        return (
          <div className="page bank-detail-page">
            <div>
              <Header {...this.props}>
                <Back backTo={'/user/bankcard'} />
                <h3>银行卡信息</h3>
              </Header>
              <div className="page-body">
                <div className="inner">
                  <div className="item">
                    <div><span>收款银行:</span><span onClick={this.bankList.bind(this,id)} className="word-right">{bankCnName}</span></div>
                  </div>
                  <div className="item">
                    <div><span>银行卡号:</span><input  className="word-right" onChange={this.changeBankCard} value={this.state.bankCard} ref="bankCard" type="text" /></div>
                  </div>
                  <div className="item clearfix">
                    <div><span>开户地址:</span><input className="word-right" onChange={this.changeBankAddress} value={this.state.bankAddress} ref="bankAddress" type="text" /></div>
                  </div>

                  <div className="item clearfix">
                    <div><span>资金密码:</span><input className="word-right" placeholder="请输入资金密码" ref="password" type="password" /></div>
                  </div>

                  <div className="operation-btn"><span onClick={this.relieveBank.bind(this,id)}>解绑</span><span onClick={this.modifyBankInfo.bind(this,id,code)}>修改</span></div>
                </div>


              </div>
            </div>
          </div>
        )
      }
    }
  }
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  };
}
export default connect(mapStateToProps)(withRouter(BankDetailInfoContainer));