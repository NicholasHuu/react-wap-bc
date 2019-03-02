import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {changeUserBasicInfo} from '../actions/User';
import {alert} from '../../../utils/popup';
import {Link} from 'react-router-dom';

class UserDetailInfo extends Component {  
  constructor(props){
    super(props);
    this.onChange = this.props.onChange;
    this.setUserInfoState(props);
    this.bnameChange = this.bnameChange.bind(this);
  }

  setUserInfoState(props){
    const {user} = props;
    this.state = {
      qq : user.get('info').qq,
      email : user.get('info').mail,
      bname: user.get('info').nickName || '',
    };
  }

  bnameChange(el) {
    let val = el.target.value;
    this.setState({
      bname: val
    });
  }
 
  modify(){
    const {user} = this.props;
    let bname = this.state.bname;
    let args = [];
    if (bname.length <= 0 ) {
      alert("请输入昵称");
    } else{
      this.onChange.apply(this, [bname]);
    }
    
  }
  componentWillReceiveProps(nextProps) {
    this.setUserInfoState(nextProps);
  }

  render() {
    const {user} = this.props;
    let money = user.get('info').userMoney;
    let _this = this;
    if(!money){
      money = 0;
    }
    return (
      <div>

        <div className="user-detail-info">
          <div className="inner">
            <h3>会员信息</h3>
            <ul className="clearfix">
              <li><span className="label">用户名</span><span className="cont">{user.get('info').userName}</span></li>
              <li>
                <span className="label">用户类型</span>
                <span className="cont">{user.get('info').agentDesc}</span>
              </li>
              <li><span className="label">姓名</span><span className="cont">{ user.get('info').userRealName } { user.get('info').userRealName ? '': <Link to={`/user/setWithdraw`}>完善信息></Link> }</span></li>
              <li><span className="label">余额</span><span className="cont color-orange">{money}</span></li>
              {false && <li><span className="label">会员等级</span><span className="cont">{user.get('userLevel').typeName}</span></li>}
              <li><span className="label">昵称</span><span className="cont">{user.get('info').nickName} { user.get('info').nickName ? '':  <Link to={`/user/nickname`}>设置></Link> }</span></li>
              <li><span className="label">QQ</span><span className="cont">{ user.get('info').qq } { user.get('info').qq ? '': <Link to={'/user/qq'}>设置></Link> } </span></li>
              <li>
                <span className="label">手机号</span>
                <span className="cont">{user.get('info').mobile ? user.get('info').mobile: <Link to={`/user/phone`}>设置></Link> }</span>
              </li>
              <li><span className="label">团队人数</span><span className="cont">{user.get('info').teamCount}</span></li>
            </ul>
            <h3>返点信息</h3>
            <ul className="clearfix info-item">
              <li><span className="label">彩票返点</span><span className="cont">{user.get('info').backWater.lottery}</span></li>
              <li><span className="label">电子返点</span><span className="cont">{user.get('info').backWater.electronic}</span></li>
              <li><span className="label">真人返点</span><span className="cont">{user.get('info').backWater.live}</span></li>
              <li><span className="label">体育返点</span><span className="cont">{user.get('info').backWater.sport}</span></li>
              <li><span className="label">捕鱼返点</span><span className="cont">{user.get('info').backWater.fish}</span></li>
            </ul>

            <h3>安全信息</h3>
            <ul className="clearfix info-item">
              <li><span className="label">上次登录时间</span><span className="cont">{user.get('info').lastLoginTime}</span></li>
              <li><span className="label">上次登录IP</span><span className="cont">{user.get('info').lastLoginIp}</span></li>
            </ul>

          </div>
        </div>

      </div>
      

    );
  }
};

UserDetailInfo.propTypes = {
  user: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const {app, userModule} = state;
  return {
    app, userModule
  };
}
export default connect(mapStateToProps)(UserDetailInfo);