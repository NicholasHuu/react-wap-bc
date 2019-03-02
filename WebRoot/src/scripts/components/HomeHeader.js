import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import TopBar from './TopBar';
import Header from './Header';

class HomeHeader extends Header {

  static headerLinks(user) {

    return null;

    if (user.get('auth').get('isLogin')) {
      return null;
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

export default HomeHeader;