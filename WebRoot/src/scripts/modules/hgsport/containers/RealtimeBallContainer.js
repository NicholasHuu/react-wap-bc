import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';

import {parseQuery, buildQuery} from '../../../utils/url';
import cache from '../../../utils/cache';

import FilterBar from '../../../components/FilterBar';
import Header from '../../../components/Header';
import Back from '../../../components/Back';
import NavTabs from '../components/NavTabs';
import RealtimeBallGroup from '../components/RealtimeBallGroup';

import BugerMenu from '../../../components/BugerMenu';
import BugerHgMenu from '../components/BugerHgMenu';

import {loadSportBallItems, loadSportBallTypes, resetTempSelectedOrder, loadSportPeiyu,setActiveName} from '../actions/HgActionPart';
import LoadingComponent from '../../../components/LoadingComponent';
import TimeTicker from '../components/TimeTicker';

import {alert} from '../../../utils/popup';

const TIMER_SECOND = 60; // 默认60秒倒计时时间
const TIMER_ROLL_SECOND = 90; // 滚球为90s 倒计时

const DEFAULT_BALL = 'ft';
const DEFAULT_TIME_TYPE = 'today';
const DEFAULT_BALL_TYPE = 'r';

class RealTimeBallContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.ballOptions = {};
    this.onBallChange = this.onBallChange.bind(this);
    this.state = {
      buggerMenuOpened: false,
      loading: true,
      timerSecond: TIMER_SECOND,
      activeName : '',
    };
    this.onProductSelect = this.onProductSelect.bind(this);
    this.onMenuStateChange = this.onMenuStateChange.bind(this);
    this.handleBuggerMenuSelected = this.handleBuggerMenuSelected.bind(this);
    const {match, location, history} = this.props;

    this.timeType = match.path.split('/')[2];
    if (!this.timeType) {
      this.timeType = DEFAULT_TIME_TYPE;
      this.state.timerSecond = TIMER_ROLL_SECOND; // 默认为滚球的倒计时
    }

    let query = parseQuery(location.search);
    this.defaultBall = query.ball || DEFAULT_BALL;
    this.defaultBallType = query.rType || DEFAULT_BALL_TYPE;
    this.ball = this.defaultBall;
    this.ruleLink = this.ruleLink.bind(this);
    this.resetTimerSecond = this.resetTimerSecond.bind(this);
    this.statusMemory = this.statusMemory.bind(this);
    this.goShopCartPage = this.goShopCartPage.bind(this);
    
  }

  resetTimerSecond() {
    const {dispatch, location} = this.props;
    let query = parseQuery(location.search);
    this.openLoading();
    this.setState({
      loading: true
    });
    let _this = this;
    dispatch(loadSportBallTypes(this.ball, this.timeType, query.rType,this.state.activeName, (data) => {
      // _this.setState({
      //   timerSecond: data.datas.refreshTime,
      //   loading: false
      // });
      _this.closeLoading();
    }));
    
  }
  statusMemory(val) {
    const {dispatch} = this.props;
    this.state.activeName = val;
    dispatch(setActiveName(val));
  }
  
  componentDidMount() {
    const {dispatch, location} = this.props;
    this.openLoading();
    dispatch(loadSportBallItems(this.timeType, location, this.ball));
  }

  onProductSelect(product) {
    this.setState({
      buggerMenuOpened: true
    });
  }

  onBallChange(ball) {
    this.state.loading = true;
    this.openLoading();
    const {dispatch, match, history, location} = this.props;
    this.ball = ball;
    let query = parseQuery(location.search);
    dispatch(loadSportBallTypes(ball, this.timeType));
    let path = match.path;
    let to = {
      pathname: path,
      search: `?ball=${ball}`,
    };
    history.push(to);
  }

  handleBuggerMenuSelected(rType) {

    // 把 BugerHgMenu 代码搬运过来
    const {location, history, dispatch} = this.props;
    dispatch(resetTempSelectedOrder());
    let val = "";
    dispatch(setActiveName(val));
    this.openLoading();
    dispatch(loadSportPeiyu(this.timeType, rType));
    let to = Object.assign({}, location);
    let query = parseQuery(to.search);
    query.rType = rType;
    to.key = rType + (new Date().getTime());
    to.search = buildQuery(query);
    history.push(to);

  }

  onMenuStateChange(state) {
    this.state.buggerMenuOpened = state.isOpen;
  }

  // 判断组件是否应该重绘
  shouldComponentUpdate(nextProps, nextState) {
    // 判断 location, apiRes, 
    const {location, hgsport} = nextProps;
    const huangguan = hgsport.huangguan;
    
    const oldLocation = this.props.location;
    const oldHgsport = this.props.hgsport;
    let oldHuangguan = oldHgsport.huangguan;
    let apiRes = huangguan.get('apiRes');
    let oldApiRes = oldHuangguan.get('apiRes');

    // 直接比较内容
    if (JSON.stringify(location) != JSON.stringify(oldLocation)) {
      return true ;
    }
    if (JSON.stringify(apiRes) != JSON.stringify(oldApiRes)) {
      return true;
    }
    if (JSON.stringify(nextState) != JSON.stringify(this.state)) {
      return true;
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {

    const {huangguan} = nextProps.hgsport;
    const {location} = nextProps;
    let query = parseQuery(location.search);

    let apiRes = huangguan.get('apiRes');
    let ballPeiyu = huangguan.get('ballPeiyu');
    let refreshTime = huangguan.get("refreshTime");
    ballPeiyu = ballPeiyu || {};
    const oldBallPeiyu = this.props.hgsport.huangguan.get('ballPeiyu');
    if ( ( ( Object.keys(ballPeiyu).length > 0 && ballPeiyu != oldBallPeiyu ) || apiRes.from == '/sport/odds') && this.props.location == location) {
      this.closeLoading();
      this.setState({
        loading: false,
        timerSecond: refreshTime,
      });
    }

    if (query.ball) {
      this.defaultBall = query.ball;
      this.ball = this.defaultBall;
    }
    
    let _ballTypes = huangguan.get('ballTypes');

    if (_ballTypes.length > 0 ) {
      this.defaultBallType = _ballTypes[0].rType;
    }
    if (query.rType) {
      this.defaultBallType = query.rType;
    }
  }

  // 暂无赛事
  renderNoBetting() {
    return <p className="no-data">{this.state.loading ? <span className="loading-ss">赛事加载中</span> : '暂无赛事'}</p>
  }

  renderMaintain(msg) {
    return <p className="maintain">{msg}</p>
  }

  ruleLink(){
    const { history , match,location} = this.props;
    let query = parseQuery(location.search);
    if (!query.ball) {
      query.ball = 'ft';
    }
    history.push('/hgsport/rule/' + query.ball);
  }

  goShopCartPage() {
    const {history} = this.props;
    const {huangguan} = this.props.hgsport;
    let tempOrderData = cache.get('tempOrderData');
    if (!tempOrderData || tempOrderData.length <= 0 ) {
      alert('暂无记录');
      return ;
    }
    history.push('/hgsport/order/create?rType=' + this.defaultBallType)
  }

  render() {
    const {history} = this.props;
    const {huangguan} = this.props.hgsport;
    let ballPeiyu = huangguan.get('ballPeiyu');
    let isMaintain = huangguan.get('isMaintain');
    let maintainMsg = huangguan.get('maintainMsg');
    let hasPeiyu = false;
    if (ballPeiyu) {
      hasPeiyu = Object.keys(ballPeiyu).length  > 0;
    }

    let _this = this;
    let _ballTypes = huangguan.get('ballTypes'), ballTypes = {};
    for (let ballType of _ballTypes) {
      if (ballType.rType == 're' || ballType.rType == 're_main') {
        continue;
      }
      ballTypes[ballType.rType] = ballType.rName;
    }

    return (
      <div className="hg-page realtime-page">
        <Header className='hgsport-header' {...this.props}>
          <Back backTo={'/sport'}  />
          <div className="filterbal-wrapper">
            <FilterBar className={ _ballTypes.length <= 0 ||  this.timeType == 'roll' ? "center-filter": "" } defaultValue={this.defaultBall} options={huangguan.get('sportBalls')} onChange={this.onBallChange} />
            {_ballTypes.length > 0 && this.timeType != 'roll' && <FilterBar defaultValue={this.defaultBallType} options={ballTypes} onChange={this.handleBuggerMenuSelected} /> }
          </div>
          <i className="shop-cart" onClick={ this.goShopCartPage }>购物车</i>
          <i className="link-rule" onClick={_this.ruleLink}></i>
          <NavTabs event={this.statusMemory} />
        </Header>
      
        <div className="page-body">
          
          {isMaintain ? this.renderMaintain(maintainMsg): ( 
            hasPeiyu && !this.state.loading? <RealtimeBallGroup {...this.props} statusMemory={this.statusMemory} onProductSelect={this.onProductSelect} items={ ballPeiyu } />: this.renderNoBetting()
          )}

          {isMaintain && this.state.loading ? null: <div onClick={this.resetTimerSecond} className="timer-stick-wrap"><TimeTicker start={!this.state.loading} second={this.state.timerSecond} finished={this.resetTimerSecond}/></div>}

        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const {app, userModule, hgsport} = state;
  return {
    app, userModule, hgsport
  };
}

export default connect(mapStateToProps)(withRouter(RealTimeBallContainer));