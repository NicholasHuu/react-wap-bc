import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route} from 'react-router-dom';

import PrivateRoute from '../../../containers/PrivateRouteContainer';
import HomeContainer from '../containers/HomeContainer';
import OpenCenterContainer from '../containers/OpenCenterContainer';
import OpenItemInfoContainer from '../containers/OpenItemInfoContainer';
import BetRecordContainer from '../containers/BetRecordContainer';
import BetCenterContainer from '../containers/BetCenterContainer';
import BetCenterOpenContainer from '../containers/BetCenterOpenContainer';
import BetCenterOrderContainer from '../containers/BetCenterOrderContainer';
import BetCenterRuleContainer from '../containers/BetCenterRuleContainer';
import MemberBetContainer from '../containers/MemberBetContainer';
import LotterySwiperContainer from './LotterySwiperContainer';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';
class RouterContainer extends Component {
  render() {
    return (
      <div>
        <Route exact onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  path={'/lottery'} component={HomeContainer} />
        <Route exact path={'/lottery/opencenter'} component={OpenCenterContainer} />
        <PrivateRoute path={'/lottery/betrecord'} component={BetRecordContainer} />
        <Route path={'/lottery/betcenter/:gameCode/home'} component={LotterySwiperContainer} />
        <Route path={'/lottery/betcenter/:gameCode/open'} component={BetCenterOpenContainer} />
        <Route path={'/lottery/betcenter/:gameCode/order'} component={BetCenterOrderContainer} />
        <Route path={'/lottery/betcenter/:gameCode/rule'} component={BetCenterRuleContainer} />
        <Route path={'/lottery/openiteminfo/:type'} component={OpenItemInfoContainer} />
        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  path={'/lottery/memberbet'} component={MemberBetContainer} />
      </div>
    );
  }
};

RouterContainer.propTypes = {
  
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(withRouter(RouterContainer));