import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter} from 'react-router-dom';

import {dimension, windowResize} from '../../../utils/dom';
import Timer from '../../../utils/datetime';


class UserPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      flat: ''
    }
  }
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
        qtyx: path + '/order/list',
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
  calculatePt() {
    let topEl = document.body.getElementsByClassName('fixed-top')[0];
    if (topEl && ReactDOM.findDOMNode(this.refs.userPanel)) {
      ReactDOM.findDOMNode(this.refs.userPanel).style.paddingTop = topEl.offsetHeight + 'px';
    }
  }
  componentDidMount() {
    let self = this;
    Timer.push(200, function() {
      self.calculatePt();
    });
  }

  componentWillUnmount() {
    Timer.stop();
  }

  renderMessageGroup() {
    let menuItem = (menus['menuList'][''])
  }
  render() {
    const {path} = this.props.match;
    const {menus, info} = this.props;
    let fundItems = menus['fundsList'] || [];
    let msgcount = menus['msgCount'];
    let fundLinks = this.fundLinks();
    let moduleLinkTos = this.groupModuleLinks(path);

    return (
     <div ref="userPanel" className={ "user-panel " + ( info.userName == '' ? 'no-logined': '' ) + ' ' + ( info.mobile == '' ? '': 'has-mobile' ) }>

        <div className="list-sty2 margin-bottom-scroll">
          {menus['menuList'] && menus['menuList'].map( (module, index) => {
            let linkTos = moduleLinkTos[module.menuModuleCode] || {};
            let menuLinks = module.list;
            return (<div className="ucenter-menu-group" key={index}>
              <h3>{module.menuModuleName}</h3>
              <ul className="clearfix">
              {menuLinks.map( (menuLink, index2) => {
                return (<li key={index2+':'+index}>
                  <Link to={ (linkTos || {} )[menuLink.menuCode] || "home" }>
                    <img src={menuLink.bigPic} className="image-icon" alt="" />
                    <span>{menuLink['menuName']}</span>
                  </Link>
                </li>);
              })}
              </ul>
            </div>);
          })}
        </div>

      </div>
    );
  }
};

UserPanel.propTypes = {
  menus: PropTypes.object,
  info: PropTypes.object
};

UserPanel.defaultProps = {
  info: {},
};


export default UserPanel;

