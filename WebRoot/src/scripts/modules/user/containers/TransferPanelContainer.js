import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import Header from '../components/Header';
import Back from '../../../components/Back';
import FooterMenu from '../../../components/FooterMenu';
import TransferList from '../components/TransferList';

import {loadEduPlatformItems} from '../actions/PlatformTransfer';

import LoadingComponent from '../../../components/LoadingComponent';

class TransferPanelContainer extends LoadingComponent {
  
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadEduPlatformItems());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  render() {
    const {platform} = this.props.userModule;
    return (
       <div className="page oredr-page">
          <div>
            <Header {...this.props}>
              <Back />
              <h3>额度转换</h3>
            </Header>
            <div className="page-body">
              <TransferList {...this.props} items={platform.get('platformItems')}/>
              <FooterMenu />
            </div>
          </div>
      </div>
    );
  }
};

TransferPanelContainer.propTypes = {
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  };
}

export default connect(mapStateToProps)(withRouter(TransferPanelContainer));