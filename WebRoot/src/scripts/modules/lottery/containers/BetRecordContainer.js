import React , { Component , PropTypes } from "react";
import {connect} from 'react-redux';

import Header from "../../../components/Header";
import Back from "../../../components/Back";

import FooterLotteryMenu from "../components/FooterLotteryMenu";
import BetRecord from "../components/BetCenter/BetRecord";

import {getPlatformOrder,getLotteryGames} from "../actions/LotteryAction";

class BetRecordContainer extends Component{
  
  componentDidMount() {
    //
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(getLotteryGames());
  }
  

  render() {
    return(
      <div className="page lottery-page">
        <Header {...this.props}>
          <Back />
          <h3>投注记录</h3>
        </Header>
        <div className="page-body">
          <BetRecord {...this.props}  />
          <FooterLotteryMenu />
        </div>
      </div>
    )
  }
}
function mapStateToProps(state){
  const {lottery} = state.lotteryModule;
  const {app , userModule} = state;
  return{
    app,
    userModule,
    lottery
  }

}
export default connect(mapStateToProps)(BetRecordContainer);