import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {HashRouter as Router, IndexRoute, IndexRedirect, withRouter, Redirect} from 'react-router-dom';

import UserRouterContainer from '../modules/user/containers/RouterContainer';
import LoginContainer from '../modules/user/containers/LoginContainer';
import RegisterContainer from '../modules/user/containers/RegisterContainer';
import AgentRegisterContainer from '../modules/user/containers/AgentRegisterContainer';
import HomeContainer from './HomeContainer';
import GameContainer from './GameContainer';
import OtherGameContainer from './OtherGameContainer';
import PrivateRoute from './PrivateRouteContainer';
import OnlineServiceContainer from './OnlineServiceContainer';
import LinecheckContainer from './LinecheckContainer';
import PromotionContainer from './PromotionContainer';
import PromotionDetailContainer from './PromotionDetailContainer';
import ResponsiveContainer from './ResponsiveContainer';
import RuleContainer from './RuleContainer';
import FairContainer from './FairContainer';
import PageContainer from './PageContainer';
import LiveContainer from './LiveContainer';
import ElectBroadContainer from './ElectBroadContainer';
import SportContainer from './SportContainer';
import ElectGameContainer from './ElectGameContainer';
import CompanyPromotionContainer from './CompanyPromotionContainer';
import ModifyPhoneContainer from './ModifyPhoneContainer';
import CardGameContainer from './CardGameContainer';
import AnnoucementContainer from './AnnoucementContainer';
import BBINContainer from './BBINContainer';
import ScrollTop from '../components/ScrollTop';
import LotteryRouter from '../modules/lottery/containers/RouterContainer';
import HgRouter from '../modules/hgsport/containers/RouterContainer';
import {userLogin} from '../modules/user/actions/User';
import TestContainer from './TestContainer';
import DynamicModuleContainer from './DynamicModuleContainer';
import DynamicDetailContainer from './DynamicDetailContainer';
import PickLotteryContainer from './PickLotteryContainer';
import {loadFormNotice, loadFormInformation, loadSiteInfo, loadSystemCode} from '../actions/AppAction';
import {bodyClass, resetBodyClass} from '../actions/AppAction';
import Route from '../components/Route';
import {parseQuery} from '../utils/url';
import TimesLotteryRouter from '../modules/lotterytimes/containers/RouterContainer';
import AgentReportRouter from '../modules/agent/containers/RouterContainer';

import {countMessage} from '../modules/user/actions/Message';
import {loadUserBalance} from '../modules/user/actions/User';

const INTERVAL_SECOND = 1000 * 60; // x秒调用1次

class RouterContainer extends Component {

  constructor(props) {
    super(props);
    this.search = parseQuery(window.location.search);
    this.refreshTimer = null;
  }

  autoRefreshBalance() {
    return ;
    if (this.refreshTimer) this.stopRefreshBalance();
    this.refreshTimer = setInterval(() => {
      const {dispatch} = this.props;
      //dispatch(loadUserBalance());
    }, INTERVAL_SECOND);
  }

  stopRefreshBalance() {
    clearInterval(this.refreshTimer);
    this.refreshTimer = null;
  }
  
  componentWillMount() {
    const {dispatch, userModule} = this.props;
    const isLogin = userModule.user.get('auth').get('isLogin');
    dispatch(loadSiteInfo());

    if (this.search && this.search.p && isLogin === false) {
      return;
    }
    
    dispatch(userLogin());
    if (isLogin) {
      this.autoRefreshBalance();  
    }
    
  }

  componentWillUnmount(){
    this.stopRefreshBalance();
  }

  render() {
    const {userModule} = this.props;
    const isLogin = userModule.user.get('auth').get('isLogin');
    let search = this.search;
    if (this.search && this.search.p && isLogin === false) {
      
    }
    return (
      <Router>
        <div>
          <Route exact path='/' render={ () => {
            return <HomeContainer />;
            // if (search && search.p && isLogin === false) {
            //   return <Redirect to="/register"/>
            // } else {
            //   return <HomeContainer />
            // }
          }}  />

          <Route component={LoginContainer} path='/login' />

          <Route component={RegisterContainer} path='/register' />

          <Route component={AgentRegisterContainer} path='/agent/register'/>

          <Route onEnter={()=> bodyClass('light-more-gray')} onExist={() => resetBodyClass()} component={OnlineServiceContainer} path='/online-service' />

          <Route component={LinecheckContainer} path='/linecheck'/>

          <Route exact component={PromotionContainer} path='/promotion' />

          <Route component={PromotionDetailContainer} path='/promotion/:id' />

          <Route component={ResponsiveContainer} path='/responsive' />

          <Route component={RuleContainer} path='/rule' />

          <Route component={FairContainer} path='/fair' />

          <Route component={PageContainer} path='/page/:name' />

          <Route component={LiveContainer} path='/live'/>

          <Route exact component={ElectBroadContainer} path='/elect'/>

          <Route path='/elect/game/:name' onEnter={()=> bodyClass('black_bg')} onExist={() => resetBodyClass()} component={ElectGameContainer} />

          <Route path='/user' component={UserRouterContainer} />

          <Route path='/lottery' component={LotteryRouter} />

          <Route path='/sport' component={SportContainer} />

          <Route path='/CompanyPromotion' component={CompanyPromotionContainer} />

          <Route path='/hgsport' component={HgRouter} />

          <Route path='/game' component={GameContainer} />
          <Route path='/other' component={OtherGameContainer} />

          <Route path='/bbin' component={BBINContainer} />

          <Route path='/cards' component={CardGameContainer} />

          <Route path='/annoucement' component={AnnoucementContainer} />

          <Route exact onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  component={ModifyPhoneContainer} path={ '/modifyphone' } />   

          <Route exact path="/dynamic/module/:region" component={DynamicModuleContainer} />

          <Route exact path="/dynamic/detail/:region" component={DynamicDetailContainer}/>

          <Route path='/test' component={TestContainer} />

          <Route path='/lotterytimes' component={TimesLotteryRouter} />

          <Route path='/agentreport' component={AgentReportRouter} />

          <Route path='/picklottery' component={PickLotteryContainer} />

          <ScrollTop />

        </div>
      </Router>
    );
  }
};

RouterContainer.propTypes = {};

function mapStateToProps(state) {
  const {userModule} = state;
  return {
    userModule
  };
}

export default connect(mapStateToProps)(RouterContainer);