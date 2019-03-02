import React , { Component , PropTypes} from "react";
import {connect} from "react-redux";
import {withRouter} from 'react-router';
import InfiniteScroller from 'react-infinite-scroller';

import {Map, List} from 'immutable';
import Header from "../../../components/Header";
import Back from "../../../components/Back";
import FilterBar from "../../../components/FilterBar";
import BetCenterNav from "../components/BetCenter/BetCenterNav";
import BetRecordList from "../components/BetCenter/BetRecordList";
import NotLogin from "../components/NotLogin";

import {getLotteryGames,getPlatformOrder} from "../actions/LotteryAction";
import {format} from '../../../utils/datetime';

class BetCenterOrderContainer extends Component{

  constructor(props){
    super(props);
    const {match, userModule} = this.props;
    this.gameCode = match.params.gameCode;
    this.onPlatformChange  = this.onPlatformChange.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.page = 1;
    this.pageStart = 0;
    this.hasMore = true;
    this.isLogin = userModule.user.get('auth').get('isLogin');
  }

  componentWillMount(){
    const {dispatch} = this.props;
  }

  loadOrders() {
    if (this.isLogin && this.hasMore) {
      const {dispatch, userModule, match} = this.props;
      let userName = userModule.user.get('auth').get('userName');
      const gameCode = match.params.gameCode;
      let date = new Date();
      let startDate = format( (date.getTime() - 900000000000), 'Y-m-d 00:00:00');
      let endDate = format(date, 'Y-m-d 23:59:59');
      dispatch(getPlatformOrder(userName, startDate, endDate ,this.gameCode , this.page));
    }
  }

  loadMoreItems(page) {
    if (this.props.index != 2) {
      return ;
    }
    this.page = page;
    if (this.hasMore) {
      this.loadOrders();  
    }
  }
  
  componentDidMount(){
    this.loadOrders();
  }

  resetState() {
    this.hasMore = true;
    this.page = 1;
  }

  getPlatformFilterOptions(){
    const {lottery} = this.props;
    const option = lottery.get('gameTypes');
    const nameList = {};
    for(var i in option){
      nameList[option[i].gameCode] = option[i]['gameName'];
    }
    return nameList;
  }

  componentWillReceiveProps(nextProps) {
    const {match} = nextProps;
    if (match.params.gameCode != this.gameCode) {
      this.gameCode = match.params.gameCode;
      this.resetState();
      this.loadOrders();
    }

    let apiRes = nextProps.lottery.get('apiRes');
    if (apiRes && apiRes.datas && apiRes.datas.totalPage < this.page ) {
      this.hasMore = false;
    }
  }

  renderLoginBtn() {
    return  <NotLogin />;
  }

  onPlatformChange(gameCode) {
    const {history, dispatch, match} = this.props;
    let to = match.path.replace(':gameCode', gameCode);
    history.push(to);
  }

  render() {
    const {lottery,match, userModule} = this.props;
    const list = lottery.get('platformOrder');
    let isLogin = userModule.user.get('auth').get('isLogin');
    if (!isLogin) {
      return this.renderLoginBtn();
    }
    
    return(
      <div className="swiper-element">
        <div className="inner">
          <InfiniteScroller initialLoad={false} pageStart={this.pageStart} loadMore={this.loadMoreItems} hasMore={this.hasMore} loader={ <div className="loader"></div> }>
            {list.length ? <BetRecordList list={list} /> : <p className="bet-record-tips">您没有当前平台的注单！</p>}
          </InfiniteScroller>
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
export default connect(mapStateToProps)(withRouter(BetCenterOrderContainer));