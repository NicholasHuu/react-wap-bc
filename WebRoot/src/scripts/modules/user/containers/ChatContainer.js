import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';
import {loadChatDetails, chat} from '../actions/Message';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';

const CHAT_MESSAGE_STATUS_SENDING = 'sending';
const CHAT_MESSAGE_STATUS_ERROR = 'error';
const INTERVAL_SECOND = 1000 * 1.5; // 1.5秒轮询

class ChatMessagesContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.sendMsg = this.sendMsg.bind(this);
    this.onMsgChange = this.onMsgChange.bind(this);
    this.timer = null;
    this.isFirstLoad = false;

    this.state = {
      pushingChat: [],
      msg: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chatDetails.length > 0 || nextProps.chatDetails != this.props.chatDetails) {
      this.closeLoading();
      //this.scrollToBottom();
    }

    if ( ( this.props.chatDetails.length == 0 && nextProps.chatDetails != this.props.chatDetails ) ) {
      this.isFirstLoad = true;
    } else {
      this.isFirstLoad = false;
    }
  }

  loadChatMessages(cb = () => {}) {
    const {history, match, dispatch} = this.props;
    let id = match.params.id;
    if (id) {
      dispatch(loadChatDetails(id, cb));
    }
  }

  componentDidMount() {
    super.componentDidMount();
    const {history, match} = this.props;
    let id = match.params.id;
    if (id) {
      this.loadChatMessages();
      this.reloadMessages();
    } else {
      history.goBack();
    }
  }

  componentWillUnmount() {
    this.cleanResource();
  }

  reloadMessages() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      let sendingCount = 0;
      this.state.pushingChat.map((item) => {
        if (item.status == CHAT_MESSAGE_STATUS_SENDING) {
          sendingCount ++ ;
        }
      });
      // 消息正在发送中时不重新加载消息
      if (sendingCount > 0 ) {
        return;
      } else {
        this.loadChatMessages();
      }
    }, INTERVAL_SECOND);

  }

  cleanResource() {
    clearInterval(this.timer);
    this.timer = null;
  }

  sendMsg() {
    let msg = this.refs.chat.value.trim();
    const {match} = this.props;
    let group = match.params.group;
    let pushingChat = this.state.pushingChat;
    let index = pushingChat.length; // 当前的位置
    pushingChat.push({
      senderSimple: '我',
      message: msg,
      status: CHAT_MESSAGE_STATUS_SENDING,
      messageTimeLong: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    this.setState({
      pushingChat,
      msg: '',
    });
    chat(group, msg, (data) => {
      if (data.errorCode == RES_OK_CODE) {

        this.cleanResource();
        this.loadChatMessages(() => {
        
          this.scrollToBottom();
          this.reloadMessages();
        });

        pushingChat.splice(index, 1);
        this.setState({
          pushingChat
        });

      } else {
        pushingChat[index][status] = CHAT_MESSAGE_STATUS_ERROR;
        alert(data.msg);
      }
   });
  }

  scrollToBottom(diametrially) {
    if (this._timeout) clearTimeout(this._timeout);

    let crtOffsetY = window.pageYOffset;
    let maxOffsetY = document.body.scrollHeight - window.innerHeight;
    console.log(['should scroll ?', crtOffsetY, maxOffsetY, crtOffsetY >= maxOffsetY]);
    if (crtOffsetY >= maxOffsetY) {
      console.log(['no scroll']);
      return ;
    } else {
      if (diametrially) {
        window.scroll(0, document.body.scrollHeight);
      } else {
        this._timeout = setTimeout( () => {
          window.scroll(0, document.body.scrollHeight);
        }, 100 ); 
      }    
    }
  }

  componentDidUpdate() {
    if (this.isFirstLoad) {
      this.scrollToBottom(true);
      this.isFirstLoad = false;
    }
  }

  onMsgChange() {
    this.setState({
      msg: this.refs.chat.value
    });
  }

  render() {
    const {match, chatDetails} = this.props;
    if (!match.params.id) return null;
    return (
      <div className="page page-chat">
        <Header {...this.props}>
          <Back />
          <h3>信息</h3>
        </Header>
        <div className="page-body">
          <div className="chat-details">
            {chatDetails.map( (item, index) => {
              return ( <div key={index} className={"chat-item " + ( item.senderSimple == '我' ? 'me': '' ) }>
                {item.senderSimple == '我' && <img src="/misc/images/userCenter/me-read.png" alt=""/>}
                {item.senderSimple != '我' && <img src="/misc/images/userCenter/msg-unread.png" alt=""/>}
                <div className={"msg " }>
                  <h3>{item.sender}</h3>
                  <div className="c">
                    <p>{item.message}</p>
                    <span>{item.messageTimeLong}</span>
                  </div>
                </div>
              </div>)
            } )}
            
            {false && this.state.pushingChat.map( (item, index) => {
              return (
                <div key={index} className={"chat-item me " + item.status}>
                  <img src="/misc/images/userCenter/me-read.png" alt=""/>
                  <div className={"msg " }>
                  <h3>{item.sender}</h3>
                  <div className="c">
                    <p>{item.message}</p>
                    <span>{item.messageTimeLong}</span>
                  </div>
                </div>
                </div>
              );
            })}

          </div>
          <div className="chat-box">
            <input type="text" onChange={this.onMsgChange} value={this.state.msg} placeholder="" ref="chat" />
            <button className="btn btn-orange" onClick={this.sendMsg}>发送</button>
          </div>
        </div>
      </div>
    );
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    chatDetails: userModule.message.get('chatDetails'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(ChatMessagesContainer));