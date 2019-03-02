import React, {Component, PropTypes} from 'react';
import {formatTimer}  from '../../../utils/datetime';
import {showTxt,fiftle}  from './historyShowTxt';

class OpenHistoryQuickView extends Component {

  constructor(props) {
      super(props);
      this.renderThirdColumn = this.renderThirdColumn.bind(this);
      this.renderThirdColumnData = this.renderThirdColumnData.bind(this);
  }

  // 渲染第三列 -
  // 快三 / 幸运28 / 六合彩有第三列
  renderThirdColumn() {
    const {lottery,info} = this.props;
    if (lottery.indexOf('28') != -1 || lottery.indexOf('k3') != -1 ) {
      return <td>和值</td>
    } else if (lottery.indexOf('hk6') != -1) {
      return <td>特码</td>;
    } else if (info.activeLottery.indexOf('ssc') != -1 || info.activeLottery.indexOf('ffc') != -1){
      if(  /zx_hz/.test(info.activeGroup) || /zux_hz/.test(info.activeGroup) || ( ( /q2/.test(info.activeGroup) || /h2/.test(info.activeGroup) ) && !/kd/.test(info.activeGroup) ) ){
        return <td>和值</td>;
      }else if(/kd/.test(info.activeGroup)){
        return <td>跨度</td>;
      }else if(/lh_lhh/.test(info.activeGroup)){
        return <td>龙虎</td>;
      }else if( /rx_/.test(info.activeGroup) || /dwd_/.test(info.activeGroup) || /wxwf_tm_tm/.test(info.activeGroup) ){
          return <td></td>;
      }
      return <td>形态</td>;
    }
  }

  renderThirdColumnData(row) {
    const {lottery,info} = this.props;
    if (lottery.indexOf('28') != -1 || lottery.indexOf('k3') != -1 ) {
      if (row == null) return <td>-</td>;
      let nums = row.num.trim().split(/[\s\,]+/);
      return <td>{nums.reduce((a, b) => a*1 + b*1 )}</td>;
    } else if (lottery.indexOf('hk6') != -1) {
      let nums = (row || {num: ''}).num.trim().split(/[\s\,]+/);
      return <td>{nums[nums.length - 1]}</td>
    } else if (info.activeLottery.indexOf('ssc') != -1 || info.activeLottery.indexOf('ffc') != -1){
      let list = row.num.split(',');
      let text = showTxt(info.activeGroup,list);
      return <td>{text}</td>;
    }

  }
  choseEle(code,index){
    return fiftle(code,index)
  }
  render() {
    const {onTouchStart, onTouchEnd, onTouchMove, lottery, onClick,info} = this.props;

    return (
      <div className={ "quick-view-wrap " + ({true: 'quick-view-wrap-k3'})[lottery.indexOf('k3') != -1] } onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className={ "open-nums"}>
          <table>
            <tbody>
              <tr>
                <td>期次</td>
                <td>开奖号码</td>
                {this.renderThirdColumn()}
              </tr>
              <tr>
                <td>{this.props.crtInfo.qs}</td>
                <td><span className="opening-text">等待开奖</span></td>
            {/*    {this.renderThirdColumnData()} */}
              </tr>
              {this.props.historyNums.map((item, index) => {
                let nums = item.num.trim().split(/[\s\,]+/);
                if (item.num.trim().length <= 0) return ;
                return (
                  <tr onClick={onClick} key={index}>
                    <td>{item.qs}</td>
                    <td>{nums.map((num, i) => <span className={this.choseEle(info.activeGroup,i)} data-num={num} key={i}>{num}</span>)}</td>
                    {this.renderThirdColumnData(item)}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="intro">点击以上开奖号码区域可查看更多</p>
        </div>
      </div>
    );
  }

};

OpenHistoryQuickView.propTypes = {
  historyNums: PropTypes.array,
  crtInfo: PropTypes.object,
  lottery: PropTypes.string
};

OpenHistoryQuickView.defaultProps = {
  historyNums: [],
  crtInfo: {},
  lottery: ''
};

export default OpenHistoryQuickView;