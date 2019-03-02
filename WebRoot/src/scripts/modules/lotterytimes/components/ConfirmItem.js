import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {formatPrice} from '../utils/Lottery';
import {alert} from '../../../utils/popup';

import {BONUS_GAOFAN, BONUS_GAOJIANG} from '../constants/LotteryConstant';

class ConfirmItem extends Component {
  
  constructor(props) {
    super(props);
  }

  deleteOrder(order) {
    this.props.deleteCb(order.id);
  }

  renderNumber(num) {
    let nums = num['format'].split('');
    let html = [], i = 0;
    for (let n of nums) {
      if (isNaN(n * 1)) {
        html.push( <span className="confirm-symbol" key={i}>{n}</span>);
      } else if (n == '.') {
        htm.push(<span className="confirm-ellipse" key={i}>{n}</span>);
      } else {
        html.push(<span className="confirm-num" key={i}>{n}</span>);
      }
      i++;
    }

    return html;
  }

  showFullNumber(num) {
    alert(<p>{num.full}</p>);
  }

  render() {
    const {order} = this.props;
    return (
      <div className="confirm-item">
        <i className="icon delete" onClick={this.deleteOrder.bind(this, order)}></i>
        <div className="item-content" onClick={this.showFullNumber.bind(this, order.num)}>
          <div className={"nums " + order.lottery}>
            {this.renderNumber(order.num)}
          </div>
          <p className="bet-con">
            <span>{order.gameCodeName}</span>
            <span>{order.zhushu}注</span>
            <span>{order.bs}倍</span>
            <span>{ formatPrice(order.zhushu * order.unit.value * order.bs) }元</span>
            <span>{ ({ [BONUS_GAOJIANG]: '高奖', [BONUS_GAOFAN]: '高返'})[order.bonusType]  }</span>
          </p>
        </div>
      </div>
    );
  }
};

ConfirmItem.propTypes = {
  order: PropTypes.object.isRequired,
  deleteCb: PropTypes.func
};

ConfirmItem.defaultProps = {
  deleteCb: () => {},
};

export default ConfirmItem;