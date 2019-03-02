import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link ,withRouter} from 'react-router-dom';
import {bodyClass,resetBodyClass} from '../../../../scripts/actions/AppAction';

class  NotLogin extends Component{
  constructor(props){
    super(props);
  }
  componentWillMount(){
    bodyClass("grayy");
  }
  componentWillUnmount(){
    resetBodyClass("");
  }
  render(){
    return(

      <div className="not-login">
     
        <div>
          <img src="../../misc/images/sport/header-icon.png" alt=""/>
        </div> 
        <p>未登录</p>
        <p>请登陆后查看您的注单</p>
        <br /><br />
        <Link className="sport-btn" to={'/login'}>登录</Link><br />
        <Link className="sport-btn" to={'/register'}>注册</Link>
      </div>

      )
  }

}



export default NotLogin;