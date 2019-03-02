import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';

import {loadPromoLinks} from '../actions/UserOrder';

import TabSwitcher from '../components/TabSwitcher';
import PromoLinkItem from '../components/PromoLinkItem';
import PromoLinkForm from '../components/PromoLinkForm';
import PTR from '../../../utils/pulltorefresh';

let tabOption = [ ['table', '已建立的推广链接'], ['new', '生成新的推广链接'] ];

class PromoLinksContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.onTabClick = this.onTabClick.bind(this);
    this.onAddFinish = this.onAddFinish.bind(this);
    this.state = {
      promoLinkForm: null,
      tab: '',
    };
  }

  onTabClick(tab) {
    if (tab == 'new') {
      this.setState({
        promoLinkForm: true,
        tab
      }, () => {
        this.setupPullToRefresh(true);
      });
    } else {
      const {dispatch} = this.props;
      dispatch(loadPromoLinks());
      this.setState({
        tab,
        promoLinkForm: null
      });
    }
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadPromoLinks());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.promoLinks != this.props.promoLinks || nextProps.promoLinks.length > 0) {
      this.closeLoading();
    }
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.page-body-inner',
      refreshHandler({close, handler}) {
        dispatch(loadPromoLinks(() => {
          close();
        }));
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  onAddFinish() {
   this.onTabClick('table');
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }

  render() {
    const {promoLinks, userModule} = this.props;
    let maxWaterBack = userModule.user.get('info').backWater.lottery;
    let maxLiveBack = userModule.user.get('info').backWater.live;
    let maxElectronicBack = userModule.user.get('info').backWater.electronic;
    let maxSportBack = userModule.user.get('info').backWater.sport;
    let maxFishBack = userModule.user.get('info').backWater.fish;
    return (
      <div className="page page-promo-link">
        <Header {...this.props}>
          <Back />
          <h3>推广链接</h3>
        </Header>
        <div className="page-body">
          <div className="page-body-inner">
            <TabSwitcher defaultTab={this.state.tab} tabs={tabOption} onChange={this.onTabClick}></TabSwitcher>
            <div style={ {display: ({true: 'none', false: ''})[ this.state.promoLinkForm != null ]} }>
              {promoLinks.length <= 0 && <p className="no-data">暂无数据</p>}
              {promoLinks.map( (item, index) => {
                return  <PromoLinkItem history={this.props.history} key={index} item={item}/>;
              } )}
            </div>
            
            <div style={ {display: ({true: 'none', false: ''})[ this.state.promoLinkForm == null ]} }>
              <PromoLinkForm onFinish={this.onAddFinish} {...this.props} 
                maxWaterBack={maxWaterBack} 
                maxLiveBack={maxLiveBack} 
                maxElectronicBack={maxElectronicBack} 
                maxSportBack={maxSportBack} 
                maxFishBack={maxFishBack} 
              />
            </div>
          </div>

        </div>

      </div>
    );
  }

}

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    promoLinks: userModule.order.get('promoLinks'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(PromoLinksContainer));