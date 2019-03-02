import React, {Component, PropTypes} from 'react';

class BankInfo extends Component {
  render() {
    const {bank} = this.props;    
    return (
      <div className="bank-info border0">
        <div className="inner">
          <h2>银行卡信息</h2>
          <ul className="clearfix">
            <li><span className="label">收款银行：</span><span className="cont">{bank.bankCnName}</span></li>
            <li><span className="label">银行户名：</span><span className="cont">{bank.userRealName}</span></li>
            <li><span className="label">银行卡号：</span><span className="cont">{bank.bankCard}</span></li>
            <li><span className="label">开户地址：</span><span className="cont">{bank.bankAddress}</span></li>
          </ul>
        </div>
      </div>
    );
  }
};

BankInfo.defaultProps = {
  bank: {}
};

BankInfo.propTypes = {
  bank: PropTypes.object
};

export default BankInfo;