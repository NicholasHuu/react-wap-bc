import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';

import {loadLotteryHowto} from '../actions/User';
import {loadAllLottery} from '../actions/UserOrder';
import PTR from '../../../utils/pulltorefresh';

class LotteryHowtoDetailContainer extends LoadingComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const {dispatch, match} = this.props;
    dispatch(loadAllLottery());
    dispatch(loadLotteryHowto(match.params.lottery));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lotteryHowto != this.props.lotteryHowto) {
      this.closeLoading();
    }
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch, match} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.page-body-inner',
      refreshHandler({close, handler}) {
        dispatch(loadLotteryHowto(match.params.lottery, () => {
          close();
        }));
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }
  
  render() {
    const {lotteryHowto, lotteryItems, match} = this.props;
    
    let lotteryCode = lotteryItems.filter(item => item.lotteryCode == match.params.lottery);

    return (
      <div className="page page-howto-detail">
        
        <Header {...this.props}>
          <Back />
          <h3>{ lotteryCode.length > 0 ? lotteryCode[0].lotteryName: '彩票信息' }</h3>
        </Header>

        <div className="page-body">
          <div className="page-body-inner">
          <div className="tables">
            
            {lotteryHowto[match.params.lottery] 
              && lotteryHowto[match.params.lottery].gameGroup 
              && lotteryHowto[match.params.lottery].gameGroup.map( (group, index) => {
              
              return <div key={index} className="table">
                <div className="wrap">
                  <h3>{group.name}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>玩法组</th>
                        <th>玩法</th>
                        <th>高奖金</th>
                        <th>高返点</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                        {group.groupDetails.map( (groupDetail, index2) => {

                          return groupDetail.games.map( (game, index3) => {
                            return <tr key={`${index2}-${index3}`}>
                              { index3 == 0 &&  <td rowSpan={ groupDetail.games.length }>{groupDetail.name}</td> }
                              <td>{game.name}</td>
                              <td>{game.gj}</td>
                              <td>{game.gf}</td>
                            </tr>
                          } );
                        })}
                    </tbody>

                  </table>
                </div>
              </div>

            } )}
            
          </div></div>

        </div>

      </div>
    );
  }


};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    lotteryHowto: userModule.user.get('lotteryHowto'),
    lotteryItems: userModule.order.get('lotteryItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryHowtoDetailContainer));