import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

class TinyUserPanel extends Component {

  fundLinks() {
    return {
      'deposit': '/user/charge/quick',
      'withdraw': '/user/withdraw',
      'edu': '/user/Transfer',
      'service': '/online-service',
    };
  }

  groupModuleLinks(path) {
    return {
      message: {
        message: path + '/message/system',
      },
      bank: {
        czjl: path +'/chargerecord', // 充值记录
        cpzb: path +'/lotteryfunds', // 彩票账变
        zhjl:  path +'/transferlog', // 转换记录
        gryk: path + '/userprofit', // 个人盈亏
      },
      history: {
        tzjl: path +'/lotteryorder',
        zhjl: path + '/tracehistory',
        qtyx: path + '/order',
      },
      account: {
        grzx: '/user/info',
        mmgl: path+ '/modifypw/ModifyAccountPsw',
        yhkxx: path +'/bankcard',
        security: '/user/security',
        czxx: path + '/lotteryhowto',
      },
      agent: {
        tdgl: path + '/teammanager',
        tdyk: path + '/team/profit',
        zcxj: path + '/team/adduser',
        tglj: path + '/promolinks',
        rxgl: path + '/salary',
      }
    };
  }

  render() {

    const {menus, user} = this.props;
    let userInfo = user.get('info');

    let fundLinks = this.fundLinks();
    let moduleLinkTos = this.groupModuleLinks('/user');
    
    return <div className="tiny-user-panel">
      <div className="wrapper">
        <div className="basic-info">
          <Link to="/user"><img src={( userInfo.typeDetail || {}).typePicName } alt=""/></Link>
          <p>
            <span>{ userInfo.userName }</span>
            <span>&#165;&nbsp;{ userInfo.userMoney || 0 }</span>
          </p>
        </div>
        <div className="fund-links">
          <ul className="clearfix">
            { (menus.fundsList || []).map( (item, index) => {
              let fundTo = fundLinks[item.menuCode] || 'home';
              return <li key={index}><Link to={fundTo}>
                <img src={item.bigPic} className="image-icon" alt=""/>
                <p>{item.menuName}</p></Link></li>
            }) }
          </ul>
        </div>
        
        <div className="group-links">
          { ( menus.menuList || [] ).map( (module, index) => {
            let linkTos = moduleLinkTos[module.menuModuleCode] || {};
            return <div key={index} className="group">
              <ul className="clearfix">
                { module.list.map( (menuLink, index2) => {
                return (<li key={index2+':'+index}>
                  <Link to={ (linkTos || {} )[menuLink.menuCode] || "home" }>
                    <img src={menuLink.bigPic} className="image-icon" alt="" />
                    <span>{menuLink['menuName']}</span>
                  </Link>
                </li>);
                } ) }
              </ul>
            </div>
          } ) }
        </div>

        <div className="group-links">
          
          <div className="group">
              <ul className="clearfix">
                <li>
                <a onClick={ this.props.onLogout }>
                  <img src="/misc/images/logout-icon.png" alt=""/>
                  <span>退出登录</span> 
                </a></li>
              </ul>
          </div>
  
        </div>

      </div>
    </div>
  }

};

TinyUserPanel.propTypes = {
  menus: PropTypes.object,
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

TinyUserPanel.defaultProps = {
  menus: {},
  user: {},
  onLogout: () => {},
};

export default TinyUserPanel;