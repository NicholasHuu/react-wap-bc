import React , { Component , PropTypes } from "react";
import {connect} from "react-redux";

class BetCenterSureBtn extends Component {

  render() {
    return(
      <div {...this.props} className="bet-bottom-btn">
        <div onClick={this.props.onReset} className="cancel-btn"><span>重置</span></div>
        <div onClick={this.props.onSubmit} className="ok-btn"><span>确认注单</span></div>
      </div>
    )
  }
}

BetCenterSureBtn.defaultProps = {
  onReset: () => {},
  onSubmit: () => {},
};

BetCenterSureBtn.propTypes = {
  onReset: PropTypes.func,
  onSubmit: PropTypes.func
};

export default BetCenterSureBtn;

