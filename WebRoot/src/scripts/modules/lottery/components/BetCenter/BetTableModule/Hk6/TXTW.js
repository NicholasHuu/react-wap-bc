import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

class TXTW extends Component {

  constructor(props) {
    super(props);
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }
  
  renderBall(peiyuItem) {
    let number = peiyuItem.number;
    if (isNaN(number * 1 )) {
      return <span className={peiyuItem.id}>{number}</span>
    } else {
      return <HKBall num={peiyuItem.number*1}/>;
    }
  }

  getSxNums(item) {
    let id = item.id;
    const {platformInfo} = this.props;
    if (!platformInfo.animal) {
      return ;
    }
    let sx = id.replace('TXTW-TMSX-', '');
    let nums = platformInfo.animal[sx];
    return nums;
  }

  getSxBall() {
    const {peiyu} = this.props;
    return peiyu.filter( (item) => {
      if (item.id.indexOf('TXTW-TMSX') == 0) {
        return true;
      }
    });
  }

  // 获取尾数
  getTailBall() {
    const {peiyu} = this.props;
    return peiyu.filter( (item) =>{
      if (item.id.indexOf('TXTW-TTW-TAIL') == 0) {
        return true;
      }
    });
  }

  // 获取头数
  getHeadBall() {
    const {peiyu} = this.props;
    return peiyu.filter( (item) =>{
      if (item.id.indexOf('TXTW-TTW-HEAD') == 0) {
        return true;
      }
    });
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    let _this = this;
    
    return (
      <div className="table4-column  ball-margin-right">
        <div className="pure-u-1-1">
            <div className="pure-u-6-24"><div className="ui-item-son ui-header">生肖</div></div>
            <div className="pure-u-6-24"><div className="ui-item-son ui-header">赔率</div></div>
            <div className="pure-u-12-24"><div className="ui-item-son ui-header">号码</div></div>
        </div>
        {this.getSxBall().map( (item, index) => {
          return <div key={index} className="pure-u-24-24">
            <div className="pure-u-6-24"><div className="ui-item-son ui-item-son-ball">{item.number}</div></div>
            <div className="pure-u-6-24"><div onClick={_this.onPeiyuSelected.bind(_this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div></div>
            <div className="pure-u-12-24">
              <div  className={"ui-item-son "}>
                {_this.getSxNums(item).map( (num, index) => {
                  return <HKBall key={index} num={num*1}/>
                })}
              </div>
            </div>
          </div>
        })}
        <div className="pure-u-1-1"><div className="ui-item-son ui-header">特码头数</div></div>
        <div className="pure-u-1-1">
          {this.getHeadBall().map((item, index) => {
            return (<div key={index} className="pure-u-1-2">
              <div className="pure-u-1-2">
                <div className="ui-item-son ui-item-son-ball">
                  {this.renderBall(item)}
                </div>
              </div>
              <div className="pure-u-1-2">
                <div onClick={this.onPeiyuSelected.bind(this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
              </div>
            </div>);
          })}
        </div>
        <div className="pure-u-1-1">
          <div className="pure-u-1-1"><div className="ui-item-son ui-header">特码尾数</div></div>
        </div>
        <div className="pure-u-1-1">
          {this.getTailBall().map((item, index) => {
            return (<div key={index} className="pure-u-1-2">
              <div className="pure-u-1-2">
                <div className="ui-item-son ui-item-son-ball">
                  {this.renderBall(item)}
                </div>
              </div>
              <div className="pure-u-1-2">
                <div onClick={this.onPeiyuSelected.bind(this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
              </div>
            </div>);
          })}
        </div>
      </div>
    );
  }
};

TXTW.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

TXTW.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default TXTW;