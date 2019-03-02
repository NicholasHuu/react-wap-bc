import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../../../components/Back';

class WithdrawLogDetailContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {withdrawLog, history} = this.props;

    if (!withdrawLog || Object.keys(withdrawLog).length <= 0) {
      return history.goBack();
    }
  }

  render() {
    const {withdrawLog} = this.props;
    
    if (!withdrawLog || Object.keys(withdrawLog).length <= 0) {
      return null;
    } 

    let statusText = () => {
      if (withdrawLog.status == 1) {
        if (withdrawLog.checkStatus ==2 ) {
          return '审核不通过';
        } else if (withdrawLog.checkStatus == 1) {
          return '审核通过';
        }
      } else if (withdrawLog.status == 0) {
        return '审核中';
      }
    };

    return ( <div className="page page-charge-record-detail">
      
      <Header {...this.props}>
        <Back />
        <h3>提现详情</h3>
      </Header>
      <div className="page-body">
      
        <ul>
          <li className="summary">
            <label className="color-lblack">提现金额</label>
            <span className="color-orange">{withdrawLog.userWithdrawMoney}</span>
          </li>
          <li>
            <label>提现类型</label>
            <span>{withdrawLog.withdrawTypeDes}</span>
          </li>
          <li>
            <label>审核时间</label>
            <span>{withdrawLog.checkTime}</span>
          </li>
          <li>
            <label>状态</label>
            <span>{withdrawLog.checkStatusDes}({withdrawLog.statusDes})</span>
          </li>
          <li>
            <label>出款金额</label>
            <span>{withdrawLog.userWithdrawRealMoney}</span>
          </li>
          <li>
            <label>备注</label>
            <span>{withdrawLog.remark}</span>
          </li>
          <li>
            <label>订单号</label>
            <span>{withdrawLog.userOrder}</span>
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
    withdrawLog: userModule.withdraw.get('crtWithdrawLog'),
    userModule,
    app
  };
}

export default connect(mapStateToProps)(withRouter(WithdrawLogDetailContainer));