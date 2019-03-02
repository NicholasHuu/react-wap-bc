import React , { Component , PropTypes} from "react";
import ReactDom from 'react-dom';
import {connect} from "react-redux";
import {withRouter} from 'react-router';
import Swiper from 'swiper';

import {Map, List} from 'immutable';
import Header from "../../../components/Header";
import Back from "../../../components/Back";
import FilterBar from "../../../components/FilterBar";
import BugerMenu from "../../../components/BugerMenu";
import BetCenterNav from "../components/BetCenter/BetCenterNav";
import BetHandicapMenu from "../components/BetCenter/BetHandicapMenu";
import BetCenterSureBtn from "../components/BetCenter/BetCenterSureBtn";
import TableContainer from "./TableContainer";
import {getLotteryGames, 
  loadPlatformPankou,
  tempSaveSelectedPeiyu,
  getLmOrder,
  getMultiGroupOrder,
  getGroupOrder,
  loadPlantformPeiyu} from '../actions/LotteryAction';
import {buildQuery, parseQuery} from '../../../utils/url';
import BuggerIcon from '../../../components/BuggerIcon';
import PankouSwitchBoard from '../components/BetCenter/PankouSwitchBoard';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import {serializeContent, unserializeContent} from '../utils/helper';
import LoadingComponent from '../../../components/LoadingComponent';
import BetCenterContainer from './BetCenterContainer';
import BetCenterOpenContainer from './BetCenterOpenContainer';
import BetCenterOrderContainer from './BetCenterOrderContainer';
import BetCenterRuleContainer from './BetCenterRuleContainer';
import {getDocumentHeight} from '../../../utils/dom';

class LotterySwiperContainer extends LoadingComponent {
  
  constructor(props){
    super(props);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.onPankouSwichBoard = this.onPankouSwichBoard.bind(this);
    this.onPlatformClick = this.onPlatformClick.bind(this);
    this.onPankouChange = this.onPankouChange.bind(this);
    this.onBetCenterNavSwitch = this.onBetCenterNavSwitch.bind(this);

    this.state = {
      buggerMenuIsOpen: false,
      resetSelectedItem: false,
      selectedPeiyu: {},
      fenpanSecond: 0,
      kaijiangSecond: 0,
      fenpanZhong: false,
      kaijiangZhong: false,
      showSwitchBoard: false,
      swiperIndex: 0,
      betBtnOpacity: 1,
    };
    this.pankou = {};
    this.subpankou = {};
    this.initDataTimeout = null;
    this.swiper = null;
  }

  initData() {
    const {dispatch, match, location} = this.props;
    dispatch(getLotteryGames());
    dispatch(loadPlatformPankou(match.params.gameCode, location));
  }

  componentWillUnmount() {
    if (this.swiper) {
      this.swiper.destroy();
      this.swiper = null;
    }
  }

  componentDidMount() {
    this.openLoading();
    this.initData();

    this.setupSwiper();
  }

  setupSwiper() {
    if (this.swiper) {
      this.swiper.destroy();
    }

    let swiperCon = ReactDom.findDOMNode(this.refs.swiperCon);
    let _this = this;
    let wwidth = window.outerWidth;
    let swiperItems = swiperCon.getElementsByClassName('swiper-slide');
    let size = swiperItems.length;
    for (let i = 0; i < size; i++) {
      let item = swiperItems.item(i);
      item.style.width = wwidth+'px';
    }
    swiperCon.getElementsByClassName('swiper-wrapper')[0].style.width= wwidth*size+'px';
    this.setState({
      swiperIndex: 0
    });

    this.swiper = new Swiper('.swiper-tab-con', {
      virtualTranslate: true,
      autoHeight: false,
      onSetTranslate(swiper, translate) {
        swiper.container[0].getElementsByClassName('swiper-wrapper')[0].style.left = `${translate}px`;
      },
      onTransitionEnd(swiper) {
        if (_this.state.swiperIndex != swiper.activeIndex) {
          _this.setState({
            swiperIndex: swiper.activeIndex
          });
        }
      },
    });

    this.swiper.slideTo(1, 300, true);
    this.swiper.slideTo(0, 300, true);
  }

  componentDidUpdate(prevProps, prevState) {
    const oldLocation = prevProps.location;
    const location = this.props.location;
    // URL 发生变化后重新加载数据
    if (oldLocation.pathname != location.pathname || oldLocation.search != location.search) {
      this.initData();
    }
  }

  componentWillReceiveProps(nextProps) {

    const newLocation = nextProps.location;
    const oldLocation = this.props.location;
    if (oldLocation.pathname != newLocation.pathname || oldLocation.search != newLocation.search) {
      this.setupSwiper();
    }

    let pankouItems = nextProps.lottery.get('pankouItems');
    let location = nextProps.location;
    let query = parseQuery(location.search);

    if (pankouItems.length) {
      this.pankou = pankouItems[0];
      if (query.pankou) {
        for (let item of pankouItems) {
          if (item.itemCode == query.pankou) {
             this.pankou = item;
          }
        }
      }

      // 子盘口
      if (this.pankou.xzlxList) {
        this.subpankou = this.pankou.xzlxList[0];
        if (query.subpankou) {
          for (let item of this.pankou.xzlxList) {
            if (item.xzlxCode == query.subpankou) {
              this.subpankou = item;
            }
          }
        }
      } else {
        this.subpankou = {};
      }
    }
  }

  handlePlatformChange(item) {
    this.setState({
      selectedPeiyu: {},
    });
    const {match, history, location} = this.props;
    let path = match.path;
    let url = path.replace(':gameCode', item);
    if (match.params.gameCode != item ) {
      this.openLoading();
      history.push(url);
    }
  }

  onPankouChange(pankou, subpankou) {
    
    this.setState({
      selectedPeiyu: {},
    });

    const {history, location, match} = this.props;
    let to = `/lottery/betcenter/${match.params.gameCode}/home`;
    let query = parseQuery(location.search);
    query.pankou = pankou.itemCode;
    if (subpankou && subpankou.xzlxCode) {
      query.subpankou = subpankou.xzlxCode;
    }
    
    let appendQuery = '?' + buildQuery(query);
    if (location.search != appendQuery) {
      this.openLoading();
      history.push(to += appendQuery);

      this.onPankouSwichBoard();
    }
  }
  
  getPlatformFilterOptions() {
    const {lottery} = this.props;
    const gamelist = lottery.get("gameTypes");
    const namelist = {};
    for(var i in gamelist) {
      namelist[gamelist[i].flatCode] = gamelist[i]['flatName'];
    }
    return namelist;
  }

  onPlatformClick() {
    this.setState({
      showSwitchBoard: false
    });
  }

  onPankouSwichBoard() {
    const {lottery} = this.props;
    let pankouItems = lottery.get('pankouItems');
    if (pankouItems.length <= 0) {
      return ;
    }
    this.setState({
      showSwitchBoard: !this.state.showSwitchBoard
    });
  }

  onBetCenterNavSwitch(index) {
    this.onPlatformClick();
    this.swiper.slideTo(index, 300, true);
  }

  render() {

    const {lottery, match, location} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformOptions = this.getPlatformFilterOptions();
    let gameName = platformOptions[match.params.gameCode];
    let pankouItems = lottery.get('pankouItems');

    return (
      <div className="page lottery-page">
        <div className="lottery-body">
          <Header {...this.props}>
            <Back backTo={'/lottery'}/>
            <h2 className="gamecode">{gameName}</h2>
            {this.state.swiperIndex == 0 && <div className={"filter-bar " + ( pankouItems.length <= 0 ? ' filter-bar-no-sub': '' )} onClick={this.onPankouSwichBoard}>
              <div className={"inner " + (this.state.showSwitchBoard ? 'viewme': '')}>
                <span>{ this.subpankou.xzlxName ?  this.subpankou.xzlxName : ( this.pankou.itemName ) }</span>
              </div>
            </div>}
          </Header>
        
          <div className="page-body">
            <BetCenterNav onTabClick={this.onBetCenterNavSwitch} index={this.state.swiperIndex}/>

            {this.state.showSwitchBoard && this.state.swiperIndex == 0 && <PankouSwitchBoard 
              onChange={this.onPankouChange}  
              defaultPankou={ this.pankou }
              style={{height: getDocumentHeight() }}
              defaultSubpankou={this.subpankou}
              pankouItems={lottery.get('pankouItems')}/>}
            
            <div ref="swiperCon" className="swiper-tab-con">
              <div className="swiper-wrapper">
                <div className="swiper-slide"><BetCenterContainer betBtnOpacity={this.state.betBtnOpacity} index={this.state.swiperIndex} {...this.props}/></div>
                <div className="swiper-slide"><BetCenterOpenContainer index={this.state.swiperIndex} {...this.props}/></div>
                <div className="swiper-slide"><BetCenterOrderContainer index={this.state.swiperIndex} {...this.props}/></div>
                <div className="swiper-slide"><BetCenterRuleContainer index={this.state.swiperIndex} {...this.props}/></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

};

function mapStateToProps(state){
  const {lottery} = state.lotteryModule;
  const {userModule , app} = state;
  return {
    userModule,
    app,
    lottery
  };
}

export default connect(mapStateToProps)(withRouter(LotterySwiperContainer));