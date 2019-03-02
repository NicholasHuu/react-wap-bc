import React, {PropTypes, Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../../../components/Back';
import {getBankList} from '../actions/User';
import LoadingComponent from '../../../components/LoadingComponent';

class BankListContainer extends LoadingComponent {

  constructor(props){
    super(props);
    this.getBankName = this.getBankName.bind(this);
  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(getBankList());
  }

  getBankName(bankName){
    const {params} = this.props.match;
    const {history} = this.props;
    let id = params.id;
    if(params.type == "add") {
      history.replace("/user/withdraw/addbankcard/"+bankName);
    }else{
      history.replace("/user/bankdetail/"+id+"/"+bankName);
    }
    
  }

  componentWillReceiveProps(){
    this.closeLoading();
  }

  render() {
    const {path} = this.props.match;
    const {user} = this.props.userModule;
    let list = user.get('bankLists');
    let _this = this;
    return (
      <div className="page page-bank-lists">
        <div>
          <Header {...this.props}>
            <Back />
            <h3>银行信息</h3>
          </Header>
          <div className="page-body">
            <div className="gray-space"></div>
            <div className="bank-lists">
              <ul>
                {list.map(function(item,index){
                  let bankName = item.bankCnName;   
                  console.log(item);             
                  return <li key={index} onClick={_this.getBankName.bind(this,bankName)}>
                    <div><i><img src={item.smallPicUrl} alt="" /></i><span>{item.bankCnName}</span></div>
                  </li>
                })}
              </ul>
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
    app
  }
}

export default connect(mapStateToProps)(withRouter(BankListContainer));

