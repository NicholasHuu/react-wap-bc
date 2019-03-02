import React, {Component, PropTypes} from 'react';

import PageTransition from 'react-router-page-transition';

class TransitionPage extends Component {
  render() {
    return (
      <PageTransition>
        {this.props.children}
      </PageTransition>
    );
  }
};

export default TransitionPage;