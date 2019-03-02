import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import PlusNumber from '../../../components/PlusNumber';

import {updateTeamMemberFd} from '../actions/UserOrder';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';

class DeployEarnPercentContainer extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      fd: "0",
      live: "0",
      electronic: "0",
      sport: "0",
      fish: "0",
      item: null
    };

    this.onUpdateFd = this.onUpdateFd.bind(this);
    this.onFdChange = this.onFdChange.bind(this);
    this.onLiveChange = this.onLiveChange.bind(this);
    this.onElectronicChange = this.onElectronicChange.bind(this);
    this.onSportChange = this.onSportChange.bind(this);
    this.onFishChange = this.onFishChange.bind(this);
  }

  componentDidMount() {
    const {match, history, teamAgent, teamAccount} = this.props;
    let id = match.params.id;
    let item = teamAgent.items.filter(item => item.id == id);
    if (item.length <= 0 ) {
      item = teamAccount.items.filter(item => item.id == id);
    }
    item = item[0];
    if (!item) {
      return history.goBack();
    }
    console.log(item);
    this.setState({
      item,
      fd: item.betBack*1 + "",
      live: item.liveBack*1 + "",
      electronic: item.electronicBack*1 + "",
      sport: item.sportBack*1 + "",
      fish: item.fishBack*1 + "",
    });
  }

  onFdChange(el) {
    console.log(el);
    this.setState({
      fd: el,
    });
  }
  onLiveChange(el){
    this.setState({
      live: el,
    });
  }
  onElectronicChange(el){
    this.setState({
      electronic: el,
    });
  }
  onSportChange(el){
    this.setState({
      sport: el,
    });
  }
  onFishChange(el){
    this.setState({
      fish: el,
    });
  }

  onUpdateFd() {
    const {item} = this.state;
    const {history, userModule} = this.props;
    let fd = (this.state.fd*1).toFixed(1);
    let live = (this.state.live*1).toFixed(1);
    let electronic = (this.state.electronic*1).toFixed(1);
    let sport = (this.state.sport*1).toFixed(1);
    let fish = (this.state.fish*1).toFixed(1);
    if (fd < .1 || fd > userModule.user.get('info').backWater.lottery) {
      alert('请输入正确的彩票返点'); return ;
    }
    if (live < .1 || live > userModule.user.get('info').backWater.live) {
      alert('请输入正确的真人返点'); return ;
    }
    if (electronic < .1 || electronic > userModule.user.get('info').backWater.electronic) {
      alert('请输入正确的电子返点'); return ;
    }
    if (sport < .1 || sport > userModule.user.get('info').backWater.sport) {
      alert('请输入正确的体育返点'); return ;
    }
    if (fish < .1 || fish > userModule.user.get('info').backWater.fish) {
      alert('请输入正确的捕鱼返点'); return ;
    }
    updateTeamMemberFd(item.id, item.userName, fd,live,electronic,sport,fish, (data) => {
      if (data.errorCode == RES_OK_CODE) {
        item.betBack = fd;
        item.liveBack = live;
        item.electronicBack = electronic;
        item.sportBack = sport;
        item.fishBack = fish;
        alert('修改成功', (popup) => {
          popup.close();
          history.goBack();
        });
      } else {
        alert(data.msg);
      }
    });
  }
  render() {
    const {item} = this.state;
    const {userModule} = this.props;
    let maxWaterBack = userModule.user.get('info').backWater.lottery;
    let maxLiveBack = userModule.user.get('info').backWater.live;
    let maxElectronicBack = userModule.user.get('info').backWater.electronic;
    let maxSportBack = userModule.user.get('info').backWater.sport;
    let maxFishBack = userModule.user.get('info').backWater.fish;
    if (!item) return null;
    return (
      <div className="page page-deploy-earn-percent">
        <Header {...this.props}>
          <Back />
          <h3>返点详情</h3>
        </Header>
        <div className="page-body">
          <img src="/misc/images/userCenter/icon1.png" alt=""/>
          <h4>用户名</h4>  
          <h3>{item.userName}</h3>
          {/*<h4>当前返点</h4>
          <h3>彩票：{item.betBack}%</h3>
          <h3>真人：{item.liveBack}%</h3>
          <h3>电子：{item.electronicBack}%</h3>
          <h3>体育：{item.sportBack}%</h3>
          <h3>捕鱼：{item.fishBack}%</h3>*/}

          <div className="onChange"><span>彩票返点：</span><PlusNumber name="fd" disable={'sub'} onChange={this.onFdChange} value={this.state.fd} min={.1} max={maxWaterBack}></PlusNumber></div>
          <div className="onChange"><span>真人返点：</span><PlusNumber name="live" disable={'sub'} onChange={this.onLiveChange} value={this.state.live} min={.1} max={maxLiveBack}></PlusNumber></div>
          <div className="onChange"><span>电子返点：</span><PlusNumber name="electronic" disable={'sub'} onChange={this.onElectronicChange} value={this.state.electronic} min={.1} max={maxElectronicBack}></PlusNumber></div>
          <div className="onChange"><span>体育返点：</span><PlusNumber name="sport" disable={'sub'} onChange={this.onSportChange} value={this.state.sport} min={.1} max={maxSportBack}></PlusNumber></div>
          <div className="onChange"><span>捕鱼返点：</span><PlusNumber name="fish" disable={'sub'} onChange={this.onFishChange} value={this.state.fish} min={.1} max={maxFishBack}></PlusNumber></div>

          <button className="btn btn-orange" onClick={this.onUpdateFd}>确认</button>

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

export default withRouter(connect(mapStateToProps)(DeployEarnPercentContainer));