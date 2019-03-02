import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Slider from '../../../components/Slider';
import Marquee from '../../../components/MarqueeScroller';
import Card from '../../../components/Card';
import FooterMenu from '../components/FooterMenu';

import {bodyClass, resetBodyClass} from '../../../actions/AppAction';
import {buildQuery} from '../../../utils/url';
import {loadLotteryMain} from '../actions/LotteryAction';

class IndexContainer extends Component {
    
  componentWillMount() {
    bodyClass('tlottery');
    const {dispatch} = this.props;
    dispatch(loadLotteryMain());
  }

  componentWillUnmount() {
    resetBodyClass('tlottery');
  }

  componentDidMount() {
    const {history} = this.props;
    history.replace('/game');
  }

  onItemClick(item) {
    let query = {
      lottery: item.key
    };
    const {history, match} = this.props;
    return history.push({
      pathname: `${match.url}/play`,
      search: buildQuery(query),
    });
  }

  render() {
    let self = this;
    return (
      <div className="page tlottery-page">
        <Slider sliders={this.props.sliders} />
        <Marquee className="tlottery-marquee" messages={this.props.marqueeMsgs}/>
        <div className="tl-items">
          {this.props.tlotteryItems.map((item, index) => {
            return <Card key={index} onClick={self.onItemClick.bind(self, item)} image={item.img} title={item.name} summary={item.summary}/>
          })}
          <FooterMenu />
        </div>
      </div>
    );
  }
};

function mapStateToProps({lotteryTimes}) {
  return {
    sliders: lotteryTimes.home.get('sliders'),
    marqueeMsgs: lotteryTimes.home.get('marqueeMsgs'),
    tlotteryItems: lotteryTimes.home.get('tlotteryItems'),
  };
}

export default withRouter(connect(mapStateToProps)(IndexContainer));