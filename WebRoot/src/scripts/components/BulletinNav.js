import React ,{Component , PropTypes}  from 'react';
import {Link} from 'react-router-dom';




class BulletinNav extends Component {
  render() {
    return(
      <div className="bulletin-nav">
        <div className="left">
          <Link className="inner"  to="/promotion">
            <i><img src="../../misc/images/home-BulletinNav-icon1.png" alt=""/></i>
            <div className="text">
              <p>优惠活动</p>
              <span>精彩活动实时推出</span>
            </div>
          </Link>
        </div>

        <div className="right">
            <Link to="/page/m_agent">
              <div className="icon-inner">
                <i><img src="../../misc/images/home-BulletinNav-icon2.png" alt=""/></i>
                <span>代理合作</span>
              </div>
            </Link>
            <Link to="/linecheck">
              <div className="icon-inner">
                <i><img src="../../misc/images/home-BulletinNav-icon3.png" alt=""/></i>
                <span>备用网址</span>
              </div>
            </Link>
        </div>
      </div>
    )
  }

};
export default BulletinNav;