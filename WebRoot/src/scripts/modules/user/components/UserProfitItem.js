import React, {Component, PropTypes} from 'react';

import {alert} from '../../../utils/popup';

class UserProfitItem extends Component {

  constructor(props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick() {
    const {item} = this.props;
    let html = (
      <div className="profit-details">
        <div className="wrap">
          <ul>
            <li>
              <span>实际投注总额</span>
              <span>{item.betAmount}</span>
            </li>
            <li>
              <span>中奖总额</span>
              <span>{item.winAmount}</span>
            </li>
            <li>
              <span>充值总额</span>
              <span>{item.depositAmount}</span>
            </li>
            <li>
              <span>提款总额</span>
              <span>{item.drawAmount}</span></li>
            <li>
              <span>活动总额</span>
              <span>{item.huoDongAmount}</span></li>
            <li>
              <span>返点总额</span>
              <span>{item.betBack}</span></li>
          </ul>
          <div className="full">
              <span>实际盈亏</span>
              <span className={ ({true: 'red', false: 'green'})[item.totalProfit*1 <= 0] }>{item.totalProfit}</span>
          </div>
        </div>
      </div>
    );

    alert(html, '盈亏详情');
  }
  
  render() {
    const {item, currentUserName} = this.props;
    return (
      <div className="user-profit-item" >
        <div className="wrap">
          <div className="left">
            {!this.props.isMember && <div><h3>日期</h3><h4>{item.date}</h4></div>  }

            { this.props.isMember && <div className={ ({true: 'clickable', false: ''})[item.clickFlag == "1"] } onClick={this.props.onClick}><h3>用户</h3><h4>{item.userName}</h4></div>  }
            
          </div>
          <div className="right" onClick={this.onItemClick}>
            <h3>盈亏金额</h3>
            <h4 className={ ({true: 'red', false: 'green'})[item.totalProfit*1 <= 0] }>{item.totalProfit}</h4>
          </div>
        </div>
      </div>
    );
  }

};

UserProfitItem.propTypes = {
  item: PropTypes.object.isRequired,
  isMember: PropTypes.bool,
  onClick: PropTypes.func,
  currentUserName: PropTypes.string,
};

UserProfitItem.defaultProps = {
  isMember: false,
  onClick: () => {},
  currentUserName: '',
};

export default UserProfitItem;