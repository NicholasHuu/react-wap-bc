import React , { Component , PropTypes } from "react";
import {connect} from 'react-redux';

import Header from "../../../components/Header";
import Back from "../../../components/Back";

import FooterLotteryMenu from "../components/FooterLotteryMenu";
import OpenCenter from "../components/OpenCenter";
import {getOpenResult} from '../actions/LotteryAction';

class OpenCenterContainer extends Component{
  constructor(props){
    super(props);
  }
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(getOpenResult());
  }
  
  render(){
    const {lottery} = this.props;
    return(
      <div className="page lottery-page">
        <Header {...this.props}>
          <Back />
          <h3>开奖中心</h3>
        </Header>
        <div className="page-body">
          <OpenCenter {...this.props} items={lottery.get("openResult")} />
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
export default connect(mapStateToProps)(OpenCenterContainer);