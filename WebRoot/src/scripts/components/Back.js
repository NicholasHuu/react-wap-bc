import React, {Component, PropTypes} from 'react';
import {withRouter, Link, BrowserHistory} from 'react-router-dom';

class Back extends Component {
  
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    const {history, backTo, to} = this.props;
    if (backTo || to) {
      history.replace(backTo || to);
    } else {
      history.goBack();
    }
  }

  render() {
    return (
      <a onClick={this.goBack} />
    );
  }
};

Back.propTypes = {
  backTo: PropTypes.string,
  to: PropTypes.string
};

export default withRouter(Back);