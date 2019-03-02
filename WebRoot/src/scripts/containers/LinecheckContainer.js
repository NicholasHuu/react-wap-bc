import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Back from '../components/Back';
import Header from '../components/Header';
import FooterMenu from '../components/FooterMenu';
import {loadSiteInfo} from '../actions/AppAction';

class LinecheckContainer extends Component {
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadSiteInfo());
  }

  render() {
    const domains = this.props.app.get('domains');
    let backupDomains = domains.get('backup');
    return (
      <div className="page page-linechk">
        <Header {...this.props}>
          <Back />
          <h3>备用网址</h3>
        </Header>
        <div className="page-body">
          <div className="linecheck-img"><img src="../../misc/images/line-check-img.png" /></div>
          <table>
            <tbody>
              {backupDomains.map( (domain, index) => {
                return (
                  <tr key={domain}>
                    <td>备用域名{index + 1}:</td>
                    <td>{domain}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state)  {
  const {app, userModule} = state;
  return {
    app,
    userModule
  };
}

export default connect(mapStateToProps)(LinecheckContainer);

