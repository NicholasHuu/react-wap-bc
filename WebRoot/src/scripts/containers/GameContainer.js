import React, { Component, PropTypes } from "react";
import {connect} from 'react-redux';
import {Link,withRouter} from 'react-router-dom';
import FooterMenu from '../components/FooterMenu';
import Header from '../components/Header';
import Back from '../components/Back';
import GameItems from '../components/GameItems';
import {loadLiveSportElectGames,lotteryGroups} from '../actions/AppAction';

import LoadingComponent from '../components/LoadingComponent';
import PTR from '../utils/pulltorefresh.js';
import {bodyClass, resetBodyClass} from '../actions/AppAction';

class GameContainer extends LoadingComponent {
    
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadLiveSportElectGames());
    dispatch(lotteryGroups());
    bodyClass('chase-body');
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    
    PTR({
      mainElement: '.game-list-wrap-inner',
      refreshHandler({close, handler}) {
        dispatch(loadLiveSportElectGames(() => {
          close();
        }));
      }
    });

  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
    resetBodyClass('chase-body');

  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  render(){
    let liveGames = this.props.app.get('lotteryGroupList');
    //const type = this.props.app.get('gameCenterViewType');
    return(
      <div className="page game-page">
        <div>
          <div id="hgsport-header">

          <Header {...this.props} className="hgsport-header elect-header">
            <h3>购彩大厅</h3>
          </Header>
          </div>
         
          <div className="game-list-wrap">
            <div className="game-list-wrap-inner">


              {/*<GameItems {...this.props} viewType={type} list={liveGames} />*/}
              <GameItems {...this.props} list={liveGames} />
            </div>
          </div>

          <FooterMenu />

       
        </div>
      </div>
    )
  }
} 


function mapStateToProps(state) {
  const {userModule, app,liveGame} = state;
  return {
    userModule, app,liveGame
  };
}

export default connect(mapStateToProps)(withRouter(GameContainer));


