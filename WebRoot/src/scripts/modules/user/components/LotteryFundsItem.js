import React, {Component, PropTypes} from 'react';

class LotteryFundsItem extends Component {
  
  constructor(props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick() {
    const {item} = this.props;
    this.props.onClick(item);
  }

  render() {
    const {item} = this.props;
    return (
      <div className="lottery-funds-item" onClick={this.onItemClick}>
        <div className="wrap">
          <div className="left">
            <h3>{item.userName}</h3>
            <h4>{item.lotteryName}({item.gameName})</h4>
          </div>
          <div className="right">
            <h3 className={ ({true: 'red', false: 'green'})[item.changeMoney*1 <= 0] }>{item.changeMoney}</h3>
            <h4>{item.changeType}</h4>
          </div>
        </div>
      </div>
    );
  }

};

LotteryFundsItem.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func
};

LotteryFundsItem.defaultProps = {
  item: {},
  onClick: () => {}
};

export default LotteryFundsItem;