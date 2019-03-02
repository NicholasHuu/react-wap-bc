import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import {format} from '../../../utils/datetime';
import * as MessageConstant from '../constants/MessageConstant';
import {deleteMessage} from '../actions/Message';

class SystemMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
    };
  }

  handleDeleteMessage(id) {
    const {dispatch} = this.props;
    dispatch(deleteMessage(id, 2));
    this.setState({
      deleted: true
    });
  }

  render() {

    if (this.state.deleted) {
      return null;
    }

    const {message, status} = this.props;
    let readStatusIcon = <img src="../misc/images/userCenter/message-stu1.png" />;
    let isRead = message.status == MessageConstant.MESSAGE_READ;
    if ( isRead ) {
      readStatusIcon = <img src="../misc/images/userCenter/message-stu2.png" />;
    }
    return (
      <div className={"message-item " + (isRead ? 'open': '') }>
        <a to={'/user/viewmessage' + '/' + message.id + '/' + encodeURIComponent(message.msgContent) + '/' + encodeURIComponent(message.msgTitle)}>
            <div className="wrap">
              <div className="title system-title">
                <p>{message.msgTitle} </p>
              </div>
              <div className="content">{message.msgContent}</div>
              <div className="time">
                <span>{format(message.createTime, 'Y.m.d')}</span>&nbsp;
                <span>{format(message.createTime, 'HH:mm')}</span>
              </div>
            </div>
        </a>
      </div>
    );
  };
};

SystemMessage.propTypes = {
  message: PropTypes.object.isRequired
};

export default SystemMessage;