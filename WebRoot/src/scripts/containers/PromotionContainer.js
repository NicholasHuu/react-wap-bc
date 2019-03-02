import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import Back from '../components/Back';
import Header from '../components/Header';
import FooterMenu from '../components/FooterMenu';
import Slider from '../components/Slider';
import {loadPromotionItems, loadSiteInfo} from '../actions/AppAction';
import LoadingComponent from '../components/LoadingComponent';

class PromotionContainer extends LoadingComponent {

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadPromotionItems());
    dispatch(loadSiteInfo());
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
  }

  render() {
    const {app, promotion} = this.props;
    let promotionItems = promotion.get('items');
    
    return (
      <div className="page page-promotion">
        <div>
          <Header {...this.props}>
            <Back />
            <h3>优惠活动</h3>
          </Header>
          <div className="page-body">
            <Slider sliders={app.get('promotionSlider')}/>
            <ul className="promotion-items">
              {promotionItems.map( (item, index) => {
                return (
                  <li key={index}>
                    <Link to={`/promotion/${item.id}`}>
                      <span>{index + 1}</span>
                      <div className="content">
                        <h3>{item.pmsTitle}</h3>
                        <p>{item.pmsSubTitle}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
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

export default connect(mapStateToProps)(PromotionContainer);