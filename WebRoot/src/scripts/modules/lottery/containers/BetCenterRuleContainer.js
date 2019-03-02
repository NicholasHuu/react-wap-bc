import React , { Component , PropTypes} from "react";
import {connect} from "react-redux";
import {Map, List} from 'immutable';
import Header from "../../../components/Header";
import Back from "../../../components/Back";
import FilterBar from "../../../components/FilterBar";
import BetCenterNav from "../components/BetCenter/BetCenterNav";
import Hkdouble from "../components/BetCenter/RuleDetail/Hkdouble";
import {getLotteryGames, getGameRule} from "../actions/LotteryAction";
class BetCenterRuleContainer extends Component{
  
  constructor(props){
    super(props);
    const {match} = this.props;
    this.gameCode = match.params.gameCode;
  }
  
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(getGameRule(this.gameCode));
  }

  render() {
    const gameRules = this.props.lottery.get('gameRules');
    let rule = gameRules[this.gameCode];
    if (!rule) {
      rule = {};
    }
    return(
      <div className="swiper-element">
        <div className="inner">
          <Hkdouble rule={rule}/>
        </div>
      </div>
    )
  }
}



function mapStateToProps(state){
  const {lottery} = state.lotteryModule;
  const { app , userModule } = state;
  return {
    app , userModule ,lottery
  }
}
export default connect(mapStateToProps)(BetCenterRuleContainer);