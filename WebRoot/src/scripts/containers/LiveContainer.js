import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../components/Back';

import FooterMenu from '../components/FooterMenu';
import {loadLiveSportElectGames, getLiveLoginData} from '../actions/AppAction';
import LoadingComponent from '../components/LoadingComponent';
import {RES_OK_CODE} from '../constants/AppConstant';
import {alert} from '../utils/popup';
import {openGame} from '../utils/site';

class LiveContainer extends LoadingComponent {

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadLiveSportElectGames());
  }
  
  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }
  
  onLiveGameClick(live) {
    const {dispatch, userModule} = this.props;
    let isLogin = userModule.user.get('auth').get('isLogin');
    if (!isLogin) {
      alert('请先登录');
    } else {
      this.openLoading();
      dispatch(getLiveLoginData(live.flatCode, (data) => {
        this.closeLoading();
        if (data.errorCode != RES_OK_CODE) {
          alert(data.msg);
        } else {
          if (live.flatCode == 'sa') {
            openGame(`/user/saLogin?url=${data.datas}`);
          } else {
            openGame(data.datas);
          }
        }
      }, live.gameCode));
    }
  }

  render() {

    let liveGames = this.props.liveGame.get('items');
    if (liveGames.length % 3 != 0 ) {
      for (let i = 0; i < liveGames.length % 3; i++) {
        liveGames.push(null);
      }
    }
    return (
      <div className="page page-live">
        <div>
          <div className="inner">
            <Header {...this.props}>
              <Back backTo={'/'}/>
              <h3>真人视讯</h3>
            </Header>
            <div className="page-body">
              <div className="live-items">
                {liveGames.map( (liveGame, index) => {
                  if (liveGame) {
                    return (<div onClick={this.onLiveGameClick.bind(this, liveGame)} key={index} className={"live-item bg-ad " + ( index % 3 == 2 ? 'no-border': '') }>
                      {liveGame.bigBackgroundPic && <img src={liveGame.bigBackgroundPic} className="image-bg" alt="" /> }
                      <div className="inner">
                        <img src={liveGame.bigPic} />
                        <h4>{liveGame.flatName}</h4>
                      </div>
                    </div>);
                  } else {
                    return <div key={index} className={"live-item " + ( index % 3 == 2 ? 'no-border': '' )}></div>;
                  }
                })}
              </div>
            </div>
          </div>
         
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const {app, userModule, liveGame} = state;
  return {
    app, userModule,liveGame
  };
}

export default connect(mapStateToProps)(LiveContainer);