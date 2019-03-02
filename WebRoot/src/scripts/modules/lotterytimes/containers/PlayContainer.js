import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import Popup from 'react-popup';

import {parseQuery, buildQuery} from '../../../utils/url';
import {alert, confirm} from '../../../utils/popup';
import PS from '../components/PankouSwitcher';
import QuickView from '../components/OpenHistoryQuickView';
import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';
import {getDocumentHeight} from '../../../utils/dom';
import NumberBoard from '../components/NumberBoard';
import {formatTimer}  from '../../../utils/datetime';
import {loadLotteryMain, 
  loadLotteryDetail as actionLLD, 
  loadOpenResult, 
  saveOrder,
  cleanOrder,
  hideViewYl,
  loadTinyUserResource,
  loadOpenInfo} from '../actions/LotteryAction';
import LoadingComponent from '../../../components/LoadingComponent';
import HelperMenu from '../components/HelperMenu';
import LotteryTimer from '../components/LotteryTimer';
import {randOrderFunction, getSummaryTotal, rxShouldRendeAndDefaultPos} from '../utils/Lottery';
import RandomBtns from '../components/RandomBtns';
import TinyUserPanel from '../components/TinyUserPanel';
import {loadUserBalance, userLogout} from '../../user/actions/User';
import ToggleBtn from '../../../components/ToggleBtn';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {prizeText} from '../utils/tool';

const DEFAULT_LOTTERY = 'cqssc';
const DEFAULT_PANKOU = 'yxzx';
const DEFAULT_PANKOU_NAME = '一星直选';

import {BONUS_GAOFAN, BONUS_GAOJIANG} from '../constants/LotteryConstant';


class PlayContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.activeLottery = '';
    this.activePankou = '';
    
    const {location} = this.props;
    this.query = parseQuery(location.search);

    this.quickViewOpened = false;

    this.state = {
      pankous: [], // 盘口列表
      openNums: [], // 历史开奖号码
      crtInfo: {}, // 当前开奖信息
      clean: false, // 是否清除选中号码
      viewPS: false,
      viewHelper: false,
      hiddingQuickView: true,
      activeLottery: this.query.lottery, // 彩票
      activePankou: this.query.pankou, // 盘口
      activeGroup: this.query.group, // 盘口所属组
      modeActions: {
        win: '',
        value: 0,
        mode: '',
        bs: 1,
      },
      orderSummary: {

      },
      randedNums: [],
      numValue: 0
    };

    this.quickViewHeight = 0;

    // 作用域绑定
    this.onCrtPankouClick = this.onCrtPankouClick.bind(this);
    this.onPankouSelected = this.onPankouSelected.bind(this);
    this.renderNumberBoard = this.renderNumberBoard.bind(this);
    this.onNumberSelect = this.onNumberSelect.bind(this);
    this.dragStartQuickView = this.dragStartQuickView.bind(this);
    this.dragMoveQuickView = this.dragMoveQuickView.bind(this);
    this.drageEndQuickView = this.drageEndQuickView.bind(this);
    this.disableDrag = this.disableDrag.bind(this);
    this.toggleHelperMenu = this.toggleHelperMenu.bind(this);
    this.showTipHow = this.showTipHow.bind(this);
    this.cleanNumbers = this.cleanNumbers.bind(this);
    this.onTimerFinishCallback = this.onTimerFinishCallback.bind(this);
    this.okBtnClick = this.okBtnClick.bind(this);
    this.randOrder = this.randOrder.bind(this);
    this.onQuickViewClick = this.onQuickViewClick.bind(this);
    this.toggleOpenHistoryQuickView = this.toggleOpenHistoryQuickView.bind(this);
    this.onRandomBtnClick = this.onRandomBtnClick.bind(this);
    this.toggleYlView = this.toggleYlView.bind(this);
    this.onLogoutHandler = this.onLogoutHandler.bind(this);
    this.countNumValue = this.countNumValue.bind(this);

  }

  toggleOpenHistoryQuickView() {

    let maxTop = this.dragStopTop();
    let maxBottom = this.dragStopBottom();

    let dragEl = ReactDOM.findDOMNode(this.refs.dragEl);
    let numbersWrapEl = ReactDOM.findDOMNode(this.refs.numbersWrap);
    
    // 动画效果
    dragEl.style.transition = 'all ease .3s';
    numbersWrapEl.style.transition = 'all ease .3s';
  
    if (this.quickViewOpened) {
      dragEl.style.position = 'absolute';
      dragEl.style.top = maxTop + 'px';

      numbersWrapEl.style.position = 'absolute';
      numbersWrapEl.style.top = maxTop + 'px';

    } else {
      dragEl.style.position = 'absolute';
      dragEl.style.top = maxBottom + 'px';

      numbersWrapEl.style.position = 'absolute';
      numbersWrapEl.style.top = maxBottom + 'px';
    }
    
    // 取消动画效果
    setTimeout(() => {
      dragEl.style.transition = '';
      numbersWrapEl.style.transition = '';
    }, 2000);

    this.quickViewOpened = !this.quickViewOpened;
  }

  showTipHow() {
    let gameDetails = this.props.lottery.get('gameDetails');
    let configDetail = this.getActiveGroupConfigData(this.props, this.state.activeLottery, this.state.activeGroup);
    if (configDetail.detail) {
      alert(configDetail.detail.wfsm);
    }
  }

  cleanNumbers() {
    let self = this;
    this.setState({
      clean: true,
      orderSummary: {}, // 
    }, () => {
      self.state.clean = false;
    });
  }

  toggleHelperMenu(forceHide = false) {
    let viewHelper = !this.state.viewHelper;
    
    if (Object.prototype.toString.apply(forceHide) != '[object Boolean]') {
      forceHide = false;
    }

    if (forceHide) {
      viewHelper = false;
    }

    // 已经是隐藏状态则不做处理
    if (forceHide == true && this.state.viewHelper == false) {
      return ;
    }

    let numbersWrapEl = ReactDOM.findDOMNode(this.refs.numbersWrap);
    let sliderMenuEl = ReactDOM.findDOMNode(this.refs.sliderMenu);
    let footWrap = numbersWrapEl.getElementsByClassName('foot-wrap');
    let pageInnerWrapEl = ReactDOM.findDOMNode(this.refs.pageInnerWrap);
    let tinyUserPanelEl = sliderMenuEl.getElementsByClassName('tiny-user-panel')[0];
    if (tinyUserPanelEl) {
      tinyUserPanelEl.style.height = document.body.offsetHeight + 'px';
      tinyUserPanelEl.style.overflow = 'auto';
    }

    if (footWrap.length > 0) {
      footWrap = footWrap[0];
    }

    if (viewHelper) {
      bodyClass('view-slide-menu');

      if (footWrap) {

        let footWrapHeight = footWrap.offsetHeight;
        let bodyHeight = document.body.offsetHeight;

        footWrap.style.position = 'absolute';
        footWrap.style.top = ( bodyHeight - footWrapHeight - numbersWrapEl.offsetTop) + 'px';

        sliderMenuEl.style.height = bodyHeight + 'px';
        sliderMenuEl.style['overflow-y'] = 'hidden';
        sliderMenuEl.style.display = 'block';

        pageInnerWrapEl.style.height = bodyHeight + 'px';
        pageInnerWrapEl.style.overflow = 'hidden';

      }

    } else {
      resetBodyClass('view-slide-menu');
      pageInnerWrapEl.style.height = 'inherit';
      pageInnerWrapEl.style.overflow = 'inherit';

      sliderMenuEl.style.height = 'inherit';
      sliderMenuEl.style['overflow-y'] = 'inherit';

      setTimeout(() => {
        footWrap.style.position = 'fixed';
        footWrap.style.top = 'auto';
        sliderMenuEl.style.display = 'none';
      }, 500);

    }
    this.setState({
      viewHelper
    });
  }

  loadGameDetail() {
    const {activeLottery, activeGroup} = this.state;
    const {dispatch} = this.props;
    if (activeLottery) {
      dispatch(actionLLD(activeLottery));
    }
  }

  onLogoutHandler() {
    const {dispatch, history} = this.props;
    let _this = this;
    _this.openLoading();
    dispatch(userLogout((data) => {
      _this.closeLoading();
      if (data.errorCode == RES_OK_CODE) {
        window.location.href = "/";
      } else {
        alert(data.msg);
      }
    }));
  }

  componentWillMount() {
    resetBodyClass();
    bodyClass('tlottery');
    let self = this;
    const {dispatch} = this.props;
    this.initDataFromProps(this.props, () => {
      
    });
    self.loadGameDetail();
    dispatch(loadLotteryMain());
    dispatch(loadTinyUserResource());
    dispatch(loadUserBalance());
    // 加载开奖号码
    if (this.state.activeLottery) {
      dispatch(loadOpenResult(this.state.activeLottery));
      dispatch(loadOpenInfo(this.state.activeLottery, this.state.activeGroup));
    }
  } 

  componentWillUnmount() {
    resetBodyClass('tlottery');
  }

  renderCrtPankou() {
    let pankous = this.state.pankous;
    let key = this.state.activePankou;
    let group = this.state.activeGroup;
    let crtPankou = pankous.filter( p => p.titleCode ==  key );
    let crtGroup = crtPankou.length > 0 && crtPankou[0].list.filter( p => p.gameCode == group);
    let pkName = crtGroup.length > 0 ? crtGroup[0].currentGameName: DEFAULT_PANKOU_NAME;
    if (pkName.length > 4) {
      pkName = pkName.substr(0, 4) + '...';
    }
    return <p><span onClick={this.onCrtPankouClick}>{pkName}<i className={"arrow-down " + (this.state.viewPS ? 'view': '') }></i></span></p>
  }

  renderCrtLottery() {
    let {lottery} = this.props;

    return <h3>{lottery.get('gameDetails').lotteryName}</h3>

  }

  onCrtPankouClick() {
    this.setState({
      viewPS: !this.state.viewPS
    });
  }

  onPankouSelected(pankou, group) {
    const {dispatch} = this.props;
    
    this.onCrtPankouClick();
    this.cleanNumbers();

    const {history} = this.props;
    let path = history.location.pathname;
    history.push({
      pathname: path,
      search: buildQuery({
        lottery: this.state.activeLottery,
        pankou: pankou,
        group: group
      })
    });

  }

  componentWillReceiveProps(nextProps) {
    const {location} = nextProps;
    let cb = () => {}, self = this;
    // 玩法发生了变化
    if (this.props.location != location || Object.keys(nextProps.lottery.get('gameDetails')) <= 0 ) {
      // cb = () => {
      //   self.loadGameDetail();
      // };
      this.initDataFromProps(nextProps, cb);
    }
    if (this.props.lottery !== nextProps.lottery) {
      this.initDataFromProps(nextProps, cb);  
    }
    
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }
    if (nextProps.userModule !== this.props.userModule) {
      return true;
    }
    return false;
  }

  getActiveGroupConfigData(props, activeLottery, activeGroup) {
    let lottery = props.lottery.get('config')[activeLottery];
    if (lottery && lottery.gameList.length) {
      for (let item of lottery.gameList) {
        for (let iitem of  item.list) {
          if (iitem.gameCode == activeGroup) {
            return iitem;
          }
        }
      }
    }

    return false;
    
  }

  initDataFromProps(props, cb = () => {}) {
    const {location} = props;
    let query = parseQuery(location.search);
    let activePankou = query.pankou || this.state.activePankou;
    let activeGroup = query.group  || this.state.activeGroup;
    let lottery = props.lottery.get('config')[this.state.activeLottery];
    let crtInfo = props.lottery.get('crtInfo');
    let self = this;
    if (lottery && lottery.gameList && lottery.gameList.length > 0 ) {
      activePankou = activePankou || lottery.gameList[0]['titleCode'];
      activeGroup = activeGroup || lottery.gameList[0]['list'][0]['gameCode'];

      // 价格/奖金模式
      let modeActions = Object.assign({}, this.state.modeActions);
      if (props.lottery.get('gameDetails').unit) {
        modeActions.mode = props.lottery.get('gameDetails').unit[0].type;
        modeActions.value = props.lottery.get('gameDetails').unit[0].value;
        let detailData = self.getActiveGroupConfigData(props, self.state.activeLottery, activeGroup);
        modeActions.win = detailData.bonus[0].bonusType;
      }
      
      this.setState({
        pankous: lottery.gameList,
        openNums: crtInfo.openNums,
        activePankou: activePankou,
        activeGroup: activeGroup,
        modeActions,
        crtInfo: {
          msg: crtInfo.msg,
          qs: crtInfo.crtQs,
          isClose: crtInfo.isClose,
          closeDes: crtInfo.closeDes,
          leftSecond: crtInfo.leftSecond
        }
      }, () => {
        cb();
      });
    }
    this.closeLoading();
  }

  onNumberSelect(numbers) {
    let lottery = this.state.activeLottery;
    let gameCode = this.state.activeGroup;
    let summary = getSummaryTotal(lottery, gameCode, numbers.clone());
    this.setState({
      orderSummary: summary
    });
  }

  crtPankouHasYl() {
    const {lottery} = this.props;
    const {activePankou, activeGroup, activeLottery} = this.state;
    let configDetail = this.getActiveGroupConfigData(this.props, activeLottery, activeGroup);
    let hasYl = configDetail.sfyl*1 == 1;
    return hasYl == 1;
  }

  renderNumberBoard() {
    const {lottery} = this.props;
    const {activePankou, activeGroup, activeLottery} = this.state;
    let configDetail = this.getActiveGroupConfigData(this.props, activeLottery, activeGroup);
    if (lottery) {
      let crtLottery = lottery.get('config')[activeLottery];
      if (crtLottery) {
        let nums = [];
        for (let gameItem of crtLottery['gameList']) {
          if (gameItem['titleCode'] == activePankou) {
            for (let ballItem of gameItem['list']) {
              if (ballItem['gameCode'] == activeGroup) {
                nums = ballItem['balls'];
              }
            }
          }
        }

        if (crtLottery && nums.length > 0) {

          let hasYl = configDetail.detail.controlYl*1 == 1;
          let yl = lottery.get('crtInfo').yl;
          
          let viewYl = false;
          if (lottery.get('viewYl')) {
            viewYl = true;
          } else if (hasYl) {
            viewYl = true;
          }

          return <NumberBoard 
            viewQuick={configDetail.detail && configDetail.detail.fastButton == 1 } 
            viewYl={ viewYl } 
            clean={this.state.clean} 
            lottery={activeLottery}
            selectedNums={this.state.randedNums}
            gameCode={activeGroup}
            yl={yl}
            onSelected={this.onNumberSelect} 
            numbers={nums} />;
        }
      }
      
    }
    return null;
    
  }

  // 检查拖动是否可以继续往上拖
  checkDragCanMoveToTop(crtTop) {
    let stopTop = this.dragStopTop();
    if (crtTop <= stopTop) {
      return false;
    }
    return true;
  }

  checkDragCanMoveToBottom(crtTop) {
    let stopBottom = this.dragStopBottom();
    if (crtTop >= stopBottom) {
      return false;
    }
    return true;
  }

  dragStopBottom() {
    let quickViewEl = ReactDOM.findDOMNode(this.refs.quickView);
    return quickViewEl.clientHeight + this.dragStopTop()
  }

  dragStopTop() {
    let siteHeaderEl = ReactDOM.findDOMNode(this.refs.siteHeader);
    let lotteryOpenInfoEl = ReactDOM.findDOMNode(this.refs.lotteryOpenInfo);
    return siteHeaderEl.clientHeight + lotteryOpenInfoEl.clientHeight;
  }

  dragStartQuickView(event) {
    let numbersWrapEl = ReactDOM.findDOMNode(this.refs.numbersWrap),
      numbersWrapStyle = window.getComputedStyle(numbersWrapEl);

    let dragEl = ReactDOM.findDOMNode(this.refs.dragEl),
      dragElStyle = window.getComputedStyle(dragEl);

    this.dragSourceData = {
      dragEl: {
        top: dragElStyle.getPropertyValue('top').replace('px', '')*1,
      },
      numbersWrap: {
        top: numbersWrapStyle.getPropertyValue('top').replace('px', '')*1,
      },
      pos: event.nativeEvent.touches[0],
    };
  }

  dragMoveQuickView(event) {
    let numbersWrapEl = ReactDOM.findDOMNode(this.refs.numbersWrap);
    let dragEl = ReactDOM.findDOMNode(this.refs.dragEl);
    let distPos = event.nativeEvent.touches[0];
    let moveDist = distPos['pageY'] - this.dragSourceData['pos']['pageY'];

    let dragElToTop = this.dragSourceData['dragEl']['top'] + moveDist;

    if (!this.checkDragCanMoveToTop(dragElToTop)) {
      // 检查元素是否可以继续拖动
      // 如果不能继续拖动 则设置position: absolute; 这样让页面自由滚动
      let stopTop = this.dragStopTop();
      numbersWrapEl.style.position = 'absolute';
      numbersWrapEl.style.top = `${stopTop}px`;
      dragEl.style.top = `${stopTop}px`;
    }  else if (!this.checkDragCanMoveToBottom(dragElToTop)) {
      // 检查元素是否可以继续向下滑动
      // 如果不能继续滑动在则不做任何处理
      event.preventDefault();
      event.stopPropagation();
    } else {
      let numbersWrapToTop = this.dragSourceData['dragEl']['top'] + moveDist;
      
      numbersWrapEl.style.top = `${numbersWrapToTop}px`;
      numbersWrapEl.style.position = 'fixed';

      dragEl.style.top = `${dragElToTop}px`;
      dragEl.style.position = 'fixed';

      event.preventDefault();
      event.stopPropagation();
    }

  }

  drageEndQuickView() {
    // 触摸结束
  }

  disableDrag(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onTimerFinishCallback() {
    const {dispatch, lottery} = this.props;
    const {activeLottery, activeGroup} = this.state;
    let crtInfo = lottery.get('crtInfo');
    if (crtInfo.isClose == 1) {
      return ;
    }
    let id =alert(`${crtInfo['crtFullQs']}已截至,清注意期数变化`, popup => {
      popup.close();
    });
    setTimeout( () => {
      Popup.close(id);
    }, 3000 );
    dispatch(loadOpenInfo(activeLottery, activeGroup));
  }

  bonusTypeSelect(win) {
    let modeActions = Object.assign({}, this.state.modeActions);
    modeActions.win = win;
    this.setState({
      modeActions
    });
  }

  modeSelect(unit) {
    let modeActions = Object.assign({}, this.state.modeActions);
    modeActions.mode = unit.type;
    modeActions.value = unit.value;
    this.setState({
      modeActions
    });
  }
  countNumValue(){
  	let configDetail = this.getActiveGroupConfigData(this.props, this.state.activeLottery, this.state.activeGroup);
  	this.state.numValue = prizeText(configDetail,this.state.modeActions.win,this.state.orderSummary,this.state.modeActions.mode);
  }
  bsChange() {
    let bs = this.refs.bs.value*1;
    let configDetail = this.getActiveGroupConfigData(this.props, this.state.activeLottery, this.state.activeGroup);
    if (isNaN(bs)) {
      return ;
    }
    if (bs > configDetail.multipleMax) {
      bs = configDetail.multipleMax;
    }

    let modeActions = Object.assign({}, this.state.modeActions);
    modeActions.bs = bs;
    this.setState({
      modeActions
    });
  }

  okBtnClick() {
    const {activeGroup, activeLottery, orderSummary, modeActions, crtInfo} = this.state;
    const {history, dispatch, lottery, match} = this.props;

    if (crtInfo.msg) {
      return alert(crtInfo.msg);
    }

    let unit = lottery.get('gameDetails').unit.filter( unit => unit.type == modeActions.mode );

    if (orderSummary.length > 0) {
      // lottery, gameCode, num, zhushu, bs, unit,bonusType
      dispatch(saveOrder(activeLottery, 
        activeGroup, 
        orderSummary.format, 
        orderSummary.length, 
        modeActions.bs,
        unit[0],
        modeActions.win
      ));

      history.push(`/lotterytimes/confirm`);
    } else {
      let selectedOrder = lottery.get('selectedOrder');
      if (selectedOrder.length > 0) {
        history.push(`/lotterytimes/confirm`);
      }
    }
  }

  backLink() {
      const {history, lottery, dispatch} = this.props;
      let selectedOrder = lottery.get('selectedOrder');
      let self = this;

      let cleanOrSimpleBack = () => {
        if (selectedOrder.length > 0) {
          confirm("退出该页面将会清空购彩篮里的数据,是否退出?", '提示',  (popup) => {
            popup.close();
            dispatch(cleanOrder());
            history.push('/lotterytimes');
          });
        } else {
          history.push('/lotterytimes');
        }
      }
      return <a onClick={cleanOrSimpleBack}></a>
  }

  randOrder(ret = false) {
    const {lottery, dispatch} = this.props;
    const {activeLottery, activeGroup} = this.state;
    let num = randOrderFunction(activeLottery, activeGroup)();
    if (ret) return num;
    this.setState({
      randedNums: num
    });
  }

  onRandomBtnClick(count) {
    let nums = [], tnums = [];
    const {lottery, dispatch, history} = this.props;
    const {activeGroup, activeLottery, modeActions} = this.state;
    let unit = lottery.get('gameDetails').unit.filter( unit => unit.type == modeActions.mode );

    for (let i = 0; i < count; i++) {
      let num = this.randOrder(true);
      let [shouldRende, _] = rxShouldRendeAndDefaultPos(activeGroup);
      if (num.length == 1 && typeof num[0] == 'object') {
        num = num[0];
      } else {
        if (shouldRende) {
          num = [num[0], num[1][0]];
        }
      }
      let summary = getSummaryTotal(activeLottery, activeGroup, num);
      
      dispatch(saveOrder(activeLottery, 
        activeGroup, 
        summary.format, 
        summary.length, 
        modeActions.bs,
        unit[0],
        modeActions.win
      ));
    }

    history.push(`/lotterytimes/confirm`);

  }

  onQuickViewClick() {
    const {history} = this.props;
    const {activeLottery} = this.state;
    history.push(`/lotterytimes/${activeLottery}/trend`);
  }

  toggleYlView() {
    const {dispatch} = this.props;
    dispatch(hideViewYl());
  }

  render() {
    
    let winHeight = getDocumentHeight();
    if (!this.state.activePankou) {
      return null;
    }

    let gameDetails = this.props.lottery.get('gameDetails');	
    let configDetail = this.getActiveGroupConfigData(this.props, this.state.activeLottery, this.state.activeGroup);
    let prizeNum = prizeText(configDetail,this.state.modeActions,this.state.orderSummary);
    let price = () => {
      let p = this.state.modeActions.bs * this.state.modeActions.value * this.state.orderSummary.length;
      if (isNaN(p)) return new Number(0).toFixed(2);
      return p.toFixed(2);
    }

    let hasGaofan = () => {
      let gaofan = ( configDetail.bonus || []).filter(item => item.bonusType == BONUS_GAOFAN);
      return gaofan.length == 1;  
    };

    const {history, match, lottery, userModule} = this.props;

    return ( <div className="page tlottery-play-page">

      <div ref="sliderMenu" className={ "slider-menu " + ( this.state.viewHelper ? 'active': '' ) }>
        <div className="wrapper">
          <i className="toggle-icon" onClick={ this.toggleHelperMenu }></i>
          <TinyUserPanel onLogout={this.onLogoutHandler} user={userModule.user} menus={lottery.get('tinyUserResource')}/>
        </div>
      </div>

      <div ref="pageInnerWrap" onClick={ () => { this.toggleHelperMenu(true) } } className={"wrapper " + ( this.state.viewHelper ? 'active': '') }>

        <Header ref="siteHeader" {...this.props} className={"tlottery-header"}>
          {this.backLink()}
          {this.renderCrtPankou()}
          {this.renderCrtLottery()}
          <i className="icon cart" onClick={ () => { history.push('/lotterytimes/confirm') }}></i>
          <i className="icon helper" onClick={this.toggleHelperMenu}></i>
        </Header>

        {false && <div className="helpermenu-wrap">
          <HelperMenu history={this.props.history} onClick={this.toggleHelperMenu} dispatch={this.props.dispatch} links={configDetail.zhushouList} match={this.props.match} lottery={this.state.activeLottery} pankou={this.state.activePankou} />
        </div> }

        <div className={"ps-wrap " + (this.state.viewPS ? 'view': '' ) }>
          <PS pankous={this.state.pankous} activeGroup={this.state.activeGroup} activePankou={this.state.activePankou} onClick={this.onPankouSelected}></PS>
          <div onClick={this.onCrtPankouClick} className="view-bg" style={ {height:  (this.state.viewPS ? winHeight: 0) } }></div>
        </div>

        <div className="page-body">
          <h3 ref="lotteryOpenInfo" className="lottery-open-info">{!this.state.crtInfo.isClose && <span>距{this.state.crtInfo.qs}期截止<span style={ {margin: '0px .3rem'} }>:</span></span> }
            <span className="timer">{this.state.crtInfo.msg ? this.state.crtInfo.msg : <LotteryTimer isClose={this.state.crtInfo.isClose} closeDes={this.state.crtInfo.closeDes} second={this.state.crtInfo.leftSecond} onFinish={this.onTimerFinishCallback}/> }</span></h3>
          <QuickView onClick={this.onQuickViewClick} ref="quickView" info={this.state} lottery={this.state.activeLottery} onTouchMove={this.disableDrag} onTouchStart={this.disableDrag} historyNums={this.state.openNums} crtInfo={this.state.crtInfo}></QuickView>
          
          <div className="drag-el" onClick={ this.toggleOpenHistoryQuickView } ref="dragEl"><i className="arrow-down"></i></div>

          <div ref="numbersWrap" className="numbers-wrap" 
                onTouchStart={this.dragStartQuickView} 
                onTouchMove={this.dragMoveQuickView}
                onTouchEnd={this.drageEndQuickView}>
            
            <div className="wrap">
              <p className="tip">
              <span style={ {display: 'inline-block', width: '1rem'} }></span>
              奖金：{prizeNum}
              
                {this.crtPankouHasYl() && <span className="toggle-view-yl">遗漏<ToggleBtn onChange={this.toggleYlView}/></span> }
              </p>
              <div className="shake-el">
                <p className="shake-flag" onClick={ () => this.randOrder()}>
                  <span>摇一摇</span>
                  <i className="icon-shake"></i>    
                </p>            
                <p className="tip-how" onClick={this.showTipHow}>玩法说明</p>
              </div>
              
              {this.renderNumberBoard()}
            </div>
              
            <div className="foot-wrap">

              <div className="mode-actions">
                <div className="win-types">
                  <ul className="clearfix">
                    <li className={ ({false: '', true: 'two-width'})[!hasGaofan()]  + ' ' + ( this.state.modeActions.win == BONUS_GAOJIANG ? 'active': '' ) } onClick={this.bonusTypeSelect.bind(this, BONUS_GAOJIANG)}>高奖</li>
                    { hasGaofan() && <li className={this.state.modeActions.win == BONUS_GAOFAN ? 'active': ''} onClick={this.bonusTypeSelect.bind(this, BONUS_GAOFAN)}>高返</li> }
                  </ul>
                </div>
                <div className="mode-types">
                  <ul className="clearfix">
                    {gameDetails.unit && gameDetails.unit.map( (unit, index) => {
                      return (
                        <li key={index} className={ this.state.modeActions.mode == unit.type ? 'active': '' } onClick={this.modeSelect.bind(this, unit)}>{unit.name}</li>
                      );
                    } )}
                  </ul>
                </div>
                <div className="bs-input">
                  <input type="number" ref="bs" value={this.state.modeActions.bs}  onChange={this.bsChange.bind(this)}/>倍
                </div>
              </div>
        
              <div className="actions">
                {this.state.orderSummary.length > 0 ? <button className="btn-random" onClick={this.cleanNumbers}>清除</button>: <RandomBtns onRandom={this.onRandomBtnClick}/>}
                <p className="select-summary">共{this.state.orderSummary.length ? this.state.orderSummary.length: 0}注 <span className="orange">{price()}元</span></p>
                <button className="btn-submit" onClick={ this.okBtnClick }>确定</button>
              </div>

            </div>

          </div>
          
        </div>
      </div>

    </div> ); 
  }

};

function mapStateToProps({lotteryTimes, userModule}) {
  return {
    lottery: lotteryTimes.lottery,
    userModule: userModule,
  };
}

export default withRouter(connect(mapStateToProps)(PlayContainer));