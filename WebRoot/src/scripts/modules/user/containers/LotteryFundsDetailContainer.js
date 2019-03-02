import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';

class LotteryFundsDetailContainer extends Component {
  
  constructor(props) {
    super(props);

    this.item = null;
  }

  componentWillMount() {
    const {fundItems, match, history} = this.props;
    let item = fundItems.items.filter( item => item.id == match.params.id);
    if (item.length <= 0 ) {
      history.goBack();
      return;
    }
    this.item = item[0];
    bodyClass('chase-body');
  }

  componentWillUnmount() {
    resetBodyClass('chase-body');
  }

  render() {
    let item = this.item;
    if (!item) {
      return null;
    }

    return (
      <div className="page page-lottery-funds-detail">
        
        <Header {...this.props}>
          
          <a onClick={this.props.onBack}/>
          <h3>帐变详情</h3>

        </Header>

        <div className="page-body">
          
          <ul>
            
            <li className="summary">
              <label>{item.changeType}</label>
              <span className={ ({true: 'red', false: 'green'})[item.changeMoney*1 <= 0] }>{item.changeMoney}</span>
            </li>

            <li>
              <label>用户</label>
              <span>{item.userName}</span>
            </li>

            <li>
              <label>彩种</label>
              <span>{item.lotteryName}</span>
            </li>

            <li>
              <label>玩法</label>
              <span>{item.gameName}</span>
            </li>

            <li>
              <label>期号</label>
              <span>{item.qihao}</span>
            </li>

            <li>
              <label>时间</label>
              <span>{item.changeTime}</span>
            </li>

            {item.appendOrder && <li>
              <label>追号编号</label>
              <span>{item.appendOrder}</span>
            </li> }

            {item.fanganOrder && <li><label>方案编号</label><span>{item.fanganOrder}</span></li>}

            <li>
              <label>用户余额</label>
              <span className={ 'orange' }>{item.userBalance}</span>
            </li>

            <li>
              <label>备注</label>
              <span>{item.remark}</span>
            </li>

          </ul>
        
        </div>
      
      </div>
    );
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    fundItems: userModule.order.get('lotteryFundItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryFundsDetailContainer));
