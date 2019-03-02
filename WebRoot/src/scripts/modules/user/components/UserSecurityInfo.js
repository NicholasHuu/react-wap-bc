import React, {Component, PropTypes} from 'react';

class UserSecurityInfo extends Component {
  render() {
    const {user} = this.props;
    return (
      <div className="user-security-info">
        <div className="iner">
          <h2>安全信息</h2>
          <ul className="clearfix">
            <li><span className="label">上次登录时间：</span><span className="cont">{user.get('info').userLastLoginTime}</span></li>
            <li className="word-color"><span className="label">上次登录IP：</span><span className="cont">{user.get('info').userLastLoginIp}</span></li>
          </ul>
        </div>
      </div>
    );
  }
};

UserSecurityInfo.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserSecurityInfo;