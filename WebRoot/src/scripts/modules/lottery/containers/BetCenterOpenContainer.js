import React , { Component , PropTypes} from "react";
import {connect} from "react-redux";
import {Map, List} from 'immutable';
import InfiniteScroller from 'react-infinite-scroller';
import Header from "../../../components/Header";
import Back from "../../../components/Back";
import FilterBar from "../../../components/FilterBar";
import BugerMenu from "../../../components/BugerMenu";
import BetCenterNav from "../components/BetCenter/BetCenterNav";
import LoadMore from "../components/LoadMore";
import BetHandicapMenu from "../components/BetCenter/BetHandicapMenu";
import OpenItemInfoList from "../components/OpenResultStyle/OpenItemInfoList";
import {getLotteryGames,getOpenResultResult} from "../actions/LotteryAction";
import OpenStyleMarkSix from "../components/OpenResultStyle/OpenStyleMarkSix";
import OpenStylePk10 from "../components/OpenResultStyle/OpenStylePk10";
import OpenStyleLucky28 from "../components/OpenResultStyle/OpenStyleLucky28";
import OpenStyleCommon from "../components/OpenResultStyle/OpenStyleCommon";
import LoadingComponent from '../../../components/LoadingComponent';

class BetCenterOpenContainer extends LoadingComponent{
  constructor(props){
    super(props);

    const {match} = this.props;
    this.platform = match.params.gameCode;
    this.onPlatformChange = this.onPlatformChange.bind(this);
    this.hasMore = true;
    
  }
  componentWillMount(){
    const {lottery,dispatch,match} = this.props;
    dispatch(getLotteryGames());
    const gameCode = match.params.gameCode;
    dispatch(getOpenResultResult(this.platform ,1));
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();

    const {lottery} = nextProps;
    let gameList = lottery.get('singleResult');
    let totalPage = lottery.get('singleResultTotalPage');
    let pageNo = lottery.get('singleResultPageNo');
    if (pageNo > totalPage) {
      this.hasMore = false;
    }

  }

  getPlatformList(){
    const {lottery} = this.props;
    let gameList = lottery.get('gameTypes');
    let list ={};
    for(var i=0;i<gameList.length;i++){
      let key = gameList[i].gameCode;
      let value = gameList[i].gameName;
      list[key] = value;
    }
    return list;
  }

  loadMore(){
    if (this.props.index != 1) {
      return ;
    }
    const {match,lottery,dispatch} = this.props;
    let gameCode = match.params.gameCode;
    let pageNo = lottery.get('singleResultPageNo');
    pageNo = pageNo + 1;
    dispatch(getOpenResultResult(gameCode,pageNo));
  }

  renderHK6(openCode){
    return(<OpenStyleMarkSix code={openCode} />)
  }

  renderBJPK10(openCode){
    return(<OpenStylePk10 code={openCode}  />)
  }

  renderBJKL8(openCode){
    return(<OpenStyleLucky28 code={openCode}  />)
  }

  renderCAKENO(openCode){
    return(<OpenStyleLucky28 code={openCode}  />)
  }

  renderCommon(openCode , type){
    return(<OpenStyleCommon type={type} code={openCode} />)
  } 

  renderBallModule(openCode){
    const {match} = this.props;
    const type = this.platform;
    const src = "render" + type;
    if(type != "BJKL8" && type != "BJPK10" && type != "HK6" && type != "CAKENO"){
      return(this.renderCommon(openCode , type));
    }
    return this[src](openCode);
  }

  onPlatformChange(platform) {
    this.platform = platform;
    const {dispatch} = this.props;
    dispatch(getOpenResultResult(this.platform ,1));

    const {match, history, location} = this.props;
    let path = match.path;
    let url = path.replace(':gameCode', platform);
    if (match.params.gameCode != platform ) {
      this.openLoading();
      history.push(url);
    }
  }

  render(){
    const {lottery,match} = this.props;
    let gameList = lottery.get('gameTypes');
    let openList = lottery.get('singleResult');
    if(!gameList.length || !openList.length){
      return null;
    }
    let firstCode = openList[0].openCode;
    return(
      <div className="swiper-element">
        
        <div className="inner">
          
          <div className="current-open">
            <p><span>{openList[0].gameName}</span> 第<span>{openList[0].qs}</span>期 开奖结果</p>
            {this.renderBallModule(firstCode)}
          </div>
          
          <InfiniteScroller initialLoad={false} pageStart={1} loadMore={this.loadMore.bind(this)} hasMore={this.hasMore} loader={ <div className="loader"></div> }>
            <OpenItemInfoList {...this.props} list ={openList} /> 
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
export default connect(mapStateToProps)(BetCenterOpenContainer);