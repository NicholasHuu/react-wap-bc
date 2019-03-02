import React, {Component, PropTypes} from 'react';

import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

class FooterMenu extends Component {
  
  menuItems() {
    return [{
      title: '首页',
      icon: 'home',
      link: '/',
      src : '',
      exact: true

    }, {
      title: '购彩大厅',
      icon: 'lottery',
      link: '/game',
      exact: false
    },
    , {
      title: '其他游戏',
      icon: 'other',
      link: '/other',
      exact: false
    }, {
      title: '我的',
      icon: 'me',
      link: '/user',
      exact: false
    }];
  }

  render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu-items">
          {this.menuItems().map( (item, index) => {
            return (<div key={index} className={"menu-item " + (this.props.hasMsg && false && item.link == '/user' ? 'menu-item-has-msg': '')}>
              <NavLink exact={item.exact} activeClassName={'active'} to={item.link}>
                <i className={" icon icon-" + item.icon}></i>
                <p>{item.title}</p>
              </NavLink>
            </div>);
          })}
        </div>
      </div>
    );
  }
};

FooterMenu.propTypes = {
  hasMsg: PropTypes.bool
};

function mapStateToProps(state) {
  let message = state.userModule.message
  return {
    hasMsg: !!message.get('userUnreadMsgFlag')
  }
}

export default connect(mapStateToProps)(FooterMenu);