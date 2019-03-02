import React, {Component, PropTypes} from 'react';

class OrderListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMoreContent: false
    };
    this.onShowMoreContent = this.onShowMoreContent.bind(this);
  }
  componentWillReceiveProps(){
    this.state.showMoreContent = false
  }
  onShowMoreContent() {
    const {history, match, item} = this.props;

    history.push(`/user/order/${match.params.type}/${item.betWagersId}`);
  }

  render() {
    const {item} = this.props;
    var betUsrWin = parseFloat(item.betUsrWin);
    betUsrWin = betUsrWin.toFixed(2);
    var betGameContent = item.betContent;
    return (
      <div className="order-item" onClick={this.onShowMoreContent}>
        <div className="wrap">
          <div className="left">
            <h3>{item.betContent}</h3>
            <h4>{item.betTime}</h4>
          </div>
          <div className="right">
            <h3 className={ ({true: 'green', false: 'red'})[item.betUsrWin*1 > 0] }>{item.betUsrWin}</h3>
            <h4>盈亏</h4>
          </div>
        </div>
      </div>
    );
  }
};

OrderListItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default OrderListItem;