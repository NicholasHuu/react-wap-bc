import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Route, Link, Redirect, withRouter} from 'react-router-dom';

import {store} from '../stores/AppStore';

if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

class PrivateRouteContainer extends Route {

  componentWillReceiveProps(nextProps, nextContext) {
    super.componentWillReceiveProps(nextProps, nextContext);    
    const {path} = nextProps;
    const oldPath = this.props;
    let match = this.state.match;
    if (match && path != oldPath) {
      this.props.onExist && this.props.onExist();
    }
  }

  render() {
    let {path} = this.props;
    let state = this.context.store.getState();
    let user = state.userModule.user;
    let match = this.state.match;
    if (match) {
      if (user.get('auth').get('isLogin')) {
        let component = super.render();
        this.props.onEnter && this.props.onEnter();
        return component;
      } else {
        return <Redirect to='/login' />;
      }
    } else {
      return null;
    }
  }
};

PrivateRouteContainer.contextTypes = Object.assign({}, Route.contextTypes, {
  store: PropTypes.object.isRequired
});

PrivateRouteContainer.propTypes = Object.assign({}, Route.propTypes, {
  onEnter: PropTypes.func,
  onExist: PropTypes.func
});


export default PrivateRouteContainer;