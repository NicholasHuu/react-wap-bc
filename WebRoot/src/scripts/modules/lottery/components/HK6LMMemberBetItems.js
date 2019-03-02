import React , { Component , PropTypes } from "react";
import { connect }  from "react-redux";
import {withRouter} from 'react-router';
import {parseQuery} from '../../../utils/url';


class HK6LMMemberBetItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedPeiyu: this.getItemsAsArray(props.items),
      preOrder: {},
      changeValue: ""
    };
    this.money = 0;
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getMinLimit() {
    const {platform, location} = this.props;
    let query = parseQuery(location.search);
    if (platform['betInfo']) {
      return platform['betInfo']['minLimit'][query.pankou.toUpperCase()];
    }
  }

  getMaxLimit() {
    const {platform, location} = this.props;
    let query = parseQuery(location.search);
    if (platform['betInfo']) {
      return platform['betInfo']['maxLimit'][query.pankou.toUpperCase()];
    }
  }

  getPeriodLimit() {
    const {platform, location} = this.props;
    let query = parseQuery(location.search);
    if (platform['betInfo']) {
      return platform['betInfo']['maxPeriodLimit'][query.pankou.toUpperCase()];
    }
  }

  getItemsAsArray(selectedPeiyu) {
    let itemsArray = [];
    for (var key in selectedPeiyu) {
      itemsArray.push(selectedPeiyu[key]);
    }
    return itemsArray;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedPeiyu: this.getItemsAsArray(nextProps.items)
    });
  }

  onSubmit() {
    const {preOrder, location} = this.props;
    let query = parseQuery(location.search);
    let token = preOrder.token;
    let items = [{
      token,
      xzje: this.money,
      typeCode: query.pankou,
      cateCode: 0
    }];
    this.props.onSubmit(items, 'lm');
  }

  onMoneyInput() {
    let selectedPeiyu = this.state.selectedPeiyu;
    this.money = this.refs.money.value;
    for (let i = 0; i < selectedPeiyu.length; i++) {
      let peiyu = selectedPeiyu[i];
      peiyu.money = this.money;
      if(!peiyu.money){
        peiyu.money = "";
      }
      let val1 = peiyu.money;
      if(!peiyu.money){
        val1 = 0;
      }
    }
    this.setState({
      selectedPeiyu,
      changeValue : this.refs.money.value
    })
  }

  handleChange(event){
    let selectedPeiyu = this.state.selectedPeiyu;
    this.state.changeValue = event.target.value;
    this.money  = this.state.changeValue;
    for (let i = 0; i < selectedPeiyu.length; i++) {
      let peiyu = selectedPeiyu[i];
      peiyu.money = event.target.value;
    }
    this.setState({
      selectedPeiyu,
      changeValue : event.target.value
    });
  }

  render() {
    const {preOrder} = this.props;
    let _this = this;
    return (
      <div className="member-bet-items">
        <br />
        <div className="common-money">
          <div>
            <span>快捷下注金额：</span>
            <input type="number" ref="quickMoneyInput" onChange={_this.handleChange} placeholder="请输入金额" />
          </div>
        </div>

        <div className="inner">
          <div className="item">
            <div className="title"><div className="label seperator"><span>连码</span></div></div>
            <span className="betMoney">下注金额：</span><input type="number" ref='money' value={this.state.changeValue} onChange={this.onMoneyInput.bind(this)} placeholder="输入下注金额" min={this.getMinLimit()} max={this.getMaxLimit()}/><br/>
            <div className="tips"><span>单注{this.getMinLimit()}-{this.getMaxLimit()}元</span> <span>单期最高{this.getPeriodLimit()}元</span></div>
          </div> 
          <div className="preorder-items">
            {preOrder.orderList && preOrder.orderList.map( (item, index) => {
              return (
                <div key={index} className="preorder-item">
                  <p><span>{item.xzlxName}</span><span>{item.number}</span> 赔率：<span dangerouslySetInnerHTML={ {__html: item.rate} }></span></p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="btn-wrap">
          <div className="sum-num">
            <p>共<span>{preOrder.orderList.length}</span>注</p>
            <p>金额：<span>{_this.state.changeValue * preOrder.orderList.length}</span>元</p>
          </div>
          <div className="btn" onClick={this.onSubmit}>确认投注</div>
        </div> 

      </div>
    );
  }
}

HK6LMMemberBetItems.defaultProps = {
  onSubmit:() => {}
};

HK6LMMemberBetItems.propTypes = {
  items: PropTypes.object.isRequired,
  platform: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  preOrder: PropTypes.object
};

export default HK6LMMemberBetItems;
