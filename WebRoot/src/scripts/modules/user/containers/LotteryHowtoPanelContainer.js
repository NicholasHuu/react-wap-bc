import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';

import {loadAllLottery} from '../actions/UserOrder';
import PTR from '../../../utils/pulltorefresh';

class LotteryHowtoPanelContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadAllLottery());
  }

  onLotteryClick(lottery) {
    const {history} = this.props;
    history.push(`/user/lotteryhowto/${lottery.lotteryCode}`);
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      refreshHandler({close, handler}) {
        dispatch(loadAllLottery(() => {
          close();
        }));
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }
  
  render() {
    const {lotteryItems} = this.props;
    return (
      <div className="page page-lottery-howto-panel">
        
        <Header {...this.props}>
          <Back />
          <h3>彩种信息</h3>
        </Header>

        <div className="page-body">
          <div className="wrap">
            <ul>
              {lotteryItems.map( (lottery, index) => {
                if (index == 0) return;
                return <li key={index} onClick={this.onLotteryClick.bind(this, lottery)}><span>{lottery.lotteryName}</span></li>
              })}
            </ul>
          </div>

        </div>

      </div>
    );
  }


};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    lotteryItems: userModule.order.get('lotteryItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryHowtoPanelContainer));