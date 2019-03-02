import React, {Component, PropTypes} from 'react';

import {format, DateFromString} from '../../../utils/datetime';
import {CHARGE_STATUS_EXAMINE, CHARGE_STATUS_SUCCESS, CHARGE_STATUS_FAILED} from '../constants/ChargeConstant';
class WithdrawRecordItem extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      viewContent: false,
    };
  }

  render() {
    const {item} = this.props;
    const status = this.props.status;

    return ( 
      <div className="charge-record-item" onClick={this.props.onClick}>
        <div className="title clearfix">
          <div className={'status-progress ' + status}></div>
          <div className="left">
            <p className="order-shop">{item.withdrawTypeDes}</p>
            <p className="order-number"><span>{item.createTime}</span></p>
          </div>
          <div className="right">
            <p className="time color-orange">{item.userWithdrawMoney}</p>
            <p className="day">{item.checkStatusDes}({ item.statusDes })</p>
          </div>
          <div className="arrow"></div>
        </div>
      </div> );
  }
};

WithdrawRecordItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default WithdrawRecordItem;