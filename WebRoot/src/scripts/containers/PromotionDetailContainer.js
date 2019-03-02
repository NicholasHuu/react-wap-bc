import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {withRouter} from 'react-router';

import Back from '../components/Back';
import Header from '../components/Header';
import FooterMenu from '../components/FooterMenu';
import Slider from '../components/Slider';
import {loadPromotionItems} from '../actions/AppAction';
import LoadingComponent from '../components/LoadingComponent';
import AdBanner from '../components/AdBanner';

class PromotionDetailContainer extends LoadingComponent {

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadPromotionItems());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  render() {
    const {app, promotion, match} = this.props;
    let promotionItems = promotion.get('items');

    let pid = match.params.id;
    let promItem = promotionItems.filter( prom => prom.id == pid )[0];
      
    if (!promItem) {
      return null;
    } else {
      return (
        <div className="page page-promotion">
          <div>
            <Header {...this.props}>
              <Back />
              <h3>{promItem.pmsTitle}</h3>
            </Header>
            <div className="page-body">
              <AdBanner image={(promItem.pmsBigPic)} />
               <div className="promo-content"> 
                <div className="inner" dangerouslySetInnerHTML={ {__html: promItem.pmsContent} }></div>
               </div>
            </div>
          </div>
        </div>
      );
    }

    
  };
};

function mapStateToProps(state) {
  const {app, userModule, promotion} = state;
  return {
    app, 
    userModule,
    promotion
  };
}

export default connect(mapStateToProps)(withRouter(PromotionDetailContainer));