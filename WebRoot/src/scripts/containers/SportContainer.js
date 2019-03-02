import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import Header from '../components/Header';
import Back from '../components/Back';
import FooterMenu from '../components/FooterMenu';
import {loadLiveSportElectGames} from '../actions/AppAction';
import LoadingComponent from '../components/LoadingComponent';
import {RES_OK_CODE} from '../constants/AppConstant';

import {getLiveLoginData} from '../actions/AppAction';

import {openGame} from '../utils/site';

class SportContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.sportLinks = {
      huangguan: '/hgsport',
    };
  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadLiveSportElectGames());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  onLoginSBSport(sport) {
    const {dispatch, userModule} = this.props;
    let _this = this;
    let isLogin = userModule.user.get('auth').get('isLogin');
    if (!isLogin) {
      alert('请先登录');
    } else {
      this.openLoading();
      dispatch(getLiveLoginData(sport.flatCode, (data) => {
        _this.closeLoading();
        if (data.errorCode == RES_OK_CODE) {
          openGame(data.datas);
        } else {
          alert(data.msg);
        }
      }));
    }
  }

  render() {
    let sports = this.props.sport.get('sports');
    let sportLinks = this.sportLinks;
    return (
    <div className="page sport-page">
      <div>
        <Header {...this.props}>
          <Back backTo={'/'} />
          <h3>体育赛事</h3>
        </Header>
        
        <div className="page-body">
          <div className="sport-items">
            {sports.map( (sport, index) => {
              let to = sportLinks[sport['flatCode']];
              if (sport['flatCode'] == 'sb' || sport['flatCode'] == 'sbt') {
                return (
                  <a className="sport-item bg-ad " onClick={this.onLoginSBSport.bind(this, sport)} key={index}>
                    { sport.bigBackgroundPic && <img src={sport.bigBackgroundPic} className="image-bg" alt="" />}
                    <div className="inner">
                      <img src={ sport['bigPic'] } />
                      <h4>{sport.flatName}</h4>
                    </div>
                  </a>
                );
              }
              // 跳转第三方
              else if (!!!to) {
                return (
                  <a className="sport-item bg-ad " href={sport['flatUrl']} key={index}>
                    { sport.bigBackgroundPic && <img src={sport.bigBackgroundPic} className="image-bg" alt="" /> }
                    <div className="inner">
                      <img src={ sport['bigPic'] } />
                      <h4>{sport.flatName}</h4>
                    </div>
                  </a>
                );
              } else {
                return (
                  <Link className="sport-item bg-ad " key={index} to={to}>
                    {  sport.bigBackgroundPic && <img src={sport.bigBackgroundPic} className="image-bg" alt="" /> }
                    <div className="inner">
                      <img src={ sport['bigPic'] } />
                      <h4>{sport.flatName}</h4>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
    );
  }
};

function mapStateToProps(state) {
  const {app, userModule, sport} = state;
  return {
    app,
    userModule,
    sport
  }
}

export default connect(mapStateToProps)(SportContainer);