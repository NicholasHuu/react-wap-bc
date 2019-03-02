import React , { Component , PropTypes } from "react";
import {connect} from 'react-redux';
 
import SelectBox from "../../../../components/SelectBox";
import BetRecordList from "./BetRecordList";
import {getPlatformOrder} from "../../actions/LotteryAction";
import {format} from "../../../../utils/datetime";
import LoadingComponent from '../../../../components/LoadingComponent';
import PeriodChoice from '../../../../components/PeriodChoice';
import InfiniteScroll from 'react-infinite-scroller';

class BetRecord extends LoadingComponent {
  constructor(props){
    super(props);
    this.onSelectPlatform = this.onSelectPlatform.bind(this);
    this.onSelectTimes = this.onSelectTimes.bind(this);
    this.loadRecordLog = this.loadRecordLog.bind(this);
    this.options = [{
        text :"今天",
        value: 'today',
        second: 24 * 60 * 60
      },{
        text: "三天内", 
        value: '',
        second: 3 * 24 * 60 * 60
      },{
        text: "一周内", 
        value: 'oneweek',
        second: 7 * 24 * 60 * 60 
      },{
        text: "一个月内", 
        value: 'onemonth',
        second: 30 * 24 * 60 * 60
      },{
        text: "三个月内", 
        value: 'threemonth',
        second: 3 * 30 * 24 * 60 * 60 
      }
    ];
    this.platform = '';
    this.state = {
      times : this.options[0]['second'],
      page: 1,
      hasMore: true,
    }
  }

  gameList (){
    const {lottery} = this.props;
    const gameList = lottery.get('gameTypes');
    var list_select = [{
      text: '彩种',
      value: ''
    }];
    for(var i=0;i<gameList.length;i++){
      var json={};
      json.text = gameList[i].flatName;
      json.value = gameList[i].flatCode;
      list_select.push(json);
    }
    return list_select;
  }

  componentWillMount() {
    this.loadRecordLog();
  }

  componentDidMount() {
    // this.openLoading();
  }

  loadRecordLog(page = 1)　 {
    if (page == 1) {
      this.setState({
        hasMore: true,
      });
    }
    const {dispatch,userModule} = this.props;
    let userName = userModule.user.get('auth').get('userName');
    let endTime = format(new Date(), "Y-m-d HH:mm:ii");
    let secondDelta = this.state.times;
    let yearMonthDayStr = format(new Date(), "Y-m-d");
    let nowBeginTime = Math.floor( new Date(`${yearMonthDayStr} 00:00:00`).getTime() / 1000 );
    let startTime = format(new Date( ( nowBeginTime - secondDelta ) *1000 ) , "Y-m-d HH:mm:ii");
    let gameCode = this.platform;
    let _this = this;
    _this.openLoading();
    dispatch(getPlatformOrder(userName ,startTime ,endTime ,gameCode ,page, (data) => {
      _this.closeLoading();
      if (data.datas.totalPage == page) {
       _this.setState({
        hasMore: false
       }); 
      }
    }));
  }

  onSelectPlatform(value){
    this.platform = value;
    this.loadRecordLog();
  }

  onSelectTimes(value){
    for (let option of this.options) {
      if (option['value'] == value) {
        this.state.times = option.second;
      }
    }
    this.loadRecordLog();
  }

  render(){
    const {lottery} = this.props;
    const list = lottery.get('platformOrder');

    return(
      <div className="bet-record">
        <div className="choice-wrapper choice">
          <PeriodChoice event={this.onSelectTimes} />
          <SelectBox options={this.gameList()} onChange={this.onSelectPlatform} value={this.platform} />
        </div>
        {list.length ? <InfiniteScroll 
          pageStart={1} 
          loadMore={this.loadRecordLog} 
          initialLoad={false}
          hasMore={this.state.hasMore} 
          loader={ <div className="loader"></div> }>
            <BetRecordList list={list}  />
        </InfiniteScroll>: <p className="bet-record-tips"><span>您没有该平台的投注记录！</span></p> }
      </div>
    )
  }
}
function mapStateToProps(state){
  const {lottery} = state.lotteryModule;
  const {userModule} = state;
  return{
    lottery,
    userModule
  }
}
export default connect(mapStateToProps)(BetRecord);