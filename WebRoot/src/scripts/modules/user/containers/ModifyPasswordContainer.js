import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import ModifyAccountPsw from '../components/ModifyAccountPsw';
import ModifyMoneyPsw from '../components/ModifyMoneyPsw';
import Header from '../components/Header';
import Back from '../../../components/Back';

class ModifyPasswordContainer extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
    const {history, userModule, match} = this.props;
    let has = userModule.user.get('info').hasWithdrawProfile;
    if (!has) {
      history.push('/user/setWithdraw');
    }
	}

	render() {
		const type = this.props.match.params.type;
		let whichModify = <ModifyAccountPsw {...this.props}/>
		if (type == 'ModifyMoneyPsw') {
		  	whichModify = <ModifyMoneyPsw {...this.props}/> 
		}

		return (
			<div className="page page-modify-password">
			  <Header {...this.props}>
			    <Back to={'/user'}/>
			    <h3>密码管理</h3>
			  </Header>
			  <div className="page-body">
			    <div className="inner">
			    	{whichModify}
			    </div>
			  </div>
			</div>
		);
	};
};

function mapStateToProps(state) {
  const {app, userModule} = state;
  return {
    app,
    userModule
  };
}

export default connect(mapStateToProps)(withRouter(ModifyPasswordContainer));