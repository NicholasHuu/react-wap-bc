import React , { Component , PropTypes } from "react";
import { connect }  from "react-redux";
import {withRouter} from 'react-router';
import {parseQuery} from '../../../utils/url';


class HK6GroupOrderMemberBetItems extends Component  {

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
    const {preOrder, location, match} = this.props;
    let query = parseQuery(location.search);
    let token = preOrder.token;

    if ( ( query.pankou == 'ZXS' || query.pankou == 'ZXL' ) && !!!query.subpankou) {
      query.subpankou = 'QSW';
    }
    let items = [{
      token,
      xzje: this.money,
      typeCode: query.pankou,
      cateCode: query.subpankou ? query.subpankou: 'WBZ'
    }];
    let orderFlag = 'mul';
    if (query.pankou == 'ZXS' || query.pankou == 'ZXL') {
      orderFlag = 'group';
    }
    this.props.onSubmit(items, orderFlag);
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

  getNumberLabel() {
    const {platform} = this.props;
    const {selectedPeiyu} = this.state;
    let labels = null;
    for (let item of selectedPeiyu) {
      let parts = item.id.split('-');
      let labelOne = platform['betInfo']['oddinfo'][0][parts[0]];
      let labelThree = platform['betInfo']['odds'][item.id];
      if (parts[0] == 'ZXS' || parts[0] == 'ZXL') {
        labelThree = '';
      }
      labels = <span className="seperator"><span>{labelOne}</span></span>;
    }
    return <span className="label">{labels}</span>
  }

  handleChange(event){
    let selectedPeiyu = this.state.selectedPeiyu;
    this.state.changeValue = event.target.value;
    this.money  = this.state.changeValue;
    for (let i = 0; i < selectedPeiyu.length; i++) {
      let peiyu = selectedPeiyu[i];
      peiyu.money = event.target.value;
    }
    console.log(selectedPeiyu);
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
            <input type="number"  ref="quickMoneyInput" onChange={_this.handleChange} placeholder="请输入金额" />
          </div>
        </div>

        <div className="inner">
          <div className="item">
            <p className="title">{this.getNumberLabel()}</p>
            <span className="betMoney">下注金额：</span><input type="number" ref='money' value={this.state.changeValue}  onChange={this.onMoneyInput.bind(this)} placeholder="输入下注金额" min={this.getMinLimit()} max={this.getMaxLimit()}/><br/>
            <div className="tips"><span>单注{this.getMinLimit()}-{this.getMaxLimit()}元</span> <span>单期最高{this.getPeriodLimit()}元</span></div>
          </div> 
          <div className="preorder-items">
            {preOrder.orderList.map( (item, index) => {
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

HK6GroupOrderMemberBetItems.defaultProps = {
  onSubmit: () => {}
};

HK6GroupOrderMemberBetItems.propTypes = {
  items: PropTypes.object.isRequired,
  platform: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  preOrder: PropTypes.object,
};

export default HK6GroupOrderMemberBetItems;