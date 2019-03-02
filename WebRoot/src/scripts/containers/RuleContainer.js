import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../components/Back';
import FooterMenu from '../components/FooterMenu';
import {loadPageTemplate} from '../actions/AppAction';

class RuleContainer extends Component {
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadPageTemplate('m_rule'));
  }

  render() {
    const {app} = this.props;
    const pageTemplates = this.props.app.get('pageTemplates');
    return (
      <div className="page page-responsive">
        <div>
            <Header {...this.props}>
              <Back />
              <h3>服务与条款</h3>
            </Header>
            <div className="page-body">
              <div className="inner" dangerouslySetInnerHTML={ {__html: pageTemplates.m_rule }}></div>
            </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const {app, userModule} = state;

  return {
    app,
    userModule,
  }
}

export default connect(mapStateToProps)(RuleContainer);