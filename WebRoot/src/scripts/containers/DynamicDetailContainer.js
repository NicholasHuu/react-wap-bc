import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

import {withRouter} from 'react-router-dom';
import Header from '../components/Header';
import Back from '../components/Back';

import LoadingComponent from '../components/LoadingComponent';
import {loadDynamicBrick, loadDynamicArticleList } from '../actions/AppAction';
import {parseQuery} from '../utils/url';
import AdBanner from '../components/AdBanner';

import {getRenderMethod} from '../components/ToyBrick';

class DynamicDetailContainer extends Component {
  constructor(props) {
    super(props);
    const {location, match} = this.props;
    this.region = match.params.region;
    let query = parseQuery(location.search);
    this.moduleId = query.module;
    this.articleId = query.article;
  }

  renderImageMode(article) {
    return <AdBanner image={article.articleBigImages}/>
  }

  renderContent(article) {
    return <div style={ {padding: '.5rem'} } dangerouslySetInnerHTML={ {__html: article.articleContent} }></div>;
  }

  render() {
    const article = this.props.app.get('viewingArticle');
    let content = null;
    if (article &&  article.showType == 2) {
        content = this.renderContent(article);
    } else if (article &&  article.showType == 1) {
      content = this.renderImageMode(article);
    }

    return (
      <div className="page page-dynamic-detail">
        <div className="inner">
          <Header {...this.props}>
            <Back />
            <h3>{article && ( article.articleTitle || '')}</h3>
          </Header>
          <div className="page-body">{content}</div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const {userModule, app, brick} = state;
  return {
    app,
    userModule,
    brick
  };
}

export default connect(mapStateToProps)(DynamicDetailContainer);