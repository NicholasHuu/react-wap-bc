import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';

import TabSwitcher from '../components/TabSwitcher';
import {loadChatMessageItems, chatDelete} from '../actions/Message';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {confirm, alert} from '../../../utils/popup';
import PTR from '../../../utils/pulltorefresh';

import {MESSAGE_READ, MESSAGE_NOREAD} from '../constants/MessageConstant';

const STATUS_ALL = '';


class ChatMessagesContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.resetPager();
    this.goChat = this.goChat.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.concatUpline = this.concatUpline.bind(this);
    this.viewDeleteOption = this.viewDeleteOption.bind(this);
    this.contactDownline = this.contactDownline.bind(this);

    this.state = {
      showDeleteBtn: true,
      deleteCheked: {},
    };
  }

  resetPager() {
    // 分页数据
    this.pageStart = 1;
    this.hasMore = true;
    this.crtPage = 1;
    this.totalPage = 1;
    if (this.refs.scroller) {
      let scroller = this.refs.scroller;
      scroller.pageLoaded = this.pageStart;
    }
  }

  loadMoreItems(page) {
    if (page > this.totalPage) {
      this.hasMore = false
      return ;
    } else {
      this.crtPage = page;
      this.loadChatMessage();  
    }
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;
    let self = this;
    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    
    PTR({
      mainElement: '.chat-messages',
      refreshHandler({close, handler}) {
        self.resetPager();
        dispatch(loadChatMessageItems(STATUS_ALL, self.crtPage, () => {
          close();
        }));
      }
    });

  }

  loadChatMessage(cb = () => {} ) {
    const {dispatch} = this.props;
    dispatch(loadChatMessageItems(STATUS_ALL, this.crtPage, cb));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chatMessages.items.length > 0 || nextProps.chatMessages != this.props.chatMessages) {
      this.closeLoading();
      this.totalPage = nextProps.chatMessages.totalPage;
    }
  }

  goChat(item, index) {
    if (!this.state.showDeleteBtn) {
      let deleteCheked = this.state.deleteCheked;
      deleteCheked[index] = !!!deleteCheked[index];
      this.setState({
        deleteCheked
      });

    } else {
      const {history} = this.props;
      history.push(`/user/viewmessage/${item.id}/${item.groupKey}`);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.loadChatMessage();
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }

  concatUpline() {
    const {history} = this.props;
    history.push('/user/teammanager/up/letter');
  }

  contactDownline() {
    const {history} = this.props;
    history.push('/user/teammanager/down/letter');
  }

  viewDeleteOption() {
    let ids = [];
    const {chatMessages} = this.props;
    for (let index in this.state.deleteCheked) {
      if (this.state.deleteCheked[index]) {
        let item = chatMessages.items[index];
        ids.push(item.id);
      }
    }

    if (!this.state.showDeleteBtn && ids.length > 0) {
      
      confirm("确认删除?", (popup) => {
        
        popup.close();

        chatDelete(ids, (data) => {
          if (data.errorCode == RES_OK_CODE) {
            this.setState({
              deleteCheked: {}
            });
            this.resetPager();
            this.loadChatMessage();
          } else {
            alert(data.msg);
          }
        });
      });



    } else {
      this.setState({
        showDeleteBtn: !this.state.showDeleteBtn
      });
    }
  }

  render() {
    const {chatMessages} = this.props;
    let isAgent = this.props.userModule.user.get('info').isAgent;
    return (
      <div className="page page-chat-messages">
        
        <Header {...this.props}>
          <Back />
          <h3>信息</h3>
          { this.state.showDeleteBtn && <i onClick={this.viewDeleteOption} className="icon-delete"></i> } 
          { !this.state.showDeleteBtn && <i onClick={this.viewDeleteOption} className="text-delete">删除</i> } 
        </Header>
        
        <div className="page-body">
          <div className="chat-messages">
            <div className="wrap">

              {chatMessages.items.length <= 0 && <p className="no-data">暂无信息</p>}

              <InfiniteScroller
                ref={ "scroller" }
                initialLoad={false} 
                pageStart={this.pageStart} 
                loadMore={this.loadMoreItems} 
                hasMore={this.hasMore} 
                loader={ <div key={'loader'} className="loader"></div> }
              >
                {chatMessages.items.map( (item, index) => {
                  return <div onClick={this.goChat.bind(this, item, index)} key={index} className={ "chat-message-item " + ( !this.state.showDeleteBtn ? 'show-delete-btn': '' ) }>
                      {!this.state.showDeleteBtn && <div className="input"><input type="checkbox" checked={ ({true: 'checked', false: ''})[this.state.deleteCheked[index]] } value={this.state.deleteCheked[index]} id={`input-${index}`} /><label htmlFor={`input-${index}`}></label></div> }
                      <div className={"img " + ( item.status == MESSAGE_NOREAD ? 'active': '' )}>
                        { ( item.type == 1 ) && <img src="/misc/images/userCenter/me-read.png" alt="" />}
                        { ( item.type == 0 )  && <img src="/misc/images/userCenter/msg-unread.png" alt="" />}
                      </div>
                      <div className="msg">
                        <h3>{item.title}</h3>
                        <p>{item.messageTime}</p>
                      </div>
                  </div>
                } )}

              </InfiniteScroller>
              
              <div className="btn-wrap">
                <button className="btn btn-orange" onClick={this.concatUpline}>联系上级</button>
                {isAgent && <button className="btn btn-orange" onClick={this.contactDownline}>联系下级</button> }
              </div>
            </div>
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
    chatMessages: userModule.message.get('chatMessageItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(ChatMessagesContainer));