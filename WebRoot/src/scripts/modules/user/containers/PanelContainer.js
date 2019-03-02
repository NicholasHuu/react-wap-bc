import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import Header from '../components/Header';
import UserBasicInfo from '../components/UserBasicInfo';
import UserPanel from '../components/UserPanel';
import Back from '../../../components/Back';
import FooterMenu from '../../../components/FooterMenu';
import {userLogout, loadUserInfo, loadUserPanelInfo, loadUserBalance} from '../actions/User';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import PTR from '../../../utils/pulltorefresh';

import {countMessage} from '../actions/Message';
import {loadPlatformItems} from '../actions/PlatformTransfer';
class PanelContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.onLogoutHandler = this.onLogoutHandler.bind(this);
    this.loadUserTimer = null;
    this.refreshTime = 60;
  }

  componentWillReceiveProps(nextProps) {
    const {userModule} = nextProps;
    if (userModule.user.get('panelMenu').refreshTime && this.refreshTime != userModule.user.get('panelMenu').refreshTime) {
      this.refreshTime = userModule.user.get('panelMenu').refreshTime;
      this.startRefreshTimer(); 
    }
    this.closeLoading();
  }

  startRefreshTimer() {
    return ;
    if (this.loadUserTimer) clearInterval(this.loadUserTimer); 
    const {dispatch, userModule} = this.props;
    this.loadUserTimer = setInterval(() => {
      if (userModule.user.get('auth').get('isLogin')) {
        //dispatch(loadUserInfo());
        //dispatch(countMessage());
      }
    }, this.refreshTime * 1000);
  }

  componentWillMount() {
    const {dispatch, userModule} = this.props;
    if (userModule.user.get('auth').get('isLogin')) {
      dispatch(loadUserInfo());
      dispatch(countMessage());
    }
    this.startRefreshTimer();
    
    dispatch(loadUserPanelInfo());
    dispatch(loadPlatformItems());  
  }

  componentDidMount() {
    this.closeLoading();
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch, userModule} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.list-sty2',
      refreshHandler({close, handler}) {
        
        if (userModule.user.get('auth').get('isLogin')) {
          dispatch(loadUserInfo());
          dispatch(countMessage());
        }

        dispatch(loadUserPanelInfo(() => {
          close();
        }));
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    clearInterval(this.loadUserTimer);
    this.setupPullToRefresh(true);
  }

  onLogoutHandler() {
    const {dispatch, history} = this.props;
    let _this = this;
    _this.openLoading();
    dispatch(userLogout((data) => {
      _this.closeLoading();
      if (data.errorCode == RES_OK_CODE) {
        window.location.href = "/";
      } else {
        alert(data.msg);
      }
    }));
  }

  render() {
    const {history} = this.props;
    const user = this.props.userModule.user;
    const messageUnread = this.props.userModule.message.get('userUnreadMsgFlag') ;
    const panelMenu = user.get('panelMenu');
    return (
      <div className="page user-page">
          <div>
            <div className="page-body">
              <UserBasicInfo history={history} user={user} menus={panelMenu} messageUnread={messageUnread} onLogout={this.onLogoutHandler}/>
              <UserPanel {...this.props} info={user.get('info')} menus={panelMenu}/>
              <FooterMenu />
            </div> 
          </div>
      </div>
    );
  }
};

PanelContainer.propTypes = {
  userModule: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

PanelContainer.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  };
}

export default connect(mapStateToProps)(PanelContainer);