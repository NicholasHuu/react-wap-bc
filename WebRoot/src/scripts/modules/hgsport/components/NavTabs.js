import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {Link ,NavLink} from 'react-router-dom';

import {parseQuery} from '../../../utils/url';

class NavTabs extends Component {
  
  constructor(props) {
    super(props);
    this.restActiveName = this.restActiveName.bind(this);
    this.tabLinks = [{
      to: '/hgsport/roll',
      title: '滚球',
      exact: false,
    }, {
      to: '/hgsport' ,
      title: '今日',
      exact: true,
    }, {
      to: '/hgsport/tom',
      title: '早盘',
      exact: false,
    }, {
      to: '/hgsport/raceresult',
      title: '赛果',
      exact: false,
    }, {
      to: '/hgsport/orders',
      title: '注单',
      exact: false,
    }];
    this.state = {
      crttab: 0,
    };

    const {match, location} = this.props;
    this.state = {
      crtpath: match.path
    };
  }
  restActiveName() {
    const {event} = this.props;

    let val = "";

    event && event(val);  }
  
  render() {    // 把query 参数放到 to 上面
    const {location,match} = this.props;
    let query = parseQuery(location.search);
    let _this = this;
    return (
    <div className="nav-tabs">
      <ul className="clearfix">
        {this.tabLinks.map( (tabLink, index) => {
          let to = tabLink.to;
          let ball = query.ball;
          // if (ball && to == '/hgsport') {
          //   to += '?ball='+ball;
          // } else if (to == '/hgsport' && !ball && false) {
          //   to = tabLink.to;
          // } else {
          //   to = tabLink.to + location.search;
          // }
          if (ball) {
            to = tabLink.to + '?ball='+ball  
          }
          return (
            <li className={ this.state.crtpath == tabLink.to ? 'active': '' } key={index}><NavLink onClick={_this.restActiveName} to={to}>{tabLink.title}</NavLink></li>
          )
        })}
      </ul>
    </div>);
  }
};
export default withRouter(NavTabs);