import React , { Component , PropTypes } from "react";
import { connect }  from "react-redux";
import {withRouter} from 'react-router';
import {parseQuery} from '../../../utils/url';


class MemberBetItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedPeiyu: this.getItemsAsArray(props.items),
      commonMoney : 0,
      totalNum : '0',
      totalMoney : '0'
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  getNumberLabel(item) {
    const {platform} = this.props;
    let parts = item.id.split('-');
    let labelOne = platform['betInfo']['oddinfo'][0][parts[0]];
    return <div className="label seperator"><span>{labelOne}</span></div>
  }

  getNumberContent(item) {
    const {platform} = this.props;
    let parts = item.id.split('-');
    let labelOne = platform['betInfo']['oddinfo'][0][parts[0]];
    let labelTwo = platform['betInfo']['oddinfo'][1][parts[1]];
    let labelThree = platform['betInfo']['odds'][item.id];
    return <div className="bet-content">
      <span>{labelTwo}:</span> <span className="bet-code">{item.number}</span>
    </div>
  }

  getMinLimit(item) {
    let items = this.state.selectedPeiyu;
    const {platform, location} = this.props;
    let query = parseQuery(location.search);
    return item.minLimit;
  }

  getMaxLimit(item) {
    const {platform, location} = this.props;
    let query = parseQuery(location.search);
    return item.maxLimit;
  }

  getPeriodLimit(item) {
    const {platform, location} = this.props;
    let query = parseQuery(location.search);
    return item.maxPeriodLimit;
  }

  getItemsAsArray(selectedPeiyu) {
    let itemsArray = [];
    for (var key in selectedPeiyu) {
      itemsArray.push(selectedPeiyu[key]);
    }
    return itemsArray;
  }

  onDeleteItem(item) {
    let selectedPeiyu = this.state.selectedPeiyu.filter( (peiyu) => {
      if (peiyu.id == item.id) {
        return false;
      }
      return true;
    });
    if (selectedPeiyu.length <= 0 ) {
      const {location, history} = this.props;
      let query = parseQuery(location.search);
      let to = `/lottery/betcenter/${query.gameCode}/home?pankou=${query.pankou}`;
      history.push(to);
    } else {
      let totalMoney = 0,length = 0;
      for(let i = 0 ;i <selectedPeiyu.length;i++){
        let val1 = selectedPeiyu[i].money;
        if(!selectedPeiyu[i].money){
          val1 = 0;
        }
        totalMoney += parseInt(val1);
        if(selectedPeiyu[i].money > 0) length++;
      }
      this.setState({
        selectedPeiyu,
        totalMoney : totalMoney,
        totalNum : length
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedPeiyu: this.getItemsAsArray(nextProps.items),
    });
  }

  onSubmit() {
    let items = [];
    let selectedPeiyu = this.state.selectedPeiyu;
    const {location} = this.props;
    let query = parseQuery(location.search);
    for (let peiyu of selectedPeiyu) {
      let saveToItem = {
        uid: peiyu.id,
        rate: peiyu.pl,
        xzje: peiyu.money,
        label: query.gameCode,
        label2: query.pankou
      };
      if (peiyu.number) {
        saveToItem.number = peiyu.number;
      }
      items.push(saveToItem);
      if (!peiyu.money || peiyu.money > peiyu.maxLimit || peiyu.money < peiyu.minLimit ) {
        alert('下注金额不符合要求');
        return ;
      }
    }
    this.props.onSubmit(items);
  }

  onMoneyInput(item) {
    let selectedPeiyu = this.state.selectedPeiyu;
    let totalMoney = 0,length =0;
   
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
      totalMoney += parseInt(val1);
      if(peiyu.money > 0){
        length++
      }
    }
    
    this.setState({
      selectedPeiyu,
      totalNum : length,
      totalMoney : totalMoney
    });

  }

  handleChange(event){
    let selectedPeiyu = this.state.selectedPeiyu;
    this.state.commonMoney = event.target.value;  
    
    for (let i = 0; i < selectedPeiyu.length; i++) {
      let peiyu = selectedPeiyu[i];
      peiyu.money = event.target.value;
    }
    this.setState({
      selectedPeiyu,
      totalMoney : selectedPeiyu.length * this.state.commonMoney,
      totalNum : selectedPeiyu.length
    });
  }

  componentDidMount() {
    this.refs.quickMoneyInput.focus();
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
              <div ref="itemNum" key={index} className="item">
                <div className="title">{this.getNumberLabel(item)}</div>
                {this.getNumberContent(item)}
                <span className="betMoney">下注金额：</span><input type="number" ref={item.id} onChange={this.onMoneyInput.bind(_this, item)} value={item.money} placeholder="输入下注金额" min={this.getMinLimit(item)} max={this.getMaxLimit(item)} />
                <div className="tips"><span>单注{this.getMinLimit(item)}-{this.getMaxLimit(item)}元</span> <span>单期最高{this.getPeriodLimit(item)}元</span></div>
                <div onClick={this.onDeleteItem.bind(_this, item)} className="delete-btn"></div>
              </div> 
            );
          })}
        </div>

        <div className="btn-wrap">
          <div className="sum-num">
            <p>共<span>{items.length}</span>注</p>
            <p>金额：<span>{_this.state.totalMoney}</span>元</p>
          </div>
          <div className="btn" onClick={this.onSubmit}>确认投注</div>
        </div> 

      </div>
    )
  }
}

MemberBetItems.defaultProps = {
  onSubmit: () => {}
};

MemberBetItems.propTypes = {
  items: PropTypes.object.isRequired,
  platform: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
};

export default MemberBetItems;