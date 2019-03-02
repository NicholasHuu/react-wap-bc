import React, {Component, PropTypes} from 'react';


class LotteryTraceItem extends Component {

  constructor(props) {
    super(props);
  
    this.onClickHandle = this.onClickHandle.bind(this);
  }

  onClickHandle() {
    const {history, traceItem} = this.props;
    history.push(`/user/tracehistory/${traceItem.ordreId}/${traceItem.orderNumber}`);
  }
  
  render() {
    const {history, traceItem} = this.props;
    return (
      <div className="lottery-trace-item" onClick={this.onClickHandle}>
        <div className="wrap">
          <h3>{traceItem.lotteryName}({traceItem.gameName})</h3>
          <div className="summary">
            <div className="si">
              <span>已追金额: </span>
              <span>{traceItem.traceMoney}</span>
            </div>
            <div className="si">
              <span>累计中奖:</span>
              <span>{traceItem.betWinMoney}</span>
            </div>
          </div>
          <div className="status">
            <span>{traceItem.traceCountRate}</span>
            <span className={ ({true: 'active'})[traceItem.statusValue == 1] }>{traceItem.status}</span>
          </div>
        </div>
      </div>
    );
  }

};

LotteryTraceItem.propTypes = {
  traceItem: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

LotteryTraceItem.defaultProps = {

};

export default LotteryTraceItem;