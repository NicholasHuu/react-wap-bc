import React , { Component , PropTypes } from "react";
import {connect} from 'react-redux';
import {format} from '../../../../utils/datetime';

class BetRecordListUnit extends Component{
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state ={
      view : false
    }
    this.statusList = {
      'status_no': '未中奖',
      'status_yes': '已中奖',
      'status_wait': '未开奖',
      'status_cannle': '已取消'
    };
  }

  onChange(){
    this.setState({
      view : !this.state.view
    })
  }

  render(){
    const state = this.state;
    const item = this.props.item;
    const status = item.orderStatus;
    let currentStatus;
    for(var i in this.statusList){
      if(status === this.statusList[i]){
        currentStatus = i;
      }
    }
    var betTime = item.betTime;
    betTime = format(betTime,"m.d-HH:mm");
    return(
      <li className="item" >
        <div className="title" onClick={this.onChange}>
          <div className="game-date"><p>{item.gameName}</p><p>{item.qs}</p></div>
          <div className="money"><p><span>{item.betMoney}</span>元</p><p><span>{betTime}</span></p></div>
          <div className="zjzt"><p><span>{item.orderStatus == '已中奖' ? item.kyje: ''}</span></p></div>
          <i className={"status "+currentStatus}></i>
          <span className={state.view ? "arrow-down" : "arrow"}></span>
        </div>
        <ul className={"information "+( state.view ? '' : 'hide')}>
          <li><span>下注时间</span><span>{item.betTime}</span></li>
          <li><span>玩法</span><span>{item.itemName}</span></li>
          <li><span>期数</span><span>{item.qs}</span></li>
          <li><span>下注内容</span><span>{item.betNumber}</span></li>
          <li><span>赔率</span><span>{item.rate}</span></li>
          <li><span>下注金额</span><span>{item.betMoney}</span></li>
          <li><span>可赢奖金</span><span className="red">{item.kyje}</span></li>
          <li><span>返水金额</span><span>{item.backWaterMoney}</span></li>
          <li><span>订单状态</span><span className="color-style">{item.orderStatus}</span></li>
          <li><span>开奖号码</span><span>{item.openCode}</span></li>
        </ul>
      </li>
    )

  }

}

export default BetRecordListUnit;