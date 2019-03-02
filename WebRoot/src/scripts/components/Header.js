import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import TopBar from './TopBar';

class Header extends Component {

  static headerLinks(user) {
    return null;
  }


  render() {
    const className = this.props.className;
    return (
      <TopBar className={className}>
        { this.props.children }
        { this.props.userModule && this.constructor.headerLinks(this.props.userModule.user) }
      </TopBar>
    );
  }
};

Header.propTypes = {
};

Header.defaultProps = {
  className: '',
};

export default Header;