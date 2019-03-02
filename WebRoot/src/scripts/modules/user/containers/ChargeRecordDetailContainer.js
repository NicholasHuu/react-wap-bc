import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../../../components/Back';

class ChargeRecordDetailContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {chargeRecord, history} = this.props;
    console.log(['chargeRecord', chargeRecord]);
    if (!chargeRecord || Object.keys(chargeRecord).length <= 0) {
      return history.goBack();
    }
  }

  render() {
    const {chargeRecord} = this.props;
    
    if (!chargeRecord || Object.keys(chargeRecord).length <= 0) {
      return null;
    } 

    return ( <div className="page page-charge-record-detail">
      
      <Header {...this.props}>
        <Back />
        <h3>充值详情</h3>
      </Header>
      <div className="page-body">
      
        <ul>
          <li className="summary">
            <label className="color-lblack">充值金额</label>
            <span className="color-orange">{chargeRecord.hkMoney}</span>
          </li>
          <li>
            <label>充值类型</label>
            <span>{chargeRecord.hkType}</span>
          </li>
          <li>
            <label>订单时间</label>
            <span>{chargeRecord.createTime}</span>
          </li>
          <li>
            <label>状态</label>
            <span>{chargeRecord.statusDes}</span>
          </li>
          <li>
            <label>备注</label>
            <span>{chargeRecord.remark}</span>
          </li>
          <li>
            <label>订单号</label>
            <span>{chargeRecord.hkOrder}</span>
          </li>
        </ul>

      </div>

    </div> );

  }
  
}

function mapStateToProps(state) {
  const {userModule} = state;
  const {app} = state;
  return {
    chargeRecord: userModule.chargeRecord.get('crtRecordDetail'),
    userModule,
    app
  };
}

export default connect(mapStateToProps)(withRouter(ChargeRecordDetailContainer));