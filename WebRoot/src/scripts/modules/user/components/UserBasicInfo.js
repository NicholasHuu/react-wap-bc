import React, {Component, PropTypes} from 'react';
import {staticURL} from '../../../utils/url';
import {Link} from 'react-router-dom';

class UserBasicInfo extends Component {

  fundLinks() {
    return {
      'deposit': '/user/charge/quick',
      'withdraw': '/user/withdraw',
      'edu': '/user/Transfer',
      'service': '/online-service',
    };
  }
  
  renderNoLoginInfo() {
    const {history, menus} = this.props;
    let fundItems = menus['fundsList'] || [];
    let fundLinks = this.fundLinks();
    return (
      <div className="fixed-top">
        <div className="user-basic-info user-basic-info-nologin">
          {false && <div className="head-icons">
            <span onClick={  () => { history.push('/login') } } className={ 'message ' + ({true: 'new-message'})[this.props.messageUnread > 0] }>新消息</span>
          </div> }
          <div className="head-img"><img src={ '../../../misc/images/sport/header-icon.png' } alt="" /></div>
          <div className="head-info">
            <p className="money">
              <Link to={'/login'}>登录</Link>
              <Link to={'/register'}>注册</Link>
            </p>
          </div>
        </div>

        <div className="list-sty1">
          {fundItems.map((item, index) => {
            let fundTo = fundLinks[item.menuCode] || 'home';
            return (<div key={index} className="items">
              <Link to={fundTo}>
                <img src={item.bigPic} className="image-icon" alt=""/>
                <p>{item.menuName}</p></Link>
            </div> ) 
          })}
        </div>

      </div>
    );
  }

  render() {
    const {user, history, menus} = this.props;
    let fundItems = menus['fundsList'] || [];
    let info = user.get('info');
    let userLevel = user.get('userLevel') || {};
    if(!user.get('auth').get('isLogin')) {
      return this.renderNoLoginInfo();
    }
    
    let userMoney = info.userMoney;
    let fundLinks = this.fundLinks();
    if (info.userMoney) {
      userMoney = new Number(info.userMoney).toFixed(2);
    }
    return (
      <div className="fixed-top">
        <div className="user-basic-info">
          <div className="head-icons">
            <span onClick={  () => { history.push('/user/message/user') } } className={ 'message ' + ({true: 'new-message'})[this.props.messageUnread > 0] }>新消息</span>
            <span className="logout" onClick={this.props.onLogout}>退出</span>
          </div>
          <div className="head-img">
            <img onClick={ () => history.push('/user/info') } src={userLevel.typePicName} alt="" />
            <div className="unamelevel">
              <span className="uname">{info.userName}</span>
              <span className="ulevel">{info.nickName}&nbsp;</span>
            </div>
            <div className="balance">
              <span>&#165;{info.userMoney || 0}</span>
              <span>{userLevel.typeLevel}&nbsp;</span>
            </div>
          </div>
        </div>

        { info.userName && info.mobile == '' && <div className="promo-con">
          <div className="wrap" onClick={ () => { history.push(`/user/phone`) } }>
            <div className="left">
              <img src="/misc/images/money-animate.gif" alt=""/>
              <span>{info.huodong}</span>
            </div>
            <div className="right">
              <Link to={`/user/phone`}>立即绑定></Link>
            </div>
          </div>
        </div> } 

        <div className="list-sty1">
          {fundItems.map((item, index) => {
            let fundTo = fundLinks[item.menuCode] || 'home';
            return (<div key={index} className="items">
              <Link to={fundTo}>
                <img src={item.bigPic} className="image-icon" alt=""/>
                <p>{item.menuName}</p></Link>
            </div> ) 
          })}
        </div>

  		</div>
  	)
  }
};

UserBasicInfo.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func,
  history: PropTypes.object.isRequired,
  messageUnread: PropTypes.number,
  menus: PropTypes.object.isRequired,
};

UserBasicInfo.defaultProps = {
  onLogout: () => {},
  messageUnread: 0,
};

export default UserBasicInfo;