import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';

import {MessageContentContainer} from './MessageContentContainer';
import PersonalMessage from '../components/PersonalMessage';
import SystemMessage from '../components/SystemMessage';
import {loadMessageItems} from '../actions/Message';
import LoadingComponent from '../../../components/LoadingComponent';
import * as MessageConstant from '../constants/MessageConstant';
import InfiniteScroller from 'react-infinite-scroller';

class MessageItemsContainer extends LoadingComponent {

  constructor(props) {
    super(props);
    this.state = {
      type: 'system'
    };
    this.typeIds = {
      user: MessageConstant.MESSAGE_USER,
      system: MessageConstant.MESSAGE_SYSTEM
    };
    this.pageStart = 1;
    this.pageNo = 1;
    this.hasMore = true;
    this.loadMoreItems = this.loadMoreItems.bind(this);
  }

  componentWillMount() {
    const {match, dispatch} = this.props;
    this.state.type = match.params.type;
    dispatch(loadMessageItems(this.typeIds[this.state.type]));
  }

  componentWillReceiveProps(nextProps) {
    let message = nextProps.message;
    let match = nextProps.match;
    let dispatch = nextProps.dispatch;

    if (Object.keys(message.get('apiRes')).length> 0) {
      
      this.closeLoading();
    
      if (this.pageNo > 1 && message.get('apiRes').datas.length <= 0) {
        this.hasMore = false;
      }
      
    }

    if (match.params.type != this.state.type) {
      this.state.type = match.params.type;
      this.openLoading();
      dispatch(loadMessageItems(this.typeIds[this.state.type]));
    }
  }

  loadMoreItems(page) {
    this.pageNo = page;
    const {dispatch} = this.props;
    dispatch(loadMessageItems(this.typeIds[this.state.type], page));
  }

  render() {
  	let messages = this.props.message.get('userMessages');
    let type = this.state.type;
    if (type == 'system') {
      messages = this.props.message.get('sysMessages');
    }
    let messageContent = null;

    if (messages.length) {
      messageContent = messages.map( (message) => {
        if (type == 'user') {
          return <PersonalMessage {...this.props} key={message.id} message={ message } />
        } else {
          return <SystemMessage {...this.props} key={message.id} message={ message } />
        }
      });
    } else {
      messageContent = <p className="special">暂无消息内容</p>;
    }

    return (
      <div className="message-items">
        <InfiniteScroller 
          initialLoad={false} 
          pageStart={this.pageStart} 
          loadMore={this.loadMoreItems} 
          hasMore={this.hasMore} 
          loader={ <div className="loader"></div> }>
          {messageContent}
        </InfiniteScroller>
      </div>
    );
  }
};

MessageItemsContainer.propTypes = {
  message: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {userModule} = state;

  return {
    message: userModule.message
  };
}

export default connect(mapStateToProps)(withRouter(MessageItemsContainer));