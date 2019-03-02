import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link, Route} from 'react-router-dom';

import Back from '../../../components/Back';
import Header from '../components/Header';
import PrivateRoute from '../../../containers/PrivateRouteContainer';

import FooterMenu from '../../../components/FooterMenu';

import MessageItemsContainer from './MessageItemsContainer';
import {loadMessageItems, countMessage} from '../actions/Message';

import {MESSAGE_USER, MESSAGE_SYSTEM} from '../constants/MessageConstant';

class MessageContainer extends Component {
  
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(countMessage());
  }
  
  render() {
    const {message} = this.props.userModule;
    const {match, location} = this.props;
    let userMsgTip = null;
    let sysMsgTip = null;
    if (message.get('userUnreadMsgFlag')) {
      userMsgTip = <i className="tips"></i>;
    }
    if (message.get('systemUnreadMsgFlag')) {
      sysMsgTip = <i className="tips"></i>;
    }
    let type = location.pathname.replace(match.url+ '/', '');  
    return (
      <div className="page msgcenter-page">
        <Header {...this.props}>
          <Back backTo={'/user'}/>
          <h3>会员消息</h3>
        </Header>
        <div className="page-body">
          <div className="message-tabs">
            <ul className="clearfix">
              <li className={"message-tab " + (type == 'system' ?'active': '') }>
                <Link to={match.path+ '/system'}>系统消息</Link>
              </li>
              <li className={"message-tab " + (type == 'user' ? 'active' : '') }>
                {userMsgTip}
                <Link to={match.path + '/user'}>{userMsgTip}个人消息</Link>
              </li>
            </ul>
          </div>
          <Route path={match.path + '/:type'} component={MessageItemsContainer} />
        </div>

      </div>
    );
  }
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  };
}

export default connect(mapStateToProps)(withRouter(MessageContainer));