import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

class QuickSection extends Component {
  
  links() {
    return [{
      title: '立即充值',
      link: '/user/charge/quick',
      icon: 'money',
      color: '#c23953',
      src : '../../misc/images/quickSection-icon-1.png',
    }, {
      title: '立即提现',
      link: '/user/withdraw',
      icon: 'withdraw',
      color: '#c47636',
      src : '../../misc/images/quickSection-icon-2.png',
    }, {
      title: '额度转换',
      link: '/user/Transfer',
      icon: 'transfer',
      color: '#6c609e',
      src : '../../misc/images/quickSection-icon-3.png',
    }, {
      title: '在线客服',
      link: '/online-service',
      icon: 'online-service',
      color: '#974478',
      src : '../../misc/images/quickSection-icon-4.png',
    }];
  }

  codeLinks() {
    return {
      deposit: '/user/charge/quick',
      service: '/online-service',
      edu: '/user/Transfer',
      withdraw: '/user/withdraw',
    };
  }

  render() {
    const {links} = this.props;
    const to = this.codeLinks();
    return (
      <div className="quick-section">
        <div className="inner">
          {links.map( (link, key) => {
            return (
            <div key={key} className="qk-link">
              {link.smallBackgroundPic && <img src={link.smallBackgroundPic} className="image-bg" alt=""/> }
              <Link to={to[link['menuCode']]}>
                <img src={link.smallPic} alt=""/>
                <span>{link.menuName}</span>
              </Link>
            </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default QuickSection;