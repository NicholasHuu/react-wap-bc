import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../components/Back';

import LoadingComponent from '../components/LoadingComponent';
import {getGonggaoInfo, bodyClass, resetBodyClass} from '../actions/AppAction';

class AnnoucementContainer extends LoadingComponent {
  
  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  componentWillUnmount() {
    resetBodyClass();
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(getGonggaoInfo());
    bodyClass('ancm-body');
  }

  render() {
    const {app} = this.props;
    let messages = app.get('ggList');
    console.log(messages);
    return (
      <div className="page page-annoucement">
        <Header {...this.props}>
          <Back />
          <h3>系统公告</h3>
        </Header>
        <div className="page-body">
          <div className="acms">
            <div className="inner">
              {messages.map( (message, index ) => {
                return <div key={index} className="acm-item">
                  <div className="title">
                    <h3>{message.ggName}</h3>
                  </div>
                  <div className="body clearfix">
                    <p dangerouslySetInnerHTML={ {__html: message.ggContent}}></p>
                    <span>{message.createTime}</span>
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {app, userModule} = state;

  return {
    app, userModule
  }
}

export default connect(mapStateToProps)(AnnoucementContainer);