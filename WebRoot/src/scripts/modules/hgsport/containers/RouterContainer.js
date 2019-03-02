import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';

import PrivateRoute from '../../../containers/PrivateRouteContainer';
import RealtimeBallContainer from './RealtimeBallContainer';
import OrdersContainer from './OrdersContainer';
import RaceResultContainer from './RaceResultContainer';
import CreateOrderContainer from './CreateOrderContainer';
import RuleContainer from './RuleContainer';

import Route from '../../../components/Route';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';
import {loadUserInfo} from '../../../modules/user/actions/User';

class RouterContainer extends Component {
    
  constructor(props) {
    super(props);
    const {match} = this.props;
    this.basepath = '/hgsport';
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadUserInfo());
  }

  render() {

    return (
      <div className="sport-panel">
        <Route exact path={this.basepath } component={RealtimeBallContainer} />

        <Route path={this.basepath + '/today'} component={RealtimeBallContainer} />

        <Route path={this.basepath + '/roll'} component={RealtimeBallContainer} />
  
        <Route path={this.basepath + '/tom'} component={RealtimeBallContainer} />
        
        <Route onEnter={()=> bodyClass('hg-bg')} onExist={() => resetBodyClass()} path={this.basepath + '/order/create'} component={CreateOrderContainer} />
        
        <Route path={this.basepath+'/orders'} component={OrdersContainer} />

        <Route path={this.basepath+'/raceresult'} component={RaceResultContainer} />

        <Route path={this.basepath+'/rule/:type'} component={RuleContainer} />

      
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

export default connect(mapStateToProps)(withRouter(RouterContainer));