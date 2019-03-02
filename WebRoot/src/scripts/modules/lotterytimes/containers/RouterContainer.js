import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route} from 'react-router-dom';

import IndexContainer from './IndexContainer';
import PlayContainer from './PlayContainer';
import ConfirmContainer from './ConfirmContainer';
import TrendContainer from './TrendContainer';
import ChaseContainer from './ChaseContainer'; 

class RouterContainer extends Component {
  render() {
    const {match} = this.props;
    return (
      <div>
        <Route path={`${match.url}`} exact component={IndexContainer} />
        <Route path={`${match.url}/play`} exact component={PlayContainer} />
        <Route path={`${match.url}/chase`} exact component={ChaseContainer} />
        <Route path={`${match.url}/confirm`} exact component={ConfirmContainer} />
        <Route path={`${match.url}/:lottery/trend`} exact component={TrendContainer}/>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {

  };
}

export default withRouter(connect(mapStateToProps)(RouterContainer));
