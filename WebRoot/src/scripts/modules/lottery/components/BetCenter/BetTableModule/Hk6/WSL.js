import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

class WSL extends Component {

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

  getWslNumGroup(item) {
    let ws = item.id.match(/\d+/)[0];
    let group = [
      [10, 20, 30, 40],
      [1, 11, 21, 31, 41],
      [2, 12, 22, 32, 42],
      [3, 13, 23, 33, 43],
      [4, 14, 24, 34, 44],
      [5, 15, 25, 35, 45],
      [6, 16, 26, 36, 46],
      [7, 17, 27, 37, 47],
      [8, 18, 28, 38, 48],
      [9, 19, 29, 39, 49]];

    return group[ws];
  }

  getWslLabel(item) {
    let ws = item.id.match(/\d+/)[0];
    return `${ws}尾`;
  }

  getRenderNums() {
    let nums = [];
    const {subpankou, peiyu} = this.props;
    let code = `WSL-${subpankou.xzlxCode}`;
    return peiyu.filter( (item) => {
      if (item.id.indexOf(code) == 0 ) {
        return true;
      }
    });
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    let _this = this;
    
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    
    return (
      <div className="table4-column ball-margin-right">
        <div className="head-2_2">
          <div className="clearfix pure-g">
            <div className="pure-u-6-24"><div className="ui-item-son">号码</div></div>
            <div className="pure-u-6-24"><div className="ui-item-son">赔率</div></div>
            <div className="pure-u-12-24"><div className="ui-item-son">号码</div></div>
          </div>
        </div>
        <div className="table4-body">
          {this.getRenderNums().map( (item, index) => {
            return <div key={item.id} className="pure-g">
              <div className="pure-u-6-24">
                <div className="ui-item-son">{_this.getWslLabel(item)}</div>
              </div>
              <div className="pure-u-6-24">
                <div onClick={_this.onPeiyuSelected.bind(_this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
              </div>
              <div className="pure-u-12-24">
                <div className="ui-item-son">
                  {_this.getWslNumGroup(item).map( (num, index)  => {
                    return <HKBall key={index} num={num}/>
                  })}
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    );
  }
};

WSL.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

WSL.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default WSL;