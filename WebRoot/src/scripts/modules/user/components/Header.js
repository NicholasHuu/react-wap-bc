import React, {Component, PropTypes} from 'react';
import BaseHeader from '../../../components/Header';
import {Link} from 'react-router-dom';
import TopBar from '../../../components/TopBar';

class Header extends BaseHeader {

  render() {
    return <div className="user-panel-header">{super.render()}</div>;
  }

  static headerLinks(user) {
    if (user.get('auth').get('isLogin')) {
      return (
        null
      );
    } else {
      return (
        <ul className="header-qlink">
          <li>
            <Link to="/login">登录</Link>
          </li>
          <li>
            <Link to="/register">注册</Link>
          </li>
        </ul>
      );
    }
  }
};

Header.propTypes = {
  userModule: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default Header;