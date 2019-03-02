import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link ,withRouter} from 'react-router-dom';


class  NotLogin extends Component{

  render(){
    return(

      <div className="not-login">
     
        <div>
          <img src="../../misc/images/sport/header-icon.png" alt=""/>
        </div> 
        <p>未登录</p>
        <p>请登陆后查看您的注单</p>
        <br /><br />
        <Link className="lottery-btn sport-btn" to={'/login'}>登录</Link>
      </div>

      )
  }

}



export default NotLogin;