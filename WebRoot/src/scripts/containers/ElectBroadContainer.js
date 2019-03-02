import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import Header from '../components/Header';
import Back from '../components/Back';
import FooterMenu from '../components/FooterMenu';
import {loadLiveSportElectGames, getElectGameLoginData} from '../actions/AppAction';
import {RES_OK_CODE} from '../constants/AppConstant';
import LoadingComponent from '../components/LoadingComponent';
import {alert} from '../utils/popup';

class ElecBroadContainer extends LoadingComponent {
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadLiveSportElectGames());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  agGameElectLogin(electType) {
    const {dispatch, userModule} = this.props;
    let isLogin = userModule.user.get('auth').get('isLogin');
    if (!isLogin) {
      alert('请先登录');
      return ;
    }
    this.openLoading();
    dispatch(getElectGameLoginData(electType.flatCode, electType.gameCode, (data) => {
      this.closeLoading();
      if (data.errorCode == RES_OK_CODE) {
        window.open(data.datas);
      } else {
        alert(data.msg);
      }
    }));
  }

  render() {
    const electItems = this.props.elect.get('types');
    if (electItems.length % 3 != 0 ) {
      for (let i = 0; i < electItems.length % 3; i++) {
        electItems.push(null);
      }
    }
    return (
      <div className="page page-elect">
        <div>
          <Header {...this.props}>
            <Back backTo={'/'}  />
            <h3>电子游戏</h3>
          </Header>
          <div className="page-body">
            <div className="inner">
              <div className="elect-items">
                {electItems.map( (electType, index) => {
                  if (electType) {
                    if (electType.flatCode == 'ag') {
                      return (<div key={index} className={"elect-item bg-ad " + ( index % 3 == 2 ? 'no-border': '') }>
                        <a onClick={this.agGameElectLogin.bind(this, electType) } >
                          {electType.bigBackgroundPic && <img src={electType.bigBackgroundPic} className="image-bg" alt="" /> }
                          <div className="inner">
                            <img src={electType.bigPic} />
                            <h4>{electType.flatName}</h4>
                          </div>
                        </a>
                      </div>);
                    } else {
                      return (<div key={index} className={"elect-item bg-ad " + ( index % 3 == 2 ? 'no-border': '') }>
                        <Link to={'/elect/game/' + electType.flatCode + '/all'}>
                          {electType.bigBackgroundPic && <img src={electType.bigBackgroundPic} className="image-bg" alt="" /> }
                          <div className="inner">
                            <img src={electType.bigPic} />
                            <h4>{electType.flatName}</h4>
                          </div>
                        </Link>
                      </div>);
                    }
                  } else {
                    return <div key={index} className={"elect-item " + ( index % 3 == 2 ? 'no-border': '' )}></div>;
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
  const {userModule, app, elect} = state;
  return {
    userModule, app, elect
  };
}

export default connect(mapStateToProps)(ElecBroadContainer);