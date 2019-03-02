import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import Header from '../components/Header';
import Back from '../components/Back';
import FooterMenu from '../components/FooterMenu';
import {loadPageTemplate} from '../actions/AppAction';
import {parseQuery} from '../utils/url';

class PageContainer extends Component {
  
  constructor(props) {
    super(props);
    this.name = this.props.match.params.name;
    this.query = parseQuery(this.props.location.search);

  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadPageTemplate(this.name));
  }

  render() {
    const {app} = this.props;
    const pageTemplates = this.props.app.get('pageTemplates');
    return (
      <div className="page page-page">
        <div>
            <Header {...this.props}>
              <Back />
              <h3>{this.query.title}</h3>
            </Header>
            <div className="page-body">
              <div className="inner" dangerouslySetInnerHTML={ {__html: pageTemplates[this.name] }}></div>
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

export default connect(mapStateToProps)(withRouter(PageContainer));