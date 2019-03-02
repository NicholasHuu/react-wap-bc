import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route} from 'react-router-dom';

import PrivateRouter from '../../../containers/PrivateRouteContainer';
import HomeContainer from './HomeContainer';
import MemberContainer from './MemberContainer';
import FundsContainer from './FundsContainer';
import FundsDetailContainer from './FundsDetailContainer';
import ProxyContainer from './ProxyContainer';

import {bodyClass, resetBodyClass} from '../../../actions/AppAction';

class RouterContainer extends Component {
  
  componentWillMount() {
    bodyClass('agentreport-body');
  }

  componentWillUnmount() {
    resetBodyClass('agentreport-body'); 
  }

  render() {
    const {match} = this.props;
    return (
      <div>
        <Route path={match.url} component={HomeContainer} exact />
        <Route path={`${match.url}/member`} component={MemberContainer} />
        <Route path={`${match.url}/funds`} exact component={FundsContainer} />
        <Route path={`${match.url}/funds/:platform`} component={FundsDetailContainer} />
        <Route path={`${match.url}/proxy`} component={ProxyContainer} />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {};
}

export default withRouter(connect(mapStateToProps)(RouterContainer));