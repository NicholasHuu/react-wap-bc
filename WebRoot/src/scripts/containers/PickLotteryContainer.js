import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter, Route} from 'react-router-dom';

import Header from '../components/Header';
import Back from '../components/Back';
import LoadingComponent from '../components/LoadingComponent';
import Card from '../components/Card';
import cache from '../utils/cache';

import {loadHome} from '../actions/AppAction';
import {loadAllLottery} from '../modules/user/actions/UserOrder';
import {LOTTERY_SELECTED_KEY} from '../constants/AppConstant';

const LOTTERY_REGION_TYPE = 7;

class PickLotteryContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.state = {
      lotteryItems: [],
    };

    this.selectedItems = [];
    this.rejustOrder = this.rejustOrder.bind(this);
    this.cachedItems = cache.get(LOTTERY_SELECTED_KEY) || [];

  }

  rejustOrder() {
    const {history, lotteryItems} = this.props;
    let selectedItems = this.selectedItems;
    let cachedItems = this.cachedItems;
    let orderedItems = [];

    for (let item of lotteryItems) {
      let oitem = selectedItems.filter( i => i.lotteryCode == item.lotteryCode ).shift();
      if (oitem) {
        oitem.fromUser = true;
        orderedItems.push(oitem);
      }
    }
    
    let tmpCachedItems = [];
    for (let i = 0; i < cachedItems.length; i++) {
      let exist = orderedItems.filter( s => s.lotteryCode == cachedItems[i].lotteryCode ).shift();
      
      if (!exist) {
        tmpCachedItems.push(cachedItems[i]);
      }
    }

    for (let i = 0; i < orderedItems.length; i++) {
      tmpCachedItems.unshift(orderedItems[i]);
    }
    
    cache.set(LOTTERY_SELECTED_KEY, tmpCachedItems);

    return history.goBack();

  }

  cacheDefaultLottery(props) {
    let defaultLotteryItems = this.getDefaultLotteryItems(props);
    if (defaultLotteryItems.length) {

      let cachedLotteryItems = cache.get(LOTTERY_SELECTED_KEY);
      if (!cachedLotteryItems) {
        cache.set(LOTTERY_SELECTED_KEY, defaultLotteryItems);
      }
    } else {
      cache.set(LOTTERY_SELECTED_KEY, []);
    }
  }

  getDefaultLotteryItems(props) {
    const {homeConfig} = props;
    for (let config of homeConfig) {
      if (config['regionType'] == LOTTERY_REGION_TYPE) {
        return config['data'];
      }
    }
  }

  componentDidMount() {
    super.componentDidMount();
    const {dispatch} = this.props;
    dispatch(loadAllLottery());
    dispatch(loadHome());
  }

  componentWillReceiveProps(nextProps) {
    const {lotteryItems, homeConfig} = nextProps;
    if (lotteryItems != this.props.lotteryItems || this.props.homeConfig != homeConfig) {
      this.closeLoading();
    }
    
    if (nextProps.homeConfig.length > 0) {
      this.cacheDefaultLottery(nextProps);
      this.cachedItems = cache.get(LOTTERY_SELECTED_KEY);
    }

  }

  onItemClick(item) {
  
    let i = 0, found = false;
    for (let cacheItem of this.cachedItems) {
        if (cacheItem.lotteryCode == item.lotteryCode) {
          found = true;
          break;
        }
        i++;
    }

    // 删除
    if (found) {
      this.cachedItems.splice(i, 1);
    } else {
      // 临时数组
      let j = 0, sfound = false;
      for (let sitem of this.selectedItems) {
        if (sitem.lotteryCode == item.lotteryCode) {
          sfound = true;
          break;
        }
        j++;
      }
      // 从临时数组删掉
      if (sfound) {
        this.selectedItems.splice(j, 1);
      } else {
        this.selectedItems.push(item);
      }
    }

    this.forceUpdate();
    
  }

  itemSelected(item) {
    
    let selectedLotteryItems = this.cachedItems;
    let selected = false;
    selectedLotteryItems.map( (lottery, index) => {
      if (lottery.lotteryCode == item.lotteryCode) {
        selected = true;
      }
    });

    this.selectedItems.map( (lottery, index) => {
      if (lottery.lotteryCode == item.lotteryCode) {
        selected = true;
      }
    });

    return selected;

  }

  render() {
    const {lotteryItems, homeConfig} = this.props;
    let self = this;
    return (
      <div className="page page-pick-lottery">
      
        <Header {...this.props}>
          <Back />
          <h3>添加彩种</h3>
        </Header>
        
        <div className="page-body">

          <div className="tl-items">
            {lotteryItems.map((item, index) => {
              if (index == 0) return ;
              return <Card key={index} className={ ({true: 'selected', false: ''})[ this.itemSelected(item) ] } onClick={self.onItemClick.bind(self, item)} image={item.smallPicUrl} title={item.lotteryName} />
            })}
          </div>

          <div className="btn-wrap">
            <button className="btn btn-orange" onClick={ this.rejustOrder }>确认</button>
          </div>
    
        </div>

      </div>
    );
  }

};

function mapStateToProps({userModule, app}) {
  return {
    app,
    lotteryItems: userModule.order.get('lotteryItems'),
    homeConfig: app.get('homeConfig'),
    userModule,
  };
}

export default withRouter(connect(mapStateToProps)(PickLotteryContainer));