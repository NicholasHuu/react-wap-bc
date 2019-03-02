import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import InfiniteScroller from 'react-infinite-scroller';

import Header from '../components/Header';
import Back from '../components/Back';
import FooterMenu from '../components/FooterMenu';
import BugerMenu from '../components/BugerMenu';
import BugerElectMenu from '../components/BugerElectMenu';
import LoadingComponent from '../components/LoadingComponent';
import {RES_OK_CODE} from '../constants/AppConstant';
import {alert} from '../utils/popup';
import {_collectChange} from '../actions/AppAction';
import {loadLiveSportElectGames} from '../actions/AppAction';

import FilterBar from '../components/FilterBar';

import {openGame} from '../utils/site';

import {loadElectGameItems, getElectGameLoginData} from '../actions/AppAction';

class ElecGameContainer extends LoadingComponent {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 'all',
      collect: {},
      keyword: '',
    };
    const {match} = this.props;
    this.flat = match.params.name;
    this.pageNo = 1;
    this.pageSize = 10;
    this.pageStart = 1;
    this.resetState();
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.keywordTimer = null;

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  resetState() {
    this.pageNo = 1;
    this.hasMore = true;
  }

  activeTab(index) {
    if (index == this.state.activeIndex) return 'active';
  }

  setActiveTab(index) {
    this.resetState();
    this.state.activeIndex = index;
    this.keyword = '';
    this.refs.keyword.value = this.keyword;
    this.setState({
      activeIndex: index,
    });
    this._loadGameItems();
  }

  _loadGameItems() {
    const {dispatch, match} = this.props;
    let flat = this.flat;
    let _this = this;
    console.log("..................................................");
    dispatch(loadElectGameItems(flat, this.state.activeIndex, this.pageNo, this.pageSize, this.keyword, 1,function(num){
      _this.pageNo = num;
    }));
  }
  _loadElectItems(){
    var dispatch = this.props.dispatch;
    dispatch(loadLiveSportElectGames());
  }
  componentWillReceiveProps(nextProps) {
    let apiRes = nextProps.elect.get('apiRes');
    if(apiRes.datas){
       console.log("totalPages = "+ apiRes.datas.totalPages);
       console.log("this.pageNo = "+this.pageNo);  
    }
   
    if (apiRes.datas && apiRes.datas.totalPages < this.pageNo) {
      this.hasMore = false;
    }
    this.closeLoading();
    const {match} = nextProps;
    if (match.params.name != this.flat) {
      this.resetState();
      this.flat = match.params.name;
      this.openLoading();
      this._loadGameItems();
    }
  }
  componentWillMount() {
    //this.openLoading();
    this._loadGameItems();
    this._loadElectItems();
  }
  loadMoreItems(page) {
    console.log('page =' + page);
    this.pageNo++;
    this._loadGameItems();
  }
  onElectGamePlay(game) {
    const {dispatch, userModule} = this.props;
    let isLogin = userModule.user.get('auth').get('isLogin');
    if (!isLogin) {
      alert('请先登录');
      return ;
    }
    this.openLoading();
    dispatch(getElectGameLoginData(this.flat, game.gameCode, (data) => {
      this.closeLoading();
      if (data.errorCode != RES_OK_CODE) {
        alert(data.msg);
      } else {
        openGame(data.datas);
      }
    }));
  }
  onKeywordChange() {
    let keyword = this.refs.keyword.value;
    if (this.keywordTimer) {
      clearTimeout(this.keywordTimer);
      this.keywordTimer = null;
    }
    let _this = this;
    this.keywordTimer = setTimeout((() => {
      _this.resetState();
      _this.keyword = keyword;
      _this._loadGameItems();
    }).bind(this), 500);
  }

  collectChange(flat ,status ,gameCode){
    const {dispatch, userModule} = this.props;
    let isLogin = userModule.user.get('auth').get('isLogin');
    if (!isLogin) {
      alert('请先登录');
      return ;
    }
    let collect = this.state.collect;
    collect[gameCode] = status;

    let _this = this;
    dispatch(_collectChange(flat,gameCode,status, (data) => {
      if (data.errorCode == RES_OK_CODE) {
        _this.setState({
          collect
        });
      } else {
        alert(data.msg);
      }
    }));
  }
  componentWillUpdate(){
    this.closeLoading();
  }
  componentDidUpdate(){
    this.closeLoading();
  }
  renerInfiniScroller() {
    let _this = this;
    let gameItems = this.props.elect.get('gameItems').get(this.flat);
    if (!gameItems || gameItems.length <= 0) {
      return <p className="no-data">暂无数据</p>
    } else {
      return  <InfiniteScroller 
                key={this.state.activeIndex + '-' + this.state.keyword+ '-' +this.pageNo} 
                initialLoad={false} 
                pageStart={this.pageStart} 
                loadMore={this.loadMoreItems} 
                hasMore={this.hasMore} 
                loader={ <div className="loader"></div> }>
            <ul className="clearfix">
              {gameItems.map( (gameItem, index) => {
                let isLiked = _this.state.collect[gameItem.gameCode];
                
                if (isLiked == undefined) {
                  isLiked = gameItem.havourite ? 'collect' : 'unCollect';
                }
                let likeDom = null;
                let code = gameItem.gameCode;

                if (isLiked == 'collect') {
                  likeDom = <div className="game-title">{gameItem.cnName}<i onClick={_this.collectChange.bind(_this,_this.flat,'unCollect',code)} className="active"></i></div>;
                }else{
                  likeDom = <div className="game-title">{gameItem.cnName}<i onClick={_this.collectChange.bind(_this,_this.flat,'collect',code)} ></i></div>;
                }
                return (
                    <li key={index}>
                      <div onClick={_this.onElectGamePlay.bind(_this, gameItem)} className="game-list-img">
                        <div className="img-inner"><img src={gameItem.img} /></div>
                      </div>
                      {likeDom}
                    </li>
                  );
              })}
            </ul>
          </InfiniteScroller>
    }
  }

  onFilterChange(value) {
    let to = `/elect/game/${value}/all`;
    if (value != this.flat) {
      this.keyword = '';
      this.refs.keyword.value = this.keyword;
    }
    const {history} = this.props;
    history.push(to);
  }

  render() {

    let filterOptions = {};

    this.props.types.filter( type => type && type.flatCode != 'ag').map(type => {
      filterOptions[type.flatCode] = type.flatName;
    });

    return (
      <div className="page page-elect-mg">
        <div>
          <Header {...this.props} className="hgsport-header elect-header">
            <Back backTo={'/other'} />
            <FilterBar defaultValue={this.flat} options={filterOptions} onChange={this.onFilterChange}/>
          </Header>
          <div className="page-body">
            <div className="inner">
              <div className="search-container">
                <div className="search">
                  <form action="">
                    <input type="text" ref="keyword" onChange={this.onKeywordChange} className="search-text" placeholder="游戏搜索" />
                    <div className="search-btn"><img src="/misc/images/icon-search.png" /></div>
                  </form>
                </div>
              </div>
              <div className="game-class">
                <ul>
                  <li><div onClick={this.setActiveTab.bind(this, 'all')} className={ this.activeTab('all') }>全部游戏</div></li>
                  <li><div onClick={this.setActiveTab.bind(this, 'hot')} className={ this.activeTab('hot') }>热门游戏</div></li>
                  <li><div onClick={this.setActiveTab.bind(this, 'new')} className={ this.activeTab('new') }>最新游戏</div></li>
                  <li><div onClick={this.setActiveTab.bind(this, 'favourite')} className={ this.activeTab('favourite') }>我的收藏</div></li>
                </ul>
              </div>
              <div className="game-list">
                {this.renerInfiniScroller()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const {userModule, app, elect} = state;
  const types = elect.get('types');
  return {
    userModule, app, elect,types
  };
}

export default connect(mapStateToProps)(withRouter(ElecGameContainer));


