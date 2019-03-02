import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route} from 'react-router-dom';
import InfiniteScroll  from 'react-infinite-scroller';

import {loadAgentMembers} from '../actions/AgentAction';
import Header from '../../../components/Header';
import Back from '../../../components/Back';

import MemberRow from '../components/MemberRow';

class MemberContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
      hasMore: true
    };
    this.pageSize = 10;
    this.loadMembers = this.loadMembers.bind(this);
    this.loadMoreMembers = this.loadMoreMembers.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {apiRes} = nextProps;
    if (apiRes.msg) {
      if (Object.prototype.toString.apply(apiRes.datas) == '[object Array]' && apiRes.datas.length > 0) {
        this.state.hasMore = true;
      } else {
        this.state.hasMore = false;
      }
    }
  }

  loadMembers(pageNo, pageSize) {
    const {dispatch} = this.props;
    dispatch(loadAgentMembers(pageNo, pageSize));
    this.state.pageNo = pageNo;
  }

  loadMoreMembers(page) {
    this.loadMembers(page, this.pageSize);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.members != this.props.members || nextProps.apiRes != this.props.apiRes) {
      return true;
    }
    if (nextState != this.state) {
      return true;
    }
    return false;
  }

  render() {
    const {members} = this.props;
    return (
      <div>
        <Header {...this.props} className="agentreport-header">
          <Back backTo={'/agentreport'} />
          <h3>旗下会员</h3>
        </Header>
        <div className="agentreport-con">
          <InfiniteScroll 
            pageStart={0}
            loadMore={this.loadMoreMembers}
            hasMore={this.state.hasMore}
            initialLoad={true}
            loader={ <div className="loader">加载中</div> }>
            {members.length > 0 && members.map((member, index) => {
              index = index + 1;
              return <MemberRow key={index} index={ index < 10 ? '0'+index: index+'' } member={member}/>    
            })}
            {members.length <= 0 && <p className="no-member">暂无下级用户</p> }
          </InfiniteScroll>
        </div>
      </div>
    );
  }
};

function mapStateToProps({agent, userModule, app}) {
  return {
    members: agent.agent.get('members'),
    apiRes: agent.agent.get('apiRes'),
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(MemberContainer));