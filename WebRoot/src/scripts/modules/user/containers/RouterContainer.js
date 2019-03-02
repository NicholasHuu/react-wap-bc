import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Route, IndexRoute, IndexRedirect, withRouter} from 'react-router-dom';

import PanelContainer from './PanelContainer';
import LoginContainer from './LoginContainer';
import RegisterContainer from './RegisterContainer';
import PrivateRoute from '../../../containers/PrivateRouteContainer';
import OrderContainer from './OrderContainer';
import OrderContentContainer from './OrderContentContainer';
import MessageContainer from './ChatMessagesContainer';
import MessageContentContainer from './ChatContainer';
import ChargeContainer from './ChargeContainer';
import ChargeRecordContainer from './ChargeRecordContainer';
import WithdrawContainer from './WithdrawContainer';
import WithdrawFormContainer from './WithdrawFormContainer';
import AddBankContainer from './AddBankContainer';
import TransferPanelContainer from './TransferPanelContainer';
import TransferFormContainer from './TransferFormContainer';
import ModifyPasswordContainer from './ModifyPasswordContainer';
import ChargeFormContainer from './ChargeFormContainer';
import UserInfoContainer from './UserInfoContainer';
import TransferLogContainer from './TransferLogContainer';
import WithdrawLogContainer from './WithdrawLogContainer';
import ProtocolContainer from './ProtocolContainer';
import SecurityInfoContainer from './SecurityInfoContainer';
import BankListsContainer from './BankListsContainer';
import BankCardContainer from './BankCardContainer';
import BankDetailInfoContainer from './BankDetailInfoContainer';
import ChargeQuickFormContainer from './ChargeQuickFormContainer';
import AgentContainer from './AgentContainer';
import ForgetPwdContainer from './ForgetPwdContainer';
import ForgetResetPwdContainer from './ForgetResetPwdContainer';
import LotteryOrderContainer from './LotteryOrderContainer';
import LotteryTraceContainer from './LotteryTraceContainer';
import LotteryFundsContainer from './LotteryFundsContainer';
import LotteryFundsSearchContainer from './LotteryFundsSearchContainer';
import LotteryFundsDetailContainer from './LotteryFundsDetailContainer';
import UserProfitContainer from './UserProfitContainer';
import TeamProfitContainer from './TeamProfitContainer';
import PromoLinksContainer from './PromoLinksContainer';
import PromoLinkDetailContainer from './PromoLinkDetailContainer';
import UserSalaryContainer from './UserSalaryContainer';
import UserSalaryDetailContainer from './UserSalaryDetailContainer';
import PostSalaryContainer from './PostSalaryContainer';
import ChildSalaryDetailContainer from './ChildSalaryDetailContainer';
import TeamMemberContainer from './TeamMemberContainer';
import TeamMemberDetailContainer from './TeamMemberDetailContainer';
import DeployEarnPercentContainer from './DeployEarnPercentContainer';
import TransferChildContainer from './TransferChildContainer';
import PostStationLetter from './PostStationLetter';
import ChildSalaryFormContainer from './ChildSalaryFormContainer';
import AddTeamMemberContainer from './AddTeamMemberContainer';
import ChargeRecordDetailContainer from './ChargeRecordDetailContainer';
import WithdrawLogDetailContainer from './WithdrawLogDetailContainer';
import LotteryHowtoPanelContainer from './LotteryHowtoPanelContainer';
import LotteryHowtoDetailContainer from './LotteryHowtoDetailContainer.js';
import OrderContentDetailContainer from './OrderContentDetailContainer';
import NicknameContainer from './NicknameContainer';
import SetPhoneContainer from './SetPhoneContainer';
import SetWithdrawProfileContainer from './SetWithdrawProfileContainer';
import SetQQContainer from './SetQQContainer';
import AgentRegisterContainer from './AgentRegisterContainer';

import {loadUserInfo} from '../actions/User';
import {bodyClass, resetBodyClass} from '../../../actions/AppAction';

class RouterContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch, userModule} = this.props;
    if (userModule.user.get('auth').get('isLogin')) {
      //dispatch(loadUserInfo());
    }
  }

  render() {
    let {match} = this.props;
    return ( 
      <div className="user-module">
        <Route exact component={PanelContainer} path={ '/user' } />
        
        <Route component={ProtocolContainer} path={ '/user/protocol' } />
        
        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} component={UserInfoContainer} path={ '/user/info' } />

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} component={MessageContainer} path={ '/user/message' } />

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} component={MessageContentContainer} path={ '/user/viewmessage/:id/:group' } />

        <PrivateRoute exact component={OrderContainer} path={ '/user/order' } />

        <PrivateRoute exact component={NicknameContainer} path={`/user/nickname`} />

        <PrivateRoute exact component={SetPhoneContainer} path={`/user/phone`} />

        <PrivateRoute exact component={SetWithdrawProfileContainer} path={`/user/setWithdraw`} />

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  component={OrderContentContainer} path={ '/user/order/list' } />

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  component={OrderContentDetailContainer} path={ '/user/order/:type/:order' } />

        <PrivateRoute exact component={ChargeContainer} path={ '/user/charge/:type' } />

        <PrivateRoute exact component={ChargeQuickFormContainer} path={ '/user/charge/:type/:way' } />

		<PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  exact component={ChargeRecordContainer} path={ '/user/chargerecord' } />        
        
        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  exact component={ChargeRecordDetailContainer} path={ '/user/chargerecord/:id' } />        

        <PrivateRoute component={ChargeFormContainer} path={ '/user/charge/:type/form/:channel' } />

        <PrivateRoute 
          onEnter={()=> bodyClass('light-gray')} 
          onExist={() => resetBodyClass()}  exact component={WithdrawContainer} path={ '/user/withdraw' } />

        <PrivateRoute component={AddBankContainer} path={ '/user/withdraw/addbankcard/:bankName' }/>

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} exact component={WithdrawLogContainer} path={'/user/withdraw/log'}/>

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  component={WithdrawLogDetailContainer} path={'/user/withdraw/log/:id'}/>

        <PrivateRoute component={WithdrawFormContainer} onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} path={ '/user/withdraw/form/:bank' }/>

        <PrivateRoute exact component={TransferPanelContainer} path={ '/user/transfer' } />

        <PrivateRoute onEnter={() => bodyClass('light-gray')} onExist={() => resetBodyClass()} component={TransferLogContainer} path={'/user/transferlog'} />

        <PrivateRoute exact component={TransferFormContainer} path={ '/user/transfer/:platform/:direction' } /> 

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} exact component={ModifyPasswordContainer} path={ '/user/modifypw/:type' } /> 

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} exact component={SecurityInfoContainer} path={ '/user/security' } /> 

        <PrivateRoute exact component={BankListsContainer} path={ '/user/banklist/:type/:id' } /> 

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()}  exact component={BankCardContainer} path={ '/user/bankcard' } /> 

        <PrivateRoute component={BankDetailInfoContainer} path={ '/user/bankdetail/:id/:bankName' } /> 

        <PrivateRoute component={AgentContainer} path="/user/agent"/>

        <Route component={ForgetPwdContainer} exact path="/user/forget"/>

        <Route component={ForgetResetPwdContainer} path="/user/forget/reset"/>

        <PrivateRoute component={LotteryOrderContainer} path="/user/lotteryorder" />

        <PrivateRoute component={LotteryTraceContainer} path="/user/tracehistory" />

        <PrivateRoute component={LotteryFundsContainer} exact path="/user/lotteryfunds" />

        <PrivateRoute component={LotteryFundsSearchContainer}  path="/user/lotteryfunds/search" />

        <PrivateRoute component={LotteryFundsDetailContainer}  path="/user/lotteryfunds/detail/:id" />

        <PrivateRoute component={UserProfitContainer}  path="/user/userprofit" />

        <PrivateRoute component={TeamProfitContainer}  path="/user/team/profit" />

        <PrivateRoute component={PromoLinksContainer} exact path="/user/promolinks" />

        <PrivateRoute component={PromoLinkDetailContainer}  path="/user/promolinks/:id" />

        <PrivateRoute path="/user/salary" component={UserSalaryContainer} />

        <PrivateRoute path="/user/salarydetail/:id" component={ChildSalaryDetailContainer} />

        <PrivateRoute path="/user/teammanager" exact component={TeamMemberContainer} />

        <PrivateRoute path="/user/teammanager/:id" exact component={TeamMemberDetailContainer} />

        <PrivateRoute path="/user/teammanager/:id/fd" component={DeployEarnPercentContainer} />

        <PrivateRoute path="/user/teammanager/:id/transfer" component={TransferChildContainer} />

        <PrivateRoute path="/user/teammanager/:id/letter" component={PostStationLetter} />

        <PrivateRoute path="/user/teammanager/:id/salary" component={ChildSalaryFormContainer} />

        <PrivateRoute path="/user/team/adduser" component={AddTeamMemberContainer} />

        <PrivateRoute path="/user/lotteryhowto" exact component={LotteryHowtoPanelContainer} />

        <PrivateRoute path="/user/qq" exact component={SetQQContainer} />

        <PrivateRoute onEnter={()=> bodyClass('light-gray')} onExist={() => resetBodyClass()} path="/user/lotteryhowto/:lottery" component={LotteryHowtoDetailContainer} />
            


      </div>
    );
  }
};

RouterContainer.propTypes = {
  match: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const {userModule} = state;
  return {
    userModule
  };
}

export default connect(mapStateToProps)(withRouter(RouterContainer));

