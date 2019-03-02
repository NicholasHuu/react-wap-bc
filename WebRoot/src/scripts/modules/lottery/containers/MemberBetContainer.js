import React , { Component, PropTypes }  from "react";
import { connect }  from  "react-redux";
import {withRouter} from 'react-router';

import Header from "../../../components/Header";
import Back from "../../../components/Back";

import LotteryTimer from "../components/LotteryTimer";
import MemberBetItems from "../components/MemberBetItems";
import HK6GGMemberBetItems from "../components/HK6GGMemberBetItems";
import HK6LMMemberBetItems from "../components/HK6LMMemberBetItems";
import HK6GroupOrderMemberBetItems from "../components/HK6GroupOrderMemberBetItems";
import MemberDWBetForm from '../components/MemberDWBetForm';

import {loadPlatformInfo, saveOrder} from '../actions/LotteryAction';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {parseQuery} from '../../../utils/url';
import {dingweiTotal, zuheTotal} from '../utils/helper';
import {alert} from '../../../utils/popup';
import {loadUserInfo} from '../../user/actions/User';

class MemberBetContainer extends Component {

  constructor(props) {
    super(props);
    this.onBetSubmit = this.onBetSubmit.bind(this);
    const { location} = this.props;
    this.query = parseQuery(location.search);
    this.fenpan = this.fenpan.bind(this);
    this.state = {
      fenpanSecond: 0,
      kaijiangSecond: 0,
    };
    this.submitProcess = false;
  }

  componentWillMount(){
    const {dispatch, location, lottery ,selectedPeiyu, history} = this.props;
    let query = this.query;
    if (Object.keys(selectedPeiyu).length <= 0 ) {
      let to = `/lottery/betcenter/${query.gameCode}/home?pankou=${query.pankou}`;
      history.push(to);
    } else {
      dispatch(loadUserInfo());
      dispatch(loadPlatformInfo(query.gameCode, query.pankou)); 
    }
  }

  componentWillReceiveProps(nextProps) {
    let platformInfo = nextProps.lottery.get('platformInfo');
    
    if (platformInfo.closetime ) {
      this.setState({
        fenpanSecond: platformInfo.closetime - platformInfo.nowtime,
        kaijiangSecond: platformInfo.opentime - platformInfo.nowtime
      });
    }
  }

  fenpan() {
    this.setState({
      fenpanSecond: 0,
      kaijiangSecond: 0,
    });
    let _this = this;
    alert('当前已封盘, 请重新下注', '提示', (popup) => {
      popup.close();
      const {location, history} = _this.props;
      let query = _this.query;
      let to = `/lottery/betcenter/${query.gameCode}/home?pankou=${query.pankou}`;
      history.push(to);
    });
  }

  getGameName() {
    const {lottery, location} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformTypes = lottery.get('gameTypes');
    let query = this.query;
    let gameName;
    // namelist[gamelist[i].flatCode] = gamelist[i]['flatName'];
    for (let platform of platformTypes) {
      if (platform.flatCode == query.gameCode) {
        gameName = platform.flatName;
      }
    }

    return gameName;
  }

  onBetSubmit(betItems, orderFlag = 'normal') {
    if (this.submitProcess) {
      return false;
    }
    this.submitProcess = true;
    let _this = this;
    const {dispatch, history} = this.props;
    dispatch(saveOrder(this.query.gameCode, betItems, (data) => {
      _this.submitProcess = false;
      if (data.errorCode == RES_OK_CODE) {
        alert(data.msg, '提示', (popup) => {
          popup.close();
          let to = `/lottery/betcenter/${_this.query.gameCode}/home?pankou=${_this.query.pankou}`;
          if (_this.query.subpankou) {
            to += `&subpankou=${_this.query.subpankou}`;
          }
          history.push(to);
        });
      } else {
        alert(data.msg);
      }
    }, orderFlag));
  }

  renderHk6GG() {
    const {selectedPeiyu, lottery, userModule} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformTypes = lottery.get('gameTypes');
    return <HK6GGMemberBetItems {...this.props} onSubmit={this.onBetSubmit} items={selectedPeiyu} platform={platformInfo} />
  }

  renderHk6LM() {
    const {selectedPeiyu, lottery, userModule} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformTypes = lottery.get('gameTypes');
    let preOrder = lottery.get('preOrderList');

    return <HK6LMMemberBetItems {...this.props} preOrder={preOrder} onSubmit={this.onBetSubmit} items={selectedPeiyu} platform={platformInfo} />
  }

  renderHK6GroupOrder() {
    const {selectedPeiyu, lottery, userModule} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformTypes = lottery.get('gameTypes');
    let preOrder = lottery.get('multiGroupOrder');

    return <HK6GroupOrderMemberBetItems {...this.props} preOrder={preOrder} onSubmit={this.onBetSubmit} items={selectedPeiyu} platform={platformInfo}/>
  }

  renderDWBetForm() {
    const {selectedPeiyu, lottery, userModule, match} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformTypes = lottery.get('gameTypes');
    let item = selectedPeiyu[Object.keys(selectedPeiyu)[0]]
    return <MemberDWBetForm {...this.props} onSubmit={this.onBetSubmit} items={selectedPeiyu} platform={platformInfo} />
  }

  renderBetForm() {
    const {selectedPeiyu, lottery, userModule, match} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformTypes = lottery.get('gameTypes');
    let query = this.query;
    if (query.pankou == 'GG') {
      return this.renderHk6GG();
    } else if (query.pankou == 'LM') {
      return this.renderHk6LM();
    } else if (query.pankou == 'ZYBZ' 
      || query.pankou == 'LX'
      || query.pankou == 'HX'
      || query.pankou == 'ZXL'
      || query.pankou == 'ZXS'
      || query.pankou == 'WSL') {
      return this.renderHK6GroupOrder();
    }
    else if ( ( query.pankou == 'DW' && ['BSDW', 'BGDW', 'SGDW', 'BSGDW'].indexOf(query.subpankou) != -1 )
      || query.pankou == 'EZDW'
      || query.pankou == 'SZDW'
      || query.pankou == 'EZZH') {
      return this.renderDWBetForm();
    }
     else {
      return <MemberBetItems {...this.props} onSubmit={this.onBetSubmit} items={selectedPeiyu} platform={platformInfo}/>;
    }
  }

  render() {
    const {selectedPeiyu, lottery, userModule} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let platformTypes = lottery.get('gameTypes');
    let query = this.query;
    return (
      <div className="page lottery-page lottery-bet-page">
        <Header {...this.props}>
          <Back />
          <h3>{this.getGameName()}</h3>
        </Header>
        <div className="page-body">
          <div className="member-info">
            <p>会员账号：<span>{userModule.user.get('auth').get('userName')}</span> 余额：<span>{userModule.user.get('info').userMoney && userModule.user.get('info').userMoney.toFixed(2)}</span>元</p>
            <div className="widget">
              <LotteryTimer 
                qs={platformInfo.currentQs}
                fenpan={this.fenpan}
                kjSecond={this.state.kaijiangSecond} 
                fpSecond={ this.state.fenpanSecond } />
            </div>
          </div>
          { this.renderBetForm() }
        </div>
      </div>
    )
  }

}

function mapStateToProps(state){
  const {app , userModule} = state;
  const {lottery} = state.lotteryModule;
  const selectedPeiyu = lottery.get('selectedPeiyu');
  return{
    app,userModule,lottery,selectedPeiyu
  }
}

export default connect(mapStateToProps)(withRouter(MemberBetContainer));