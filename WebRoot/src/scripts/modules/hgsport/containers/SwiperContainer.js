import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import Swiper from 'swiper';

import {parseQuery} from '../../../utils/url';

import FilterBar from '../../../components/FilterBar';
import Header from '../../../components/Header';
import Back from '../../../components/Back';
import NavTabs from '../components/NavTabs';
import RealtimeBallGroup from '../components/RealtimeBallGroup';

import BugerMenu from '../../../components/BugerMenu';
import BugerHgMenu from '../components/BugerHgMenu';

import {loadSportBallItems, loadSportBallTypes} from '../actions/HgActionPart';
import LoadingComponent from '../../../components/LoadingComponent';
import RealtimeBallContainer from './RealtimeBallContainer';
import OrdersContainer from './OrdersContainer';
import RaceResultContainer from './RaceResultContainer';

class SwiperContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.ballOptions = {};
    const {match, location} = this.props;
    this.onBallChange = this.onBallChange.bind(this);
    let query = parseQuery(location.search);
    if (!query.ball) {
      query.ball = 'bk';
    }
    this.swiper = null;
    this.state = {
      buggerMenuOpened: false,
      loading: true,
      swiperIndex: 0,
      ball: query.ball,
      rType: query.rType ? query.rType: '',
    };

    this.onProductSelect = this.onProductSelect.bind(this);
    this.handleBuggerMenuSelected = this.handleBuggerMenuSelected.bind(this);
  }

  componentWillMount() {
    this.loadBallItems();
    this.loadBallItemType();
  }

  componentDidMount() {
    this.setupSwiper();
  }

  loadBallItems() {
    const {dispatch} = this.props;
    dispatch(loadSportBallItems());
  }

  loadBallItemType() {
    const {dispatch} = this.props;
    dispatch(loadSportBallTypes(this.state.ball));
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
  
    this.loadBallItemType();

    this.setState({
      ball
    });
    
    let path = match.path;
    let to = {
      pathname: path,
      search: `?ball=${ball}`,
    };
    history.push(to);
  }

  handleBuggerMenuSelected(item) {
    const { match, history} = this.props;

    this.setState({
      rType: item.rType,
      buggerMenuOpened: false
    });

    let path = match.path;
    let ball = this.state.ball;
    let to = {
      pathname: path,
      search: `?ball=${ball}&rType=${item.rType}`,
    };
    history.push(to);
  }

  componentWillReceiveProps(nextProps) {
  
    const {location} = nextProps;
    let query = parseQuery(location.search);

    if (location != this.props.location) {
      let query = parseQuery(location.search);
      if (!query.ball) {
        query.ball = 'bk';
      }
      this.setState({
        ball: query.ball
      });
    }

    // 设置默认的 rType
    const {huangguan} = nextProps.hgsport;
    let ballTypes = huangguan.get('ballTypes');
    if (ballTypes.length > 0 && !this.state.rType) {
      this.state.rType = ballTypes[0].rType;
      this.setState({
        rType: ballTypes[0].rType
      });
    }

  }

  // 暂无赛事
  renderNoBetting() {
    return <p className="no-data">{this.state.loading ? '赛事加载中': '暂无赛事'}</p>
  }

  renderMaintain(msg) {
    return <p className="maintain">{msg}</p>
  }

  render() {
    const {huangguan} = this.props.hgsport;
    let ballPeiyu = huangguan.get('ballPeiyu');
    let isMaintain = huangguan.get('isMaintain');
    let maintainMsg = huangguan.get('maintainMsg');
    let hasPeiyu = false;
    if (ballPeiyu) {
      hasPeiyu = Object.keys(ballPeiyu).length  > 0;
    }
    return (
      <div className="transition-item">
        <BugerMenu 
          onStateChange={this.onMenuStateChange} 
          onBugerMenuItemSelected={this.handleBuggerMenuSelected} 
          className="hg-buger-menu" 
          ballTypes={huangguan.get('ballTypes')} 
          isOpen={this.state.buggerMenuOpened} 
          menu={BugerHgMenu}>

          <div className="hg-page realtime-page">
            <Header className='hgsport-header' {...this.props}>
              <Back backTo={'/'}/>
              <FilterBar defaultValue={this.state.ball} options={huangguan.get('sportBalls')} onChange={this.onBallChange} />
            </Header>
          
            <div className="page-body">
              <NavTabs index={this.state.swiperIndex}/>
              
              <div ref="swiperCon" className="swiper-tab-con">
                <div className="swiper-wrapper">
                  <div className="swiper-slide"><RealtimeBallContainer rType={this.state.rType} ball={this.state.ball} onProductSelect={this.onProductSelect} timeType='roll' index={this.state.swiperIndex} {...this.props}/></div>
                  <div className="swiper-slide"><RealtimeBallContainer rType={this.state.rType} ball={this.state.ball} onProductSelect={this.onProductSelect} timeType='today' index={this.state.swiperIndex} {...this.props}/></div>
                  <div className="swiper-slide"><RealtimeBallContainer rType={this.state.rType} ball={this.state.ball} onProductSelect={this.onProductSelect} timeType='tom' index={this.state.swiperIndex} {...this.props}/></div>
                  <div className="swiper-slide"><RaceResultContainer ball={this.state.ball} index={this.state.swiperIndex} {...this.props}/></div>
                  <div className="swiper-slide"><OrdersContainer ball={this.state.ball} index={this.state.swiperIndex} {...this.props}/></div>
                </div>
              </div>

            </div>
          </div>

        </BugerMenu>
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

export default connect(mapStateToProps)(withRouter(SwiperContainer));