import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {loadLiveSportElectGames} from '../actions/AppAction';

import Header from '../components/Header';
import Back from '../components/Back';
import {alert} from '../utils/popup';
import {getLiveLoginData} from '../actions/AppAction';
import {RES_OK_CODE} from '../constants/AppConstant';

import {bodyClass, resetBodyClass} from '../actions/AppAction';
import FooterMenu from '../components/FooterMenu';

import {openGame} from '../utils/site';

class BBINContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadLiveSportElectGames());
    bodyClass('bbin-body');
  }

  componentWillUnmount() {
    resetBodyClass();
  }

  onItemClick(item) {
    const {dispatch, userModule} = this.props;
    let isLogin = userModule.user.get('auth').get('isLogin');
    if (!isLogin) {
      alert('请先登录');
    } else {
      dispatch(getLiveLoginData(item.flatCode, (data) => {
        if (data.errorCode == RES_OK_CODE) {
          openGame(data.datas);
        } else {
          alert(data.msg);
        }
      }, item.gameCode));
    }
  }

  render() {
    const {bbin} = this.props;
    return (
      <div className="page page-bbin">
        
        <Header className="bbin-header" {...this.props}>
          <Back />
          <h3>BBIN游戏</h3>
        </Header>

        <div className="page-body">
          <div className="banner bbin-banner">
            <div className="inner">
              
            </div>
          </div>
          <div className="bbin-items">
            <div className="inner">
              {bbin.get('items').map(item => {
                return (
                  <div key={item.gameCode} className="bbin-item bg-ad" onClick={this.onItemClick.bind(this, item)}>
                    {item.bigBackgroundPic && <img src={item.bigBackgroundPic} className="image-bg" alt=""/> }
                    <div className="inner">
                      <div className="img"><img src={item.bigPic} alt="" className="icon"/></div>
                      <h3>{item.flatName}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    );
  }
};

function mapStateToProps(state) {
  const {app, userModule, bbin} = state;
  return {
    app, userModule, bbin
  };
}

export default connect(mapStateToProps)(BBINContainer);