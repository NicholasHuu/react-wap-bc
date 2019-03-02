import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import ChargeQuick from '../components/ChargeQuick';
import ChargeCompany from '../components/ChargeCompany';
import Header from '../components/Header';
import Back from '../../../components/Back';
import PTR from '../../../utils/pulltorefresh';

import { loadChargePaymentItems, loadChargeAllPayment } from '../actions/Charge'; 

import LoadingComponent from '../../../components/LoadingComponent';

class ChargeContainer extends LoadingComponent {
  
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadChargeAllPayment());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  componentDidMount() {
    let info = this.props.userModule.user.get('info');
    if (!info.hasWithdrawProfile) {
      this.props.history.push(`/user/setWithdraw`);
    }
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      refreshHandler({close, handler}) {
        dispatch(loadChargeAllPayment(() => {
          close();
        }));
      }
    });
  }

  render() {
    const {params} = this.props.match;

    let chargeComponent = <ChargeCompany {...this.props} /> 
    if (params.type == 'quick') {
      	chargeComponent = <ChargeQuick {...this.props} /> 
    }

    return (
      <div className="page page-charge">
        <Header {...this.props}>
          <Back to='/user'/>
          <h3>充值</h3>
        </Header>
        <div className="page-body" style={ {minHeight: window.outerHeight + 'px', backgroundColor: '#eee'} }>
          <div className="inner">
            {chargeComponent}
          </div>
        </div>
      </div>
    );
  };
};

function mapStateToProps(state) {
  const {app, userModule} = state;
  return {
    app,
    userModule,
    charge: userModule.charge
  };
}

export default connect(mapStateToProps)(withRouter(ChargeContainer));