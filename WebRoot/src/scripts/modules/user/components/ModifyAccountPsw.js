import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import {changeLoginPwd, userLogout} from '../actions/User';
import {RES_OK_CODE, RES_BLOCKED_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import {alert} from '../../../utils/popup';
class ModifyAccountPsw extends LoadingComponent {

	constructor(props) {
		super(props);
		this.onConfirmUpdate = this.onConfirmUpdate.bind(this);
		this.onProcess = false;
	}
	
	componentDidMount() {
		//
	}

	onConfirmUpdate() {
		if (this.onProcess) {
			return ;
		}
		const {dispatch, location, history} = this.props;

		let oldpwd = this.refs.oldpwd;
		let newpwd = this.refs.newpwd;
		let confirmpwd = this.refs.confirmpwd;
		if (oldpwd.value == '') {
			alert('请输入6-16位数字/字母或组合的旧密码');
		}else if(oldpwd.value.length < 6 || newpwd.value.length > 16){
			alert('请输入6-16位数字/字母或组合的旧密码');
		}
		else if (newpwd.value == '') {
			alert('请输入6-16位数字/字母或组合的新密码');
		}
		else if (newpwd.value.length < 6 || newpwd.value.length > 16) {
			alert('请输入6-16位数字/字母或组合的新密码');
		}
		else if (confirmpwd.value == '') {
			alert('请输入6-16位数字/字母或组合的确认新密码');
		}
		else if (newpwd.value != confirmpwd.value) {
			alert('新密码与确认新密码不一致');
		} else if (newpwd.value == oldpwd.value) {
			alert('旧密码与新密码不能一致');
		} else {
			var r=confirm("确认修改密码");
		  if (r==true) {
		    this.openLoading();
				if (this.onProcess) return ;
				this.onProcess = true;
			 	dispatch(changeLoginPwd(oldpwd.value, newpwd.value, (apiRes) => {
			 		this.onProcess = false;
			 		this.closeLoading();
					if (apiRes.errorCode != RES_OK_CODE) {
						if (apiRes.errorCode == RES_BLOCKED_CODE) {
							window.alert(apiRes.msg);
							userLogout(() => {
								history.push('/');
							});
						} else {
							alert(apiRes.msg);
						}
					} else {
						alert('密码修改成功', (popup) => {
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
	    			<li className='active'><Link to={'/user/modifypw/ModifyAccountPsw'}>修改登录密码</Link></li>
	    			<li><Link to={'/user/modifypw/ModifyMoneyPsw'}>修改资金密码</Link></li>
	    		</ul>
	    	</div>
			
	    	<form className="modify-form">
	    		<div className="operation-charge">
		    		<h2><i></i>旧&nbsp;密&nbsp;码:<input type="password" ref="oldpwd" placeholder="请输入旧密码"/></h2>
		    		<h2><i></i>新&nbsp;密&nbsp;码:<input type="password" ref="newpwd" placeholder="请输入6-16位英文字母以及数字组合"/></h2>
		    		<h2><i></i>确认新密码:<input type="password" ref="confirmpwd" placeholder="请输入确认新密码"/></h2>
		    	</div>
	    		<div className="sumbit" onClick={this.onConfirmUpdate}>确认修改</div>
	    	</form>
		</div>
	);
  };
};

ModifyAccountPsw.propTypes = {

}

export default ModifyAccountPsw;