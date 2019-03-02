import React , { Component , PropTypes } from "react";
import { connect }  from "react-redux";
import {withRouter} from 'react-router';
import {parseQuery} from '../../../utils/url';
import {dingweiTotal} from '../utils/helper';

import MemberBetItems from './MemberBetItems';


class MemberDWBetItems extends MemberBetItems {

  constructor(props) {
    super(props);
    this.state.total = 0;
    this.state.totalPrice = 0;
    this.state = {
      selectedPeiyu: this.getItemsAsArray(props.items),
      changeValue: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if (this.state.selectedPeiyu[0]) {
      this.state.total = dingweiTotal(this.state.selectedPeiyu[0].number);
    }
  }

  onMoneyInput(item) {
    let selectedPeiyu = this.state.selectedPeiyu;
    for (let i = 0; i < selectedPeiyu.length; i++) {
      let peiyu = selectedPeiyu[i];
      if (peiyu.id == item.id) {
        peiyu.money = this.refs[item.id].value;
      }
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
      changeValue : this.refs[item.id].value
    });
  }

  handleChange(event){
    let selectedPeiyu = this.state.selectedPeiyu;
    this.state.changeValue = event.target.value;
    for (let i = 0; i < selectedPeiyu.length; i++) {
      let peiyu = selectedPeiyu[i];
      peiyu.money = event.target.value;
    }

    this.setState({
      selectedPeiyu,
      changeValue : event.target.value
    });
  }

  getNumberLabel() {
    const {platform} = this.props;
    const {selectedPeiyu} = this.state;
    let labels = [];
    for (let item of selectedPeiyu) {
      let parts = item.id.split('-');
      let labelOne = platform['betInfo']['oddinfo'][0][parts[0]];
      labels =<span key={item.id} className="seperator"><span>{labelOne}</span></span>;
    }
    return <p className="label">{labels}</p>
  }

  getNumberContent() {
    const {platform} = this.props;
    const {selectedPeiyu} = this.state;
    let labels = [];
    for (let item of selectedPeiyu) {
      let parts = item.id.split('-');
      let labelTwo = platform['betInfo']['oddinfo'][1][parts[1]];
      let labelThree = platform['betInfo']['odds'][item.id];
      let labelNumber = platform['betInfo']['oddinfo'][2][parts[2]];
      labels.push(<span key={item.id} className="seperator">
        <span className="color-red">{item.number}</span>
      </span>);
    }

    return <div className="bet-content">{labels}</div>
  }
  
  // 计算下注注数
  countTotalBet() {
    let items = this.state.selectedPeiyu;
    let total = 1;
    for (let item of items) {
      let numbers = item.number.split('|');
      let partTotal = 1;
      for (let number of numbers) {
        let parts = number.split(':');
        for (let part of parts) {
          partTotal = partTotal * part.split(',').length;  
        }
        
      }

      total = partTotal * total;
    }

    return total;
  }

  render() {
    let items = this.state.selectedPeiyu;
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
          {items.map((item, index) => {
            return (
              <div key={index} className="item">
                <div className="title">{this.getNumberLabel(item)}</div>
                {this.getNumberContent()}
                <span className="betMoney">下注金额：</span><input type="number" ref={item.id} value={_this.state.changeValue}  onChange={this.onMoneyInput.bind(_this, item)} placeholder="输入下注金额" min={this.getMinLimit(item)} max={this.getMaxLimit(item)}/><br/>
                <div className="tips"><span>单注{this.getMinLimit(item)}-{this.getMaxLimit(item)}元</span> <span>单期最高{this.getPeriodLimit(item)}元</span></div>
                <div onClick={this.onDeleteItem.bind(_this, item)} className="delete-btn"></div>
              </div> 
            );
          })}
        </div>

        <div className="btn-wrap">
          <div className="sum-num">
            <p>共<span>{this.countTotalBet()}</span>注</p>
            <p>金额：<span>{this.state.changeValue * this.countTotalBet()}</span>元</p>
          </div>
          <div className="btn" onClick={this.onSubmit}>确认投注</div>
        </div> 
      </div>
    )
  }
}

MemberDWBetItems.defaultProps = {
  onSubmit: () => {}
};

MemberDWBetItems.propTypes = {
  items: PropTypes.object.isRequired,
  platform: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
};

export default MemberDWBetItems;