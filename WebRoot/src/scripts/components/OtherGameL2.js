import React , { Component, PropTypes } from "react"
import {connect} from 'react-redux';
import {alert} from '../utils/popup';
import {Link,withRouter} from 'react-router-dom';
import {setGameCenterViewType, getLiveLoginData, getElectGameLoginData} from '../actions/AppAction';
import {RES_OK_CODE} from '../constants/AppConstant';

import LoadingComponent from './LoadingComponent';

class OtherGameL2 extends LoadingComponent {
	
	constructor(props){
		super(props);
		this.linkGame = this.linkGame.bind(this);
	}
	linkGame(item){
		console.log(item);
	let windowReference;
    const {dispatch, userModule, history} = this.props;
    let isLogin = userModule.user.get('auth').get('isLogin');
    let _this = this;
    switch (item.gameMenuCode.toLowerCase()) {
      case 'fish':
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
        if (item.flatCode == 'ag' || item.flatCode == 'bbin') {
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
          alert('请先登陆');
          history.push(`/login`);
        } else {
          history.push(`/lotterytimes/play?lottery=${item.lotteryCode}`);
        }
        break;
    }
		/*const {dispatch, userModule} = this.props;
		let isLogin = userModule.user.get('auth').get('isLogin');
		if (!isLogin) {
			alert('请先登录');
		} else {
			let gameCode = flat;
			let _this = this;
			_this.openLoading();
			dispatch(getLiveLoginData(flat, (data) => {
				_this.closeLoading();
				if (data.errorCode == RES_OK_CODE) {
					openGame(data.datas);
				} else {
					alert(data.msg);
				}
			}, gameCode));
		}*/
	}
	componentWillReceiveProps(nextProps) {
    	this.closeLoading();
	}
	render () {
		const {itemList} = this.props;
		let _this = this;
		return(
			<div className="items">
				{itemList.map(function(item,index){
					return(
						<div className="item" onClick={_this.linkGame.bind(_this,item)} key={index}>
							<img src={item.bigPic} className="image-bg" alt=""/>
						</div>
					)
				})}
			</div>
		)
	}
}
function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule, app
  };
}
export default connect(mapStateToProps)(withRouter(OtherGameL2));