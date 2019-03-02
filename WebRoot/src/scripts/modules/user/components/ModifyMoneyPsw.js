import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import {changeWithdrawPwd, userLogout} from '../actions/User';
import {RES_OK_CODE, RES_BLOCKED_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import {alert} from '../../../utils/popup';
class ModifyMoneyPsw extends LoadingComponent {

	constructor(props) {
		super(props);
		this.onConfirmUpdate = this.onConfirmUpdate.bind(this);
		this.onProcess = false;
	}

	componentDidMount() {
		//
	}
	
	onConfirmUpdate() {
		const {dispatch, history} = this.props;
		let oldpwd = this.refs.oldpwd;
		let newpwd = this.refs.newpwd;
		let confirmpwd = this.refs.confirmpwd;
		if (oldpwd.value == '') {
			alert('请输入正确的4位旧密码 ');
		}
		else if (newpwd.value == '') {
			alert('请输入正确的4位新密码 ');
		}
		else if (!newpwd.value.match(/^\d{4}$/)) {
			alert('请输入正确的4位新密码');
		}
		else if (confirmpwd.value == '') {
			alert('请输入正确的4位确认新密码 ');
		}
		else if (newpwd.value != confirmpwd.value) {
			alert('请输入正确的4位确认新密码 ');
		} else if (newpwd.value == oldpwd.value) {
			alert('旧密码与新密码不能一致 ');
		} else {
			var r = confirm("确认修改密码");
			if(r == true){
				let _this = this;
				if (_this.onProcess) return ;
				_this.onProcess = true;
				_this.openLoading();
			 	dispatch(changeWithdrawPwd(oldpwd.value, newpwd.value, (apiRes) => {
			 		_this.onProcess = false;
			 		_this.closeLoading();
					if (apiRes.errorCode != RES_OK_CODE) {
						if (apiRes.errorCode == RES_BLOCKED_CODE) {
							alert(apiRes.msg);
								userLogout(() => {
									history.push('/');
								});
						} else {
							alert(apiRes.msg);
						}
					} else {
						alert(apiRes.msg, (popup) => {
							popup.close();
							history.push('/user');
						});
					}
			 	}));
			}else{
				return false;
			}
			
		}
	}

  render() {
    return (
    	<div className="common-style modify-account">
	    	<div className="style-charge">
	    		<ul className="clearfix">
	    			<li><Link to={'/user/modifypw/ModifyAccountPsw'}>修改登录密码</Link></li>
	    			<li className='active'><Link to={'/user/modifypw/ModifyMoneyPsw'}>修改资金密码</Link></li>
	    		</ul>
	    	</div>
			
	    	<form className="modify-form">
	    		<div className="operation-charge">
		    		<h2><i></i>旧&nbsp;密&nbsp;码:<input type="password" maxLength="4" ref="oldpwd" placeholder="请输入旧密码"/></h2>
		    		<h2><i></i>新&nbsp;密&nbsp;码:<input type="password" maxLength="4" ref="newpwd" placeholder="请输入4位数字密码"/></h2>
		    		<h2><i></i>确认密码:<input type="password" maxLength="4" ref="confirmpwd" placeholder="请输入确认新密码"/></h2>
		    	</div>
	    		<div className="sumbit" onClick={this.onConfirmUpdate}>确认修改</div>
	    	</form>
		</div>
	);
  };
};

export default ModifyMoneyPsw;