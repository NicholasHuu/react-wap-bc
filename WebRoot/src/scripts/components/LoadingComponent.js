import React, {Component, PropTypes} from 'react';
import {loading} from '../utils/popup';
import Popup from 'react-popup';

class LoadingComponent extends Component {
  
  constructor(props) {
    super(props);
    this.loadingUI = null;
  }

  componentDidMount() {
    this.openLoading();
  }

  closeLoading() {
    if (this.loadingUI){
      this.loadingUI = null;
      Popup.close(this.loadingUI);  
    }
    
  }

  openLoading() {
    this.loadingUI = loading();
    Popup.queue(this.loadingUI); 
  }

};

export default LoadingComponent;