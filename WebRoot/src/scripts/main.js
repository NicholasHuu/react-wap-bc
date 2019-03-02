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

if (typeof Array.prototype.clone == 'undefined') {
  Array.prototype.clone = function () {
    return this.slice(0);
  }
}

import 'babel-polyfill';

import Promise from 'promise-polyfill'; 

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import ReactDom from 'react-dom';
import Popup from 'react-popup';
import '../sass/style.scss';

import AppContainer from './containers/AppContainer';
import RouterContainer from './containers/RouterContainer';
import createStore from './stores/AppStore';

const store = createStore();

if (process.env.NODE_ENV == 'production') {
  console.log = () => {};
}

window.em = (...num) => {
  for (let arg of num) {
    console.log(arg / 30);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  //
});

let height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
document.documentElement.style['minHeight'] = `${height}px`;
document.body.style['minHeight'] = `${height}px`;

ReactDom.render(
  <Provider store={store} >
    <AppContainer>
      <Popup />
      <RouterContainer />
    </AppContainer>
  </Provider>
, document.getElementById('application'));