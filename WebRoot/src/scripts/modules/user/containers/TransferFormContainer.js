import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import Header from '../components/Header';
import Back from '../../../components/Back';
import FooterMenu from '../../../components/FooterMenu';
import PlatformTransferForm from '../components/PlatformTransferForm';
import {loadUserPanelInfo} from '../actions/User';

class TransferFormContainer extends Component {

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadUserPanelInfo());
  }

  render() {
    return (
      <div className="page page-transfer-form">
        <div>
          <Header {...this.props}>
            <Back />
            <h3>额度转换</h3>
          </Header>
          <div className="page-body">
            <div className="common-style modify-account">
              <PlatformTransferForm {...this.props} />
            </div>
            <FooterMenu />
          </div>
        </div>
      </div>
    );
  }
};

TransferFormContainer.propTypes = {
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  }
}

export default connect(mapStateToProps)(withRouter(TransferFormContainer));