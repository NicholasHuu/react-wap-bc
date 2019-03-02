import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import Header from '../components/Header';
import Back from '../../../components/Back';
import ThirdChargeForm from '../components/ThirdChargeForm';
import CompanyChargeForm from '../components/CompanyChargeForm';
import LoadingComponent from '../../../components/LoadingComponent';
import WebsiteChargeForm from '../components/WebsiteChargeForm';

import {loadChargePaymentItems} from '../actions/Charge';

class ChargeFormContainer extends LoadingComponent {

  constructor(props) {
    super(props);
  }

  getTitle() {
    const {match, charge} = this.props;
    let type = match.params.type;
    let companyBankPayments = charge.get('companyBankPayments');
    let channel = companyBankPayments.filter( item => item.payNo == match.params.channel)[0];
    if (type == 'bank') {
      return '银行卡充值';
    } else if (type == 'website') {
      return '网页充值';
    } else {
      return channel && channel.bankType+'充值';
    }
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadChargePaymentItems());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  render() {
    const {match} = this.props;
    let form = <ThirdChargeForm  {...this.props} />
    if (match.params.type == 'bank') {
      form = <CompanyChargeForm {...this.props} />
    } else if (match.params.type == 'website') {
      form = <WebsiteChargeForm {...this.props} />;
    }
    return (
      <div className="charge-form-page page">
        <div className="inner">
          <Header {...this.props}>
            <Back to={'/user'}/>
            <h3>{this.getTitle()}</h3>
          </Header>
          <div className="page-body">
            {form}
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
    app,
    charge: userModule.charge
  };
}

export default connect(mapStateToProps)(withRouter(ChargeFormContainer));