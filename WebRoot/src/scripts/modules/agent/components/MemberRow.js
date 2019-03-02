import React, {Component, PropTypes} from 'react';


class MemberRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetail: false
    };
    this.showDetail = this.showDetail.bind(this);
  }

  showDetail() {
    this.setState({
      showDetail: !this.state.showDetail
    });
  }
  
  render() {
    const {member, index} = this.props;
    return (
      <div className="member-detail">
        <table className="member-row" onClick={this.showDetail}>
          <tbody>
            <tr>
              <td rowSpan="2" width="10%">
                <span className="radius">{index}</span>
              </td>
              <td width="40%">帐号</td>
              <td width="40%">昵称</td>
              <td rowSpan="2" width="10%">
                <i className={ "arrow-down " + ( this.state.showDetail && 'arrow-down-down' )}></i>
              </td>
            </tr>
            <tr>
              <td>{member.userName}</td>
              <td>{member.realName}</td>
            </tr>
          </tbody>
        </table>
        {this.state.showDetail && <table className="member-finace">
          <thead>
            <tr>
              <th>余额</th>
              <th>入款</th>
              <th>出款</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{member.balance}</td>
              <td>{member.income}</td>
              <td>{member.pay}</td>
            </tr>
            <tr>
              <td colSpan="3" className="no-padding">
                <table>
                  <tbody>
                    <tr className="two-column">
                      <td style={ { 'borderRight': '1px solid #a8a8a8', 'borderBottom': '1px solid #a8a8a8' } }>登录信息</td>
                      <td style={ {'borderBottom': '1px solid #a8a8a8'} }>开户日期</td>
                    </tr>
                    <tr className="two-column">
                      <td style={ {'borderRight': '1px solid #a8a8a8'} }>{member.loginfo}</td>
                      <td>{member.openDate}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table> }
      </div>

    );
  }

};

MemberRow.propTypes = {
  member: PropTypes.object,
  index: PropTypes.string
};

MemberRow.defaultProps = {
  member: {},
  index: '01'
};

export default MemberRow;