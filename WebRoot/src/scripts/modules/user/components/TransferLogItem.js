import React, {Component, PropTypes} from 'react';
import {CHARGE_STATUS_EXAMINE, CHARGE_STATUS_SUCCESS, CHARGE_STATUS_FAILED} from '../constants/ChargeConstant';
class TransferLogItem extends Component {
  
  constructor(props) {
    super(props);
    this.viewContent = this.viewContent.bind(this);
    this.state = {
      viewContent: false
    };
  }
  
  componentWillReceiveProps(){
    this.state.viewContent = false
  }
  viewContent() {
    this.setState({
      viewContent: !this.state.viewContent
    });
  }

  render() {
    const {item} = this.props;
    const status = this.props.status;
    let str = item.remark;
    return (
      <div className="transfer-log-item normal-log-item order-info-list">
        <div className="charge-record-item" onClick={this.viewContent}>
          <div className={"status-progress "+status}></div>
          <div className="title clearfix">
            <div className="left">
              <p className="order-shop">{str} </p>
              <p className="order-number">{item.enduTime}</p>
            </div>
            <div className="right">
              <p className="time color-orange">{( item.eduMoney * 1).toFixed(2)}</p>
              <p className="day">{item.status}</p>
            </div>
            <div className="arrow"></div>
          </div>
        </div>
      </div>
    );
  }
};

TransferLogItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default TransferLogItem;