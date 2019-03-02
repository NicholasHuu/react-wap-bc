import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

import {getLotteryGames, getWinList, loadSlider} from '../actions/LotteryAction';
import Header from '../components/Header';
import PlatformListNav from '../components/PlatformListNav';
import Back from '../../../components/Back';
import Slider from '../../../components/Slider';
import Marquee from '../../../components/Marquee';
import FooterLotteryMenu from '../components/FooterLotteryMenu';

import LoadingComponent from '../../../components/LoadingComponent';


class PanelContainer extends LoadingComponent {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(getLotteryGames());
    dispatch(getWinList());
    dispatch(loadSlider());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  render() {
    const {lottery, app} = this.props;
    const gamelist = lottery.get("gameTypes");
    const winningList = lottery.get('winningList');
    let messages = winningList.map(item => {
      return item.remark;
    });
    
    return (
      <div className="page lottery-page">
        <Header {...this.props} className="lottery-home">
          <Back backTo={'/'}/>
          <h3>购彩大厅</h3>
        </Header>
        <div className="page-body">
          <Slider sliders={lottery.get('lotterySlider')} />
          <Marquee messages={messages} />
          <PlatformListNav items={gamelist} />
          <FooterLotteryMenu /> 
        </div>
      </div>
    );
  }
};

PanelContainer.propTypes = {
  lottery: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {lottery} = state.lotteryModule;
  const {userModule , app} = state;
  return {
    userModule,
    app,
    lottery
  };
}

export default connect(mapStateToProps)(PanelContainer);