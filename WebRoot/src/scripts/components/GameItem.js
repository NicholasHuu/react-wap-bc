import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import {
  setGameCenterViewType,
  getLiveLoginData,
  getElectGameLoginData
} from "../actions/AppAction";
import { alert } from "../utils/popup";
import { RES_OK_CODE } from "../constants/AppConstant";
import { staticURL } from "../utils/url";
import { openGame } from "../utils/site";

function range(num1, num2 = null) {
  if (num2 == null) {
    num2 = num1;
    num1 = 0;
  }
  let ids = [];
  for (let i = num1; i < num2; i++) ids.push(i);

  return ids;
}

import LoadingComponent from "./LoadingComponent";

class GameItem extends LoadingComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      iconDirection: false
    };
  }

  componentDidMount() {
    //
  }

  componentWillReceiveProps(nextProps) {}

  onGameItemClick(item) {
    let windowReference;
    const { dispatch, userModule, history } = this.props;
    let isLogin = userModule.user.get("auth").get("isLogin");
    let _this = this;
    history.push(`/lotterytimes/play?lottery=${item.lotteryCode}`);
    // if (!isLogin) {
    //   history.push(`/login`);
    // } else {
    //   history.push(`/lotterytimes/play?lottery=${item.lotteryCode}`);
    // }
    // switch (item.gameMenuCode.toLowerCase()) {
    /*switch (item.lotteryCode.toLowerCase()) {
      case 'card':
        if (isLogin) {
          _this.openLoading();
          dispatch(getLiveLoginData(item.flatCode, (data) => {
            _this.closeLoading();
            if (data.errorCode == RES_OK_CODE) {
              openGame(data.datas);
            } else {
              alert(data.msg);
            }
          }, item.gameCode));
        } else {
          alert('请先登录');
        }
        break;
      case 'lottery':
        history.push(`/lottery/betcenter/${item.flatCode}/home`);
        break;
      case 'live':
        if (isLogin) {
          _this.openLoading();
          dispatch(getLiveLoginData(item.flatCode, (data) => {
            _this.closeLoading();
            if (data.errorCode != RES_OK_CODE) {
              alert(data.msg);
            } else {
              openGame(data.datas);
            }
          }, item.gameCode));
        } else {
          alert('请先登录');
        }
        break;
      case 'electronic':
        if (item.flatCode == 'ag') {
          if (isLogin) {
            _this.openLoading();
            dispatch(getElectGameLoginData(item.flatCode, item.gameCode, (data) => {
              _this.closeLoading();
              if (data.errorCode == RES_OK_CODE) {
                openGame(data.datas);
              } else {
                alert(data.msg);
              }
            }));
          } else {
            alert('请先登录');
          }
        } else {
          history.push(`/elect/game/${item.flatCode}/all`);
        }
        break;
      case 'bbin':
        if (!isLogin) {
          alert('请先登录');
        } else {
          _this.openLoading();
          dispatch(getLiveLoginData(item.flatCode, (data) => {
            _this.closeLoading();
            if (data.errorCode == RES_OK_CODE) {
                openGame(data.datas);
            } else {
              alert(data.msg);
            }
          }, item.gameCode));
        }
        break;
      case 'sport':
        if (item.flatCode == 'huangguan') {
          history.push('/hgsport');
        } else if (item.flatCode == 'sb' || item.flatCode == 'sbt') {
          _this.openLoading();
          if (!isLogin) {
            alert('请先登录');
          } else {
            dispatch(getLiveLoginData(item.flatCode, (data) => {
              _this.closeLoading();
              if (data.errorCode == RES_OK_CODE) {
                openGame(data.datas);
              } else {
                alert(data.msg);
              }
            }));
          }
        }
        break;
      case "beitou":
        if (!isLogin) {
          //alert('请先登陆');
          history.push(`/login`);
        } else {
          // history.push(`/lotterytimes/play?lottery=${item.flatCode}`);
          history.push(`/lotterytimes/play?lottery=${item.lotteryCode}`);
        }
        break;
    }*/
  }

  showItem(type) {
    const { dispatch } = this.props;
    if (this.state.show) {
      dispatch(setGameCenterViewType(""));
    } else {
      dispatch(setGameCenterViewType(type));
    }
  }

  render() {
    const state = this.state;
    const gameTitle = this.props.gameTitle;
    const flatCode = this.props.flatCode;
    const gameId = this.props.gameId;
    const list = this.props.gameSubList;
    const viewType = this.props.viewType;
    let _this = this;
    return (
      <div className="game-item">
        <h3>{gameTitle.name}</h3>
        <div className={"game-list "}>
          {list.map(function(item, index) {
            return (
              <a onClick={_this.onGameItemClick.bind(_this, item)} key={index}>
                <div className="game-list-inner">
                  <img src={item.smallPicUrl} alt="" />
                  <div className="game-style-common">
                    <i className="icon" />
                    <span>{item.lotteryName}</span>
                  </div>
                </div>
              </a>
            );
          })}
          {/*
          {list.map(function(item,index){
            return(
              <a onClick={_this.onGameItemClick.bind(_this, viewType, item)} key={index}>
                <img src={item.smallPic} alt=""/>
                <div className="game-style-common">
                    <i className="icon" style={ {backgroundImage: 'url('+staticURL(item.smallBackgroundPic)+')'} }></i>
                    <span>{item.flatName}</span>
                </div>
              </a>
            )
          })}*/}
          {range(4 - (list.length % 4)).map(i => {
            return <a key={i} />;
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(GameItem);
