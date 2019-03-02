import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {loadSportDetail, tempSaveSelectedOrder} from '../actions/HgActionPart';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';
import {buildQuery} from '../../../utils/url';
import LoadingComponent from '../../../components/LoadingComponent';
import Popup from 'react-popup';
import {loading} from '../../../utils/popup';

class BasePattern extends Component {

  closeLoading() {
    Popup.close(this.loadingUI);
  }

  openLoading() {
    this.loadingUI = loading();
    Popup.queue(this.loadingUI);  
  }

  handleGoOrderClick(rType, bType, dType, selection, period) {
    
    const {userModule, match, dispatch, history} = this.props;
    
    if (!userModule.user.get('auth').get('isLogin')) {
      history.push('/login');
      return ;
    }

    const event = this.props.score;
    let timeType = match.path.replace('/hgsport', '').replace('/', '');
    if (timeType == "") {
      timeType = 'today';
    }
    let query = {
      gid: event.gid,
      timeType,
      rType,
      bType,
      dType,
      selection,
      period
    };
    
    let _this = this;
    let _arguments = arguments;
    _this.openLoading();
    dispatch(loadSportDetail(query, data => {
      _this.closeLoading();
      if (data.errorCode == RES_OK_CODE) {
        dispatch(tempSaveSelectedOrder({
          query,
          score: _this.props.score,
          data
        }));
        history.push(_this.createOrderURL.apply(_this, _arguments));
      } else {
        alert(data.msg);
      }
    }));
  }

  createOrderURL(rType, bType, dType, selection, period) {
    const event = this.props.score;
    const {match, history} = this.props;
    let timeType = match.path.replace('/hgsport/', '');
    let to = '/hgsport/order/create?rType='+rType+'&timeType='+timeType;
      
    return to;
  }
};

export default BasePattern;