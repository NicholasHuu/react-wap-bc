import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Swiper from 'swiper';
import ReactDOM from 'react-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LotteryTimer from '../components/LotteryTimer';
import {alert} from '../../../utils/popup';

import TrendLastThreeNums from '../components/TrendLastThreeNums';
import TrendMap from '../components/TrendMap';
import TrendLastNums from '../components/TrendLastNums';
import {loadLotteryTrend, loadOpenInfo} from '../actions/LotteryAction';

class TrendContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      activeHeaderIndex: 'one'
    };
    this.setupSwiper = this.setupSwiper.bind(this);
    this.onTimerFinish = this.onTimerFinish.bind(this);
    this.swiper = null;
  }

  // 初始化HTML的高度宽度坐标等信息
  initComponentCoodinate() {
    let swiperContainer = ReactDOM.findDOMNode(this.refs.swpierContainer);
    let siteHeader = ReactDOM.findDOMNode(this.refs.siteHeader);
    let trendHeader = ReactDOM.findDOMNode(this.refs.trendHeader);
    let trendDataElements = swiperContainer.getElementsByClassName('trend-data');

    for (let trendDataElement of trendDataElements) {
      let dataHeader = trendDataElement.getElementsByClassName('table-header')[0];
      let dataBody = trendDataElement.getElementsByClassName('table-body')[0];
      if (dataHeader && dataBody) {
        dataBody.style.height = `${document.body.clientHeight - ( dataHeader.clientHeight + siteHeader.clientHeight + trendHeader.clientHeight)}px`;  
        dataBody.style.overflowX = 'hidden';
      } else {

      }
    }
  }

  onTrendHeaderClick(index,num) {
    this.setState({
      activeHeaderIndex: index
    });
    this.swiper.slideTo(num, 500, false);
  }

  componentDidMount() {
    const {dispatch, match} = this.props;
    dispatch(loadOpenInfo(match.params.lottery));
    dispatch(loadLotteryTrend(match.params.lottery));
    setTimeout(() => {
      this.setupSwiper();
      this.initComponentCoodinate();
    });
  }

  componentDidUpdate() {
    //
  }

  componentWillReceiveProps(nextProps) {    
    setTimeout( () => {
      this.swiper.init();
      this.initComponentCoodinate();  
    } );
  }

  setupSwiper() {
    if (this.swiper) {
      this.swiper.destroy();
    }
    let swiperContainer = ReactDOM.findDOMNode(this.refs.swpierContainer);
    this.swiper = Swiper(swiperContainer, {
      init: false,
      containerModifierClass: 'trend-body',
      slideClass: 'trend-data',
      wrapperClass: 'wrap',
    });
    this.swiper.on('transitionEnd', () => {
      let index = this.swiper.activeIndex;
      let nums = ['one', 'two'];
      this.setState({
        activeHeaderIndex: nums[index]
      });
    });
  }

  onTimerFinish() {
    alert('当前期已结束，请注意期数变化', (popup) => {
      const {dispatch, match} = this.props;
      dispatch(loadOpenInfo(match.params.lottery));
      dispatch(loadLotteryTrend(match.params.lottery));

      popup.close();
    });
  }

  render() {
    const {crtQs, leftSecond, isClose, closeDes} = this.props.lottery.get('crtInfo');
    const {match} = this.props;
    return (
      <div className="page tlottery-trend-page">
        <Header {...this.props} ref="siteHeader" className="tlottery-header">
          <Back />
          {!isClose && <h3>距{crtQs}期截止:<LotteryTimer onFinish={this.onTimerFinish} second={leftSecond}/></h3>}
          {isClose && <h3><span className="lottery-timer">{closeDes}</span></h3>}
        </Header>

        <div className="page-body">
          <div ref="trendHeader" className={"trend-header " + `active-${this.state.activeHeaderIndex}`}>
            <ul className="clearfix">
              <li onClick={this.onTrendHeaderClick.bind(this, 'one', 0)}>走势图</li>
              <li onClick={this.onTrendHeaderClick.bind(this, 'two', 1)}>近期开奖</li>
            </ul>
          </div>
          <div className="trend-body" ref="swpierContainer">
            <div className="wrap">
              <TrendLastThreeNums {...this.props} />
              <TrendLastNums {...this.props}/>
            </div>
          </div>
        </div>

      </div>
    );
  }
};

function mapStateToProps({lotteryTimes, userModule, app}) {
  return {
    lottery: lotteryTimes.lottery,
    userModule,
    app
  };
}

export default withRouter( connect(mapStateToProps)(TrendContainer) );