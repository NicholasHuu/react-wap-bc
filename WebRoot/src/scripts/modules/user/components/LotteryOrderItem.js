import React, {Component, PropTypes} from 'react';
import moment from 'moment';

const STATUS_COLORES = {
  
};

class LotteryOrderItem extends Component {

  constructor(props) {
    super(props);

  }

  onItemClick(item) {
    let path = `/user/lotteryorder/${item.id}`;
    const {history} = this.props;
    history.push(path);
  }
  
  render() {
  
    const {orderItem} = this.props;
    let d = moment(orderItem.betTime);

    return (
      <div className="lottery-order-item v2" onClick={this.onItemClick.bind(this, orderItem)}>
        <div className="wrapper">
          <div className="date">
            <span>{ d.format('MM/DD') }</span>
            <span>{ d.format('HH:mm') } </span>
          </div>
          <div className="detail">
            <h4>
              <span>{orderItem.lotteryName}</span>
              <span>{orderItem.gameName}</span>
              <span>{orderItem.betQishu}</span>
            </h4>
            <h5>
              <span>{orderItem.betMoney}</span>
              <span className={ ({true: 'red'})[orderItem.statusValue == 2] }>{orderItem.statusValue == 2 ? orderItem.winMoney: '' }</span>
              <span className={ ({true: 'red'})[orderItem.statusValue == 2] }>{orderItem.status}</span>
            </h5>
          </div>
        </div>
      </div>
    );
  }

};

LotteryOrderItem.propTypes = {
  orderItem: PropTypes.object,
  history: PropTypes.object.isRequired,
};

LotteryOrderItem.defaultProps = {
  orderItem: {},
};

export default LotteryOrderItem;