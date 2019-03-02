import React, {Component, PropTypes} from 'react';
import _FooterMenu from '../../../components/FooterMenu';

class FooterMenu extends _FooterMenu {
  
  menuItems() {
    return [{
      title: '首页',
      icon: 'home',
      link: '/',
      src : '',
      exact: true

    }, {
      title: '发现',
      icon: 'game',
      link: '/game',
      exact: false
    }, {
      title: '我的',
      icon: 'me',
      link: '/user',
      exact: false
    }];
  }

};

export default FooterMenu;