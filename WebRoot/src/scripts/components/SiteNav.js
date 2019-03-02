import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

class SiteNav extends Component  {
  
  links() {
    return {
      live: '/live',
      sport: '/sport',
      electronic: '/elect',
      lottery: '/lottery',
      bbin: '/bbin',
      card: '/cards',
    };
  }

  render() {
    const {app, electricMenuItems} = this.props;
    if(!electricMenuItems.length){
      return null;
    }
    return (
      <div className="site-nav">
        <div className="inner">
          {electricMenuItems.map( (menuItem, index) => {
            let to = this.links()[menuItem.menuCode] || "";
            return (
              <div className="nav-item" key={index}>
                <Link to={to}>
                  { menuItem.bigBackgroundPic && <img src={menuItem.bigBackgroundPic} className="image-bg" alt=""/> }
                  <div className="box">
                    <div className="icon-inner"><i><img src={menuItem.smallPic} alt=""/></i>
                      <span>{menuItem.menuName}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default SiteNav;