import React ,{ Component , PropTypes } from "react";
import {connect } from "react-redux";

import Header from "../../../components/Header";
import Back from "../../../components/Back";
import OpenItemInfoList from "../components/OpenResultStyle/OpenItemInfoList";
import LoadMore from "../components/LoadMore";
import OpenStyleMarkSix from "../components/OpenResultStyle/OpenStyleMarkSix";
import OpenStylePk10 from "../components/OpenResultStyle/OpenStylePk10";
import OpenStyleLucky28 from "../components/OpenResultStyle/OpenStyleLucky28";
import OpenStyleCommon from "../components/OpenResultStyle/OpenStyleCommon";
import {getOpenResultResult} from '../actions/LotteryAction';
import LoadingComponent from '../../../components/LoadingComponent';


class OpenItemInfoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMoreStatus : false
    }
  }
  componentWillMount(){
    const {dispatch,match, location} = this.props;
    const code = match.params.type;
    dispatch(getOpenResultResult(code,1));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      loadMoreStatus : false
    })
  }
  renderHK6(openCode){
    return <OpenStyleMarkSix code={openCode} />
  }
  renderBJPK10(openCode){
    return <OpenStylePk10 code={openCode}  />
  }
  renderBJKL8(openCode){
    return <OpenStyleLucky28 code={openCode}  />
  }
  renderCAKENO(openCode){
    return <OpenStyleLucky28 code={openCode}  />
  }
  renderCommon(openCode , type){
    return <OpenStyleCommon type={type} code={openCode} />
  } 
  renderBallModule(openCode){
    const {match} = this.props;
    const type = match.params.type;
    const src = "render" + type;
    if(type != "BJKL8" && type != "BJPK10" && type != "HK6" && type != "CAKENO"){
      return this.renderCommon(openCode , type);
    }
    return this[src](openCode);
  }
  loadMore(event){
    const {dispatch} = this.props;
    let currentPageNo = this.props.lotteryModule.lottery.get('singleResultPageNo');
    currentPageNo = currentPageNo + 1;
    const code = this.props.match.params.type;
    dispatch(getOpenResultResult(code,currentPageNo));
    this.setState({
      loadMoreStatus : true
    })
  }
  render(){
    const {lottery} = this.props.lotteryModule;
    let list = lottery.get('singleResult');
    if (list.length <= 0 ) {
      return null;
    }
    let firstCode = list[0].openCode;
    return(
      <div className="page lottery-page">
        <Header {...this.props}>
          <Back />
          <h3>{list[0].gameName}</h3>
        </Header>
        <div className="page-body">
          <div className="current-open">
            <p><span>{list[0].gameName}</span> 第<span>{list[0].qs}</span>期 开奖结果</p>
            {this.renderBallModule(firstCode)}
          </div>
          <OpenItemInfoList list={list} />
          <LoadMore event={this.loadMore.bind(this)} status={this.state.loadMoreStatus} />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  const {app , userModule ,lotteryModule } = state;
  return {
    app,
    userModule,
    lotteryModule
  }
}
export default connect(mapStateToProps)(OpenItemInfoContainer);

