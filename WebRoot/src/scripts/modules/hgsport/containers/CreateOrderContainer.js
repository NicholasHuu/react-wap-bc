import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Redirect} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';

import {loadSportDetail, resetTempSelectedOrder} from '../actions/HgActionPart';
import {loadUserInfo} from '../../../modules/user/actions/User';
import {parseQuery} from '../../../utils/url';
import cache from '../../../utils/cache';
import CreateOrderInfo from '../components/CreateOrderInfo';

import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';

class CreateOrderContainer extends Component {
  
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {userModule, hgsport, history, dispatch} = this.props;
    dispatch(loadUserInfo());
    const tempOrderData = cache.get('tempOrderData');
    if (!tempOrderData || tempOrderData.length <= 0) {
      history.goBack();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {userModule, hgsport, history, dispatch} = nextProps;
    const tempOrderData = cache.get('tempOrderData');


    if (!tempOrderData || tempOrderData.length <= 0) {
      return history.goBack();
    }
  }

  render() {
    const {userModule, hgsport, history} = this.props;
    const tempOrderData = cache.get('tempOrderData');
    if (!tempOrderData || tempOrderData.length <= 0) {
      return null;
    }
    
    return (
      <div className="hg-page page create-order-page">
        <Header {...this.props} className="hgsport-header">
          <Back />
          <h3>确认注单</h3>
        </Header>
        <div className="page-body">
          <div className="user-info">
            <span>{'用户名 : ' +userModule.user.get('auth').get('userName')}</span>
            <span>{'余额 : ' + userModule.user.get('info').userMoney}</span>
          </div>
          <div className="order-info-board">
            <div className="wrap">
             <CreateOrderInfo {...this.props} details={ tempOrderData }/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const {app, userModule, hgsport} = state;
  return {app, userModule, hgsport};
}

export default connect(mapStateToProps)(withRouter(CreateOrderContainer));