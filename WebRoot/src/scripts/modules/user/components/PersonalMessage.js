import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import {format} from '../../../utils/datetime';
import * as MessageConstant from '../constants/MessageConstant';
import {deleteMessage} from '../actions/Message';

class PersonalMessage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
    };
  }

  handleDeleteMessage(id) {
    const {dispatch} = this.props;
    dispatch(deleteMessage(id,1));
    this.setState({
      deleted: true
    });
  }

  render() {
    if (this.state.deleted) {
      return null;
    }
  	const {message} = this.props;
    let readStatusIcon = <img src="../misc/images/userCenter/message-stu1.png" />;
    let isRead = message.readStatus == MessageConstant.MESSAGE_READ;
    if ( isRead ) {
      readStatusIcon = <img src="../misc/images/userCenter/message-stu2.png" />;
    }
    return (
    <div className={"message-item " + ( isRead ? 'open': '') }>
      <Link to={'/user/viewmessage'  + '/' + message.id + '/' + encodeURIComponent(message.msgContent) + '/' + encodeURIComponent(message.msgTitle)}>
          <div className="wrap">
            <div className="title">
              <i className="img-status">{readStatusIcon}</i>
              <p>{message.msgTitle} </p>
            </div>
            <div className="content align-style">
              <span >{format(message.createTime, 'Y.m.d')}</span> <span>{format(message.createTime, 'HH:mm')}</span>
            </div>
        </div>
      </Link>
      <div className="del-btn" onClick={this.handleDeleteMessage.bind(this, message.id)}>删除</div>
    </div>
    );
  };
};

PersonalMessage.propTypes = {
	message: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default PersonalMessage;