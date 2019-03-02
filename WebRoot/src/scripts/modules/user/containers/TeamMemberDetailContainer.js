import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import TabSwitcher from '../components/TabSwitcher';

import {updateTeamMemberRemark, loadTeamMemberOfAgent} from '../actions/UserOrder';
import LoadingComponent from '../../../components/LoadingComponent';
import ChildSalaryDetailContainer from './ChildSalaryDetailContainer';
import {parseQuery} from '../../../utils/url';
import {confirm, alert} from '../../../utils/popup'; 
import {RES_OK_CODE} from '../../../constants/AppConstant';

class TeamMemberDetailContainer extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      item: null
    };

    this.onUpdateRemarkClick = this.onUpdateRemarkClick.bind(this);
  }

  componentDidMount() {
    let item = this.initTeamDetailFromProps(this.props);
    const {dispatch} = this.props;
    if (item) {
      dispatch(loadTeamMemberOfAgent(item.userName, 1, () => {} , 1));  
    }
    
  }

  initTeamDetailFromProps(props) {
    const {match, dispatch ,history, teamAgent, teamAccount} = props;
    let id = match.params.id;
    let item = teamAgent.items.filter(item => item.id == id);
    if (item.length <= 0 ) {
      item = teamAccount.items.filter(item => item.id == id);
    }
    item = item[0];
    if (!item) {
      return history.goBack();
    } else {
      this.setState({
        item
      });
    }

    return item;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.teamAgent != this.props.teamAgent || nextProps.teamAccount != this.props.teamAccount) {
      this.initTeamDetailFromProps(nextProps);
    }
  }

  onUpdateRemarkClick() {
    let remarkRef = null,
      msgRef = null,
      self = this;
    const {item} = this.state;
    const {match} = this.props;
    let html = <div className="remark-update-wrap">
      <textarea ref={ el => remarkRef = el } placeholder="输入备注信息(20字以内)" />
      <p className="msg" ref={ el => msgRef = el }></p>
    </div>;

    confirm(html, "修改备注", (popup) => {
      let remark = remarkRef.value.trim();
      if (remark.length > 0 && remark.length <= 20) {
        updateTeamMemberRemark(match.params.id, item.userName, remark, data => {
          if (data.errorCode == RES_OK_CODE) {
            ReactDOM.findDOMNode(msgRef).textContent = data.msg;
            item.remark = remark;
            self.setState({
              item
            });
            setTimeout(() => {
              popup.close();
            });
          } else {
            ReactDOM.findDOMNode(msgRef).textContent = data.msg;
          }
        });
      } else {
        if (remark.length > 20) {
          ReactDOM.findDOMNode(msgRef).textContent = '备注信息超过限制';  
        } else {
          //
        }
        
      }
    });
  }

  render() {
    let item = this.state.item;
    const {history, location} = this.props;
    console.log(['item', item, location.pathname]);
    if (!item) return null;
    return (
      <div className="page page-team-member-detail">
        <Header {...this.props}>
          <Back />
          <h3>团队管理</h3>
        </Header>
        
        <div className="page-body">
          <div className="summary">
            <div className="wrap">
              <img src="/misc/images/userCenter/head-img.png" alt=""/>
              <h3>{item.userName}</h3>
              <h4>用户组: {item.userType}</h4>
            </div>
          </div>

          <ul>
            <li>
              <label>彩票返点</label>
              <span>{item.betBack}%</span>
            </li>
            <li>
              <label>真人返点</label>
              <span>{item.liveBack}%</span>
            </li>
            <li>
              <label>电子返点</label>
              <span>{item.electronicBack}%</span>
            </li>
            <li>
              <label>体育返点</label>
              <span>{item.sportBack}%</span>
            </li>
            <li>
              <label>捕鱼返点</label>
              <span>{item.fishBack}%</span>
            </li>
            <li>
              <label>团队人数</label>
              <span>{item.teamCount}</span>
            </li>
            <li>
              <label>余额</label>
              <span>{item.userMoney}</span>
            </li>
            <li>
              <label>团队余额</label>
              <span>{item.teamMoney}</span>
            </li>
            <li>
              <label>注册时间</label>
              <span>{item.createTime}</span>
            </li>
            <li>
              <label>最后登陆时间</label>
              <span>{item.lastLoginTime}</span>
            </li>
            <li>
              <label>日薪信息</label>
              <span>{ item.salaryFlag*1 == 0 ? '未签订': `每10000返回${item.salaryMoney}` }</span>
            </li>
            <li>
              <label>备注</label>
              <span>{item.remark}</span>
            </li>
          </ul>

          <div className="links">
            <div className="wrap">
              <div className="link-item" onClick={ () => { history.push(`/user/lotteryorder?username=${item.userName}`) } }>投注记录</div>
              <div className="link-item" onClick={ () => {history.push(`/user/tracehistory?username=${item.userName}`)} }>追号记录</div>
              {item.operateFlag*1 != 0 &&  <div className="link-item" onClick={ () => { history.push(`/user/teammanager/${item.id}/fd`) } }>返点调配</div> } 
              {item.operateFlag*1 != 0 &&  <div className="link-item" onClick={ () => { history.push(`/user/teammanager/${item.id}/salary?from=${location.pathname}`) } }>日薪调配</div> }
              {item.operateFlag*1 != 0 &&  <div className="link-item" onClick={ () => { history.push(`/user/teammanager/${item.id}/letter`) } }>站内信</div> }
              {item.operateFlag*1 != 0 &&  <div className="link-item" onClick={ () =>{ history.push(`/user/teammanager/${item.id}/transfer`) } }>代理转账</div> }
              {item.operateFlag*1 != 0 &&   <div className="link-item" onClick={this.onUpdateRemarkClick}>修改备注</div> }
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
    teamAgent: userModule.order.get('teamMemberOfAgent'),
    teamAccount: userModule.order.get('teamMemberOfAccount'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(TeamMemberDetailContainer));