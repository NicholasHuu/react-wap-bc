import React ,{Component, PropsTypes} from 'react';
import {connect} from 'react-redux';
import {Link ,withRouter} from 'react-router';

class OrderRecord extends Component{
  constructor(props){
    super(props);
  }

  orderStatusText(order) { 
    let betStatusLabels = {1: '赢', 2: '输', 3: '赢一半', 4: '输一半', 5: '和局退款', 6: '比赛取消', 7: '赔率错误', 8: '比分错误', 9:'盘口错误', 10: '队名错误', 11: '和局取消', 12: '赛事延赛', 13: '赛事腰斩', 14: '进球取消', 15: '正在确认', 16: '未接受注单', 17: '未结算'};
    let html = [];
    let betStatus = order['betStatus'];
    
    if (betStatus == 1 || betStatus == 2 || betStatus == 3 || betStatus == 4 ) {
      html.push(<p key={2} className={this.getBetColor(betStatus)}><span className="betStatusDes">{order.betUsrWin}</span><span>{order.betStatusDes}</span></p>);
    }else{
      html.push(<span className="bet-status" key={1}>{betStatusLabels[betStatus]}</span>);
    }
    return html;
  }

  getBetColor(betStatus) {
    let color = "bet-status";
    if(betStatus == 1 || betStatus == 3){
      color = "winColor";
    }else if(betStatus == 2 || betStatus == 4){
      color = "loseColor";
    }
    return color;
  }

  renderOrderOfP3(order) {
    let details = order.details;
    if (!details) {
      return null;
    }
    let _this = this;
    let curType = "";
    let length = order.details.length;
    let type = {"roll": "滚球","tom": "早盘","today":"今日"};
    curType = type[order.timeType] + "-" + length + "串1";
    return (
      <div className="order-detail pl3-order-detail">
        <p className="item-name">订单号:<span>{order.betWagersId}</span><span className="order-type">{order.timeRtypeDes}</span></p>
        <table className="guoguanTitle">
          <thead>
            <tr>
              <td className="nowrap">下注时间</td>
              <td className="nowrap">投注金额</td>
              <td className="nowrap">可赢金额</td>
              <td className="nowrap">状态</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="nowrap">{order.orderTime}</td>
              <td className="nowrap">{order.betIn}</td>
              <td className="nowrap">{order.betCanWin}</td>
              <td className="nowrap">{this.orderStatusText(order)}</td>
            </tr>
          </tbody>
        </table>

        <table className="pl3-table">
          <tbody>
            <tr>
              <td className="pl3-table-back guogaunList">
                {details.map( (detail, index) => {
                  try {
                    //detail.score = JSON.parse(detail['tmp1']); 
                  } catch (e) {
                    //detail.score = {};
                  }
                  
                  let dtypeLabels = {
                    'dy': '独赢', 'rq': '让球', 'dx': '大小', 'ds': '单双', 'dx_big': '积分', 'dx_small': '积分', 'rf': '让分', 'pd': '波胆'
                  };
                  return (
                    <table key={index} className="pl3-table table-item">
                      <tbody>
                        <tr>
                          <td>
                            <span dangerouslySetInnerHTML={ {__html: detail.league} }></span>
                          </td>
                        </tr>
                        <tr>
                          <td className="color-style-1">
                            <font dangerouslySetInnerHTML={ {__html: detail.betVs} }></font>
                            {detail.timeType == 'roll' && <span><font dangerouslySetInnerHTML={ {__html: detail.betScoreHCur} }></font>:<font dangerouslySetInnerHTML={ {__html: detail.betScoreCCur} }></font></span>}
                          </td>
                        </tr>
                       
                        <tr>
                          <td className="color-style-2"><font dangerouslySetInnerHTML={ {__html: detail.betOddsDes} }></font></td>
                        </tr>
                        <tr>
                          <td className="color-style-2"><font dangerouslySetInnerHTML={ {__html: detail.betOddsName} }></font>@ <font dangerouslySetInnerHTML={ {__html: detail.betOdds} }></font></td>
                        </tr>
                        <tr>
                          <td className="color-style-3">
                            {
                              order.status != 2 ? <span>赛事时间：{detail.matchTime}</span> :  <p className="matchResultStyle">{_this.matchResult(order)}</p>
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderOrderDetail(order) {
    if (order.matchRtype != 'p3') {
      let details = order.details;
      let _this = this;
      if (!details) {
        return null; // TODO:: 有时候这个 details 为 undefined 需要怎样处理？？
      } else {
        let curType;
        let type = {"roll": "滚球","tom": "早盘","today":"今日"};
        curType = type[order.timeType] +"-"+ order.details[0].rtypeName;
        
        return (
          <div className="order-detail">
            <p className="item-name">订单号：<span>{order.betWagersId}</span><span className="order-type">{order.timeRtypeDes}</span></p>
              {details.map( (detail, index) => {
                try {
                  //detail.score = JSON.parse(detail.tmp1);  
                } catch (e) {
                  //detail.score = {};
                }
                return (<div key={index}><table>
                  <thead>
                    <tr>
                      <td>投注时间</td>
                      <td className="nowrap">投注金额</td>
                      <td className="nowrap">可赢金额</td>
                      <td className="nowrap">状态</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{detail.betTime}</td>
                      <td className="nowrap">{order.betIn}</td>
                      <td className="nowrap">{order.betCanWin}</td>
                      <td className={"nowrap "+ _this.getBetColor(order.betStatus)}>{this.orderStatusText(order)}</td>
                        
                    </tr>
                  </tbody>
                </table>
                <table className="pl3-table">
                  <tbody>
                    <tr>
                      <td className="pl3-table-back guogaunList">
                        <p>{detail.league}</p>
                        <p className="color-style-1">
                          <span dangerouslySetInnerHTML={ {__html: detail.betVs} }></span>
                          <span className="color-style-2">
                            { detail.timeType == 'roll' &&  <span>({detail.betScoreHCur}-{detail.betScoreCCur})</span>}
                          </span>
                        </p>
                        <p className="color-style-2">
                          <span dangerouslySetInnerHTML={ { __html: detail.betOddsDes } }></span>
                        </p>
                        <p className="">
                          <span className="color-style-2" dangerouslySetInnerHTML={ {__html: detail.betOddsName } }></span> @ <span className="color-style-2" dangerouslySetInnerHTML={ {__html: detail.betOdds } }></span>
                        </p>

                        <p className="color-style-3">
                        {
                          order.status != 2 ? <span>赛事时间：{detail.matchTime}</span> :  <p className="matchResultStyle">{_this.matchResult(order)}</p>
                        }
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table></div>);
              })}
          </div>
        );
      }
      
    } else {
      return this.renderOrderOfP3(order);
    }
   
  }
  matchResult(order) {
    let detail = order.details[0];
    if (order.betSportType == "BK"){
      return "全场 "+ detail.score.stageHF + detail.score.stageCF;
    }else if(order.betSportType == "FT"){
      return "上半场(" + detail.score.hrScoreH +"-"+detail.score.hrScoreC + ") 全场(" + detail.score.flScoreH+ "-"+detail.score.flScoreC +")";
    }
  }
  render(){
    let {items} = this.props;
    let _this = this;
    
    if (Object.prototype.toString.apply(items) != '[object Array]') {
      items = [];
    }

    return(
      <div className="record-orders">
        {items.length <= 0 ? <p className="warning">暂无订单</p>:items.map(function(item, index){
          return(
            <div className="order-item" key={index}>
              {_this.renderOrderDetail(item)}
            </div>
          )
        })}
      </div>
    )
  }
}


export default OrderRecord;

