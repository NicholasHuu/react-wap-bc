import React , { Component , PropTypes} from "react";
import ReactDom from 'react-dom';
import {connect} from "react-redux";
import {withRouter} from 'react-router';
import {Map, List} from 'immutable';
import Header from "../../../components/Header";
import Back from "../../../components/Back";
import FilterBar from "../../../components/FilterBar";
import BugerMenu from "../../../components/BugerMenu";
import BetCenterNav from "../components/BetCenter/BetCenterNav";
import BetHandicapMenu from "../components/BetCenter/BetHandicapMenu";
import BetCenterSureBtn from "../components/BetCenter/BetCenterSureBtn";
import TableContainer from "./TableContainer";
import {getLotteryGames, 
  loadPlatformPankou,
  tempSaveSelectedPeiyu,
  getLmOrder,
  getMultiGroupOrder,
  getGroupOrder,
  loadPlantformPeiyu} from '../actions/LotteryAction';
import {buildQuery, parseQuery} from '../../../utils/url';
import BuggerIcon from '../../../components/BuggerIcon';
import PankouSwitchBoard from '../components/BetCenter/PankouSwitchBoard';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';

import {serializeContent, unserializeContent} from '../utils/helper';
import LoadingComponent from '../../../components/LoadingComponent';

class BetCenterContainer extends LoadingComponent {
  
  constructor(props){
    super(props);
    this.handlePlatformChange = this.handlePlatformChange.bind(this);
    this.onPankouChange = this.onPankouChange.bind(this);
    this.onBetReset = this.onBetReset.bind(this);
    this.onBetSubmit = this.onBetSubmit.bind(this);
    this.onPeiyuSelected = this.onPeiyuSelected.bind(this);
    this.onFenpanFinish = this.onFenpanFinish.bind(this);
    this.onKaijiangFinish = this.onKaijiangFinish.bind(this);
    this.onPankouSwichBoard = this.onPankouSwichBoard.bind(this);
    this.onPlatformClick = this.onPlatformClick.bind(this);

    this.state = {
      buggerMenuIsOpen: false,
      resetSelectedItem: false,
      selectedPeiyu: {},
      fenpanSecond: 0,
      kaijiangSecond: 0,
      fenpanZhong: false,
      kaijiangZhong: false,
      showSwitchBoard: false,
    };
    this.pankou = {};
    this.subpankou = {};
    this.initDataTimeout = null;
  }

  initData() {
    const {dispatch, match, location} = this.props;
    dispatch(getLotteryGames());
    dispatch(loadPlatformPankou(match.params.gameCode, location));
    this.setState({
      selectedPeiyu: {}
    });
  }

  componentDidMount() {
    this.openLoading();
    this.initData();
  }

  componentDidUpdate(prevProps, prevState) {
    const oldLocation = prevProps.location;
    const location = this.props.location;
    // URL 发生变化后重新加载数据
    if (oldLocation.pathname != location.pathname || oldLocation.search != location.search) {
      this.initData();
    }
  }

  componentWillReceiveProps(nextProps) {

    let pankouItems = nextProps.lottery.get('pankouItems');
    let peiyu = nextProps.lottery.get('pankouPeiyu');
    let oldPeiyu = this.props.lottery.get('pankouPeiyu');
    let location = nextProps.location;
    let query = parseQuery(location.search);
    let platformInfo = nextProps.lottery.get('platformInfo');

    if (platformInfo) {
      let fenpanSecond = platformInfo.closetime - platformInfo.nowtime;
      let kaijiangSecond = platformInfo.opentime - platformInfo.nowtime;

      this.setState({
        fenpanSecond,
        kaijiangSecond
      });

      // 封盘结束
      if (fenpanSecond > 0) {
        this.setState({
          fenpanZhong: false,
          kaijiangZhong: false
        });
      }
        
      // 开奖结束
      if (fenpanSecond > 0 && kaijiangSecond > 0 ) {
        this.setState({
          kaijiangZhong: false
        });
      }

      // 封盘中
      if (fenpanSecond < 0 && kaijiangSecond > 0) {
        this.setState({
          kaijiangZhong: false,
          fenpanZhong: true,
        });
      }
    
      // 开奖中
      if (fenpanSecond < 0 && kaijiangSecond < 0) {
        this.setState({
          kaijiangZhong: true,
          fenpanZhong: false,
        });
      }

      if ( platformInfo.closetime 
        && platformInfo.nowtime 
        && kaijiangSecond < 0 ) {

        this.setState({
          kaijiangZhong: true
        });
        
        let _this = this;
        if (this.initDataTimeout) {
          clearTimeout(this.initDataTimeout);
        }
        this.initDataTimeout = setTimeout( () => {
          _this.initDataTimeout = null;
          _this.initData();
        },  Math.abs(kaijiangSecond*1000) );
      } else {
        //
      }
    }
    
    // 判断赔率是否更新 去关闭加载框
    if (oldPeiyu != peiyu) {
      this.closeLoading();
    }

    if (pankouItems.length) {
      this.pankou = pankouItems[0];
      if (query.pankou) {
        for (let item of pankouItems) {
          if (item.itemCode == query.pankou) {
             this.pankou = item;
          }
        }
      }

      // 子盘口
      if (this.pankou.xzlxList) {
        this.subpankou = this.pankou.xzlxList[0];
        if (query.subpankou) {
          for (let item of this.pankou.xzlxList) {
            if (item.xzlxCode == query.subpankou) {
              this.subpankou = item;
            }
          }
        }
      } else {
        this.subpankou = {};
      }
    }
  }

  handlePlatformChange(item) {
    this.setState({
      selectedPeiyu: {},
    });
    const {match, history, location} = this.props;
    let path = match.path;
    let url = path.replace(':gameCode', item);
    if (match.params.gameCode != item ) {
      this.openLoading();
      history.push(url);
    }
  }
  
  getPlatformFilterOptions() {
    const {lottery} = this.props;
    const gamelist = lottery.get("gameTypes");
    const namelist = {};
    for(var i in gamelist) {
      namelist[gamelist[i].gameCode] = gamelist[i]['gameName'];
    }
    return namelist;
  }

  onPankouChange(pankou, subpankou) {
    
    this.setState({
      selectedPeiyu: {},
    });

    const {history, location, match} = this.props;
    let to = `/lottery/betcenter/${match.params.gameCode}/home`;
    let query = parseQuery(location.search);
    query.pankou = pankou.itemCode;
    if (subpankou && subpankou.xzlxCode) {
      query.subpankou = subpankou.xzlxCode;
    }
    
    let appendQuery = '?' + buildQuery(query);
    if (location.search != appendQuery) {
      this.openLoading();
      history.push(to += appendQuery);

      this.onPankouSwichBoard();
    }
  }

  onBetReset() {
    this.setState({
      selectedPeiyu: {}
    });
  }

  onBetSubmit() {
    const {match, location, history, dispatch, lottery} = this.props;
    let query = parseQuery(location.search);
    let pankouItems = lottery.get('pankouItems');
    if (pankouItems.length <= 0 ) {
      return ;
    }
    // 给与第一个盘口为默认盘口
    if (!query.pankou) {
      query.pankou = pankouItems[0].itemCode;
    }
    if (!query.subpankou) {
      query.subpankou = '';
    }
    let _this = this;
  
    if (match.params.gameCode == 'HK6' && query.pankou == 'LM') {

      // 香港六合彩 - 连码  
      let selectedPeiyu = this.state.selectedPeiyu[0];
      //gameCode, nums, rrtype, pabc, cb = () => {},  dm1 = 0, dm2 = 0
      let rrtype = selectedPeiyu['rrtype'];
      let nums = selectedPeiyu['nums'];
      
      if ( ( rrtype == 0 || rrtype == 1 ) && nums.length < 3) {
        alert('至少选择三个号码');
        return ;
      } else if ( nums.length < 2 ) {
        alert('至少选择二个号码');
        return ;
      }

      dispatch(getLmOrder(match.params.gameCode, selectedPeiyu['nums'], selectedPeiyu['rrtype'], selectedPeiyu['playMode'], (data) => {
        
        dispatch(tempSaveSelectedPeiyu(_this.state.selectedPeiyu));

        history.push('/lottery/memberbet?'+  buildQuery({
          gameCode: match.params.gameCode,
          pankou: query.pankou,
          subpankou: query.subpankou
        }));

      }, selectedPeiyu['dm1'], selectedPeiyu['dm2']));
    }
    else if (match.params.gameCode == 'HK6' && query.pankou == 'ZYBZ') {

      if (!query.subpankou) {
        query.subpankou = 'WBZ';
      }

      let minlen = 0;
      if (query.subpankou == 'WBZ' || !query.subpankou) {
        minlen = 5;
      } else if (query.subpankou == 'QBZ') {
        minlen = 7
      } else if (query.subpankou == 'JBZ') {
        minlen = 9
      } else if (query.subpankou == 'SZY') {
        minlen = 4
      } else if (query.subpankou == 'LZY') {
        minlen = 6;
      }

      if (Object.keys(this.state.selectedPeiyu).length < minlen) {
        alert(`请至少选择${minlen}个号码`);
        return ;
      }
      
      let nums = [];
      for (let peiyuItemId in this.state.selectedPeiyu) {
        nums.push(peiyuItemId);
      }
      dispatch(getMultiGroupOrder(match.params.gameCode, nums, minlen, (data) => {

        if (data.errorCode == RES_OK_CODE) {
          dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
          
          history.push('/lottery/memberbet?'+  buildQuery({
            gameCode: match.params.gameCode,
            pankou: query.pankou,
            subpankou: query.subpankou
          }));
        } else {
          alert(data.msg);
        }
      }));
    }
    else if (match.params.gameCode == 'HK6' && query.pankou == 'LX') {
      if (!query.subpankou) {
        query.subpankou = 'ELX';
      }

      let minlen = 0;
      if (query.subpankou == 'ELX' || !query.subpankou) {
        minlen = 2;
      } else if (query.subpankou == 'SALX') {
        minlen = 3;
      } else if (query.subpankou == 'SILX') {
        minlen = 4;
      } else if (query.subpankou == 'WLX') {
        minlen = 5;
      }
    
      if (Object.keys(this.state.selectedPeiyu).length < minlen) {
        alert(`请至少选择${minlen}个生肖`);
        return ;
      }

      let nums = [];
      for (let peiyuItemId in this.state.selectedPeiyu) {
        nums.push(peiyuItemId);
      }

      dispatch(getMultiGroupOrder(match.params.gameCode, nums, minlen, (data) => {

        if (data.errorCode == RES_OK_CODE) {
          dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
          
          history.push('/lottery/memberbet?'+  buildQuery({
            gameCode: match.params.gameCode,
            pankou: query.pankou,
            subpankou: query.subpankou
          }));
        } else {
          alert(data.msg);
        }

      }));
    }
    else if (match.params.gameCode == 'HK6' && query.pankou == 'HX') {
      if (!query.subpankou) {
        query.subpankou = 'EX';
      }

      let minlen = 0;
      if (query.subpankou == 'EX' || !query.subpankou) {
        minlen = 2;
      } else if (query.subpankou == 'SX') {
        minlen = 4;
      } else if (query.subpankou == 'LX') {
        minlen = 6;
      }
    
      if (Object.keys(this.state.selectedPeiyu).length < minlen) {
        alert(`请至少选择${minlen}个生肖`);
        return ;
      }

      let nums = [];
      for (let peiyuItemId in this.state.selectedPeiyu) {
        nums.push(peiyuItemId);
      }

      dispatch(getMultiGroupOrder(match.params.gameCode, nums, minlen, (data) => {

        if (data.errorCode == RES_OK_CODE) {
          dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
          
          history.push('/lottery/memberbet?'+  buildQuery({
            gameCode: match.params.gameCode,
            pankou: query.pankou,
            subpankou: query.subpankou
          }));
        } else {
          alert(data.msg);
        }

      }));
    }
    else if (match.params.gameCode == 'HK6' && query.pankou == 'WSL') {
      if (!query.subpankou) {
        query.subpankou = 'EWL';
      }

      let minlen = 0;
      if (query.subpankou == 'EWL' || !query.subpankou) {
        minlen = 2;
      } else if (query.subpankou == 'SAWL') {
        minlen = 3;
      } else if (query.subpankou == 'SIWL') {
        minlen = 4;
      }
    
      if (Object.keys(this.state.selectedPeiyu).length < minlen) {
        alert(`请至少选择${minlen}个尾数`);
        return ;
      }

      let nums = [];
      for (let peiyuItemId in this.state.selectedPeiyu) {
        nums.push(peiyuItemId);
      }

      dispatch(getMultiGroupOrder(match.params.gameCode, nums, minlen, (data) => {

        if (data.errorCode == RES_OK_CODE) {
          dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
          
          history.push('/lottery/memberbet?'+  buildQuery({
            gameCode: match.params.gameCode,
            pankou: query.pankou,
            subpankou: query.subpankou
          }));
        } else {
          alert(data.msg);
        }

      }));
    }
    else if ( ( match.params.gameCode == 'FC3D' || match.params.gameCode == 'PL3' ) && ['BSDW', 'BGDW', 'SGDW', 'BSGDW'].indexOf(query.subpankou) != -1  ) {

      if (Object.keys(this.state.selectedPeiyu).length <= 0) {
        alert('请选择号码');
        return ;
      }

      let item = this.state.selectedPeiyu[Object.keys(this.state.selectedPeiyu)[0]];
      let numbers = unserializeContent(item.number);
      
      if (!query.subpankou) {
        query.subpankou = 'BSDW';
      }
      let minLen = 2;
      if (query.subpankou == 'BSGDW') {
        minLen = 3;  
      }

      let isOk = true;
      if (Object.keys(numbers).length < minLen) {
        isOk = false;
      } else {
        for (let key in numbers) {
          let nums = numbers[key];
          if (nums.length <= 0 ) {
            isOk = false;
          }
        }
      }

      if (!isOk) {
        alert(`请至少选择${minLen}组号码`);
        return ;
      }

      dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
      
      history.push('/lottery/memberbet?'+  buildQuery({
        gameCode: match.params.gameCode,
        pankou: query.pankou,
        subpankou: query.subpankou
      }));
    }
    else if ( ( match.params.gameCode == 'FC3D' || match.params.gameCode == 'PL3' ) && ( query.pankou == 'ZXS' || query.pankou == 'ZXL' ) ) {
      let minlen = 5, multilen = 3;
      if (query.pankou == 'ZXL') {
        minlen = 4;
        multilen = 6;
      }
      
      if (Object.keys(this.state.selectedPeiyu).length < minlen) {
        alert(`请至少选择${minlen}个号码`);
        return ;
      }

      let nums = [];
      for (let peiyuItemId in this.state.selectedPeiyu) {
        nums.push(this.state.selectedPeiyu[peiyuItemId].number);
      }

      dispatch(getGroupOrder(match.params.gameCode, query.pankou, 'QSW', multilen, nums, (data) => {

        if (data.errorCode == RES_OK_CODE) {
          dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
          
          history.push('/lottery/memberbet?'+  buildQuery({
            gameCode: match.params.gameCode,
            pankou: query.pankou,
            subpankou: query.subpankou
          }));
        } else {
          alert(data.msg);
        }

      }));
    }
    else if (  ['CQSSC', 'TJSSC', 'XJSSC'].indexOf(match.params.gameCode) != -1 &&  ['EZDW', 'SZDW', 'EZZH'].indexOf(query.pankou) != -1  ) {

      if (Object.keys(this.state.selectedPeiyu).length <= 0) {
        alert('请选择号码');
        return ;
      }
      
      let key = Object.keys(this.state.selectedPeiyu)[0];
      let item = this.state.selectedPeiyu[key];
      let numbers = unserializeContent(item.number);
      // 把用户选择取消过的全部删掉
      for (let nk in numbers) {
        let nums = numbers[nk];
        if (nums.length <= 0) {
          delete numbers[nk];
        }
      }
      
      let eqlen = 2;
      if (query.pankou == 'SZDW') {
        eqlen = 3;
      }

      let isOk = true;

      if (Object.keys(numbers).length != eqlen) {
        isOk = false;
      }

      item.number = serializeContent(numbers);
      this.state.selectedPeiyu[key] = item;

      if (!isOk) {
        alert(`请选择${eqlen}组号码`);
        return ;
      }

      dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
      
      history.push('/lottery/memberbet?'+  buildQuery({
        gameCode: match.params.gameCode,
        pankou: query.pankou,
        subpankou: query.subpankou
      }));
    }
    else if (  ['CQSSC', 'TJSSC', 'XJSSC'].indexOf(match.params.gameCode) != -1 &&  ['ZXL', 'ZXS'].indexOf(query.pankou) != -1  ) {
      let minlen = 5, multilen = 3;
      if (query.pankou == 'ZXL') {
        minlen = 4;
        multilen = 6;
      }
      
      if (Object.keys(this.state.selectedPeiyu).length < minlen) {
        alert(`请至少选择${minlen}个号码`);
        return ;
      }

      let nums = [];
      for (let peiyuItemId in this.state.selectedPeiyu) {
        nums.push(this.state.selectedPeiyu[peiyuItemId].number);
      }

      dispatch(getGroupOrder(match.params.gameCode, query.pankou, query.subpankou, multilen, nums, (data) => {

        if (data.errorCode == RES_OK_CODE) {
          dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
          
          history.push('/lottery/memberbet?'+  buildQuery({
            gameCode: match.params.gameCode,
            pankou: query.pankou,
            subpankou: query.subpankou
          }));
        } else {
          alert(data.msg);
        }

      }));
    }
    else {
      if (Object.keys(this.state.selectedPeiyu).length <= 0) {
        alert('请选择号码');
        return ;
      }

      // 有些特殊的彩种对选择的号码有特殊要求
      if (match.params.gameCode == 'HK6' && query.pankou == 'GG') {
        if (Object.keys(this.state.selectedPeiyu).length <= 1) {
          alert("请至少选择2个号码");
          return ;
        }
      } else if ( ( match.params.gameCode == 'FC3D' || match.params.gameCode == 'PL3' ) && query.pankou == 'ZH' )  {
        let len = 1;
        if (query.subpankou == 'EZZH') {
          len = 2;
        } else if (query.subpankou == 'SZZH') {
          len = 3;
        }

        let number = this.state.selectedPeiyu[Object.keys(this.state.selectedPeiyu)[0]].number;

        console.log(['number', number, this.state.selectedPeiyu, len]);

        if ( number.split('').length != len) {
          alert(`请选择${len}个号码`);
          return ;
        }
      }

      dispatch(tempSaveSelectedPeiyu(this.state.selectedPeiyu));
      
      history.push('/lottery/memberbet?'+  buildQuery({
        gameCode: match.params.gameCode,
        pankou: query.pankou,
        subpankou: query.subpankou
      }));
    }
  }

  onPeiyuSelected(item, key = '') {
  
    let selectedPeiyu = this.state.selectedPeiyu;
    let {match, location} = this.props;
    let query = parseQuery(location.search);

    if (match.params.gameCode == 'HK6' && query.pankou == 'LM') {
      // 香港六合彩 - 连码
      let [rrtype, playMode, nums, dm1, dm2] = arguments;
      selectedPeiyu[0] = {
        rrtype,
        playMode,
        nums,
        dm1,
        dm2
      };
    } else {
      // 其他彩种
      let hasSourceKey = key;
      key = key == '' ? item.id: key;
      if (hasSourceKey) {
        selectedPeiyu[key] = item; 
      } else {
        if (selectedPeiyu[key]) {
          delete selectedPeiyu[key];
        } else {
          selectedPeiyu[key] = item;  
        }
      }
    }

    this.setState({
      selectedPeiyu
    });
  }

  onFenpanFinish() {
    let kaijiangSecond = this.state.kaijiangSecond - this.state.fenpanSecond;
    this.setState({
      fenpanZhong: true,
      fenpanSecond: 0,
      kaijiangSecond: kaijiangSecond
    });
  }

  onKaijiangFinish() {
    this.initData();
    this.setState({
      fenpanZhong: false,
      kaijiangZhong: true,
      fenpanSecond: 0,
      kaijiangSecond: 0
    });
  }

  onPlatformClick() {
    this.setState({
      showSwitchBoard: false
    });
  }

  onPankouSwichBoard() {
    const {lottery} = this.props;
    let pankouItems = lottery.get('pankouItems');
    if (pankouItems.length <= 0) {
      return ;
    }
    this.setState({
      showSwitchBoard: !this.state.showSwitchBoard
    });
  }

  renderMaintain(msg) {
    return <p className="maintain">{msg}</p>
  }

  render() {
    const {lottery, match, location} = this.props;
    let platformInfo = lottery.get('platformInfo');
    let fenpanSecond = this.state.fenpanSecond;
    let kaijiangSecond = this.state.kaijiangSecond;
    let platformOptions = this.getPlatformFilterOptions();
    let gameName = platformOptions[match.params.gameCode];
    let pankouItems = lottery.get('pankouItems');

    let isMaintain = lottery.get('isMaintain');
    let maintainMsg = lottery.get('maintainMsg');
    let crtIndex = this.props.index;

    return (
      <div className="swiper-element" ref="betContainer">
        <div className="inner">
        
          <div className="inner">

            {isMaintain && this.renderMaintain(maintainMsg) }

            {!isMaintain &&  <div className={"bet-table-wrap " + ( this.state.fenpanZhong ? 'bet-table-wrap-disabled': '') + ( this.state.kaijiangZhong ? ' bet-table-wrap-kaijiang': '') }>
              <TableContainer 
                qs={platformInfo.currentQs}
                fenpanSecond={  fenpanSecond  }
                kaijiangSecond={ kaijiangSecond  }
                onFenpanFinish={this.onFenpanFinish}
                onKaijiangFinish={this.onKaijiangFinish}
                onPeiyuSelected={this.onPeiyuSelected} 
                selectedPeiyu={this.state.selectedPeiyu} 
                peiyu={lottery.get('pankouPeiyu')}
                subpankou={this.subpankou}
                platformInfo={platformInfo}
                pankou={this.pankou} />
            </div> }
            {!isMaintain && this.props.index == 0 &&  <BetCenterSureBtn onReset={this.onBetReset} onSubmit={this.onBetSubmit} /> }
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state){
  const {lottery} = state.lotteryModule;
  const {userModule , app} = state;
  return {
    userModule,
    app,
    lottery
  };
}
export default connect(mapStateToProps)(withRouter(BetCenterContainer));