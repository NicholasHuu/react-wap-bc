import React , { Component , PropTypes } from "react";

import FooterMenuBase from "../../../components/FooterMenu";
import {NavLink} from 'react-router-dom';


class FooterLotteryMenu extends FooterMenuBase{
  menuItems() {
    return [{
      title: '购彩大厅',
      icon: 'lottery',
      link: '/lottery',
      exact: true
    }, {
      title: '开奖中心',
      icon: 'openCenter',
      link: '/lottery/openCenter',
      exact: false
    }, {
      title: '投注记录',
      icon: 'betrecord',
      link: '/lottery/betrecord',
      exact: false
    }];
  }

  render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu-items">
          {this.menuItems().map( (item, index) => {
            return (<div key={index} className={"menu-item"}>
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

}

export default FooterLotteryMenu;