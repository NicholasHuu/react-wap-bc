import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

class Footer extends Component {
  
  links() {
    return [
      {
        link: '/responsive',
        title: '博彩责任',
      }, {
        link: '/fair',
        title: '公平与公正'
      }, {
        link: '/rule',
        title: '规则与条款',
      }
    ];
  }

  render() {
    const {links} = this.props;
    return (
      <div className="footer">
        <div className="inner">
          <div className="footer-links">
            {links.map((item, index) => {
              return (
                <div key={index} className="footer-item">
                  <Link to={`/page/${item.pgSn}?title=${item.pgTitle}`}>{item.pgTitle}</Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

Footer.propTypes = {
  links: PropTypes.array
};

export default Footer;