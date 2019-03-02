import React, {PropTypes, Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import LoadingComponent from '../../../components/LoadingComponent';
import Header from '../components/Header';
import Back from '../../../components/Back';
import {securityLog} from '../actions/User';
import {RES_OK_CODE} from '../../../constants/AppConstant';
class SecurityInfoContainer extends LoadingComponent {

  constructor(props){
    super(props);
  }
  
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(securityLog());
  }
  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  render() {
    const {user} = this.props.userModule;
    let log = user.get('security');
    return (
      <div className="page page-security">
        <div>
          <Header {...this.props}>
            <Back />
            <h3>安全信息</h3>
          </Header>
          <div className="page-body">
            <div className="security-list">
              <ul>
                {log.map(function(item,index){
                  let position = item.ipPosition;
                  let str = "";
                  if(position != ""){
                    str = '('+position+')';
                  }else{
                    str = '';
                  }
                  return(
                  <li key={index}>
                    <h3>登录时间：<span className="color-style-id">{item.createTime}</span></h3>
                    <p>设备：<span className="color-style-id">{item.loginDevice}</span></p>
                    <p className="color-style-id">IP：<span>{item.logAddress}{str}</span></p>
                  </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
};


function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  }
}

export default connect(mapStateToProps)(withRouter(SecurityInfoContainer));

