import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../../../components/Back';
import PlatformOrder from '../components/PlatformOrder';
import FooterMenu from '../../../components/FooterMenu';
import LoadingComponent from '../../../components/LoadingComponent';
import {loadPlatformItems} from '../actions/PlatformTransfer';


class OrderContainer extends LoadingComponent {
  
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadPlatformItems());
  }

  componentWillReceiveProps(nextProps){
    this.closeLoading();
  }

  render() {
    const {platform} = this.props.userModule;
    return (
    	 <div className="page oredr-page order-page">
          <div>
            <Header {...this.props}>
              <Back to={'/user'} />
              <h3>注单查询</h3>
            </Header>
            <div className="page-body">
              <PlatformOrder history={this.props.history} items={platform.get('platformItems')} />
              <FooterMenu />
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
    app
  };
}

export default connect(mapStateToProps)(OrderContainer);