import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

class LX extends Component {

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
    const {subpankou, platformInfo} = this.props;
    let prefix = `LX-${subpankou.xzlxCode}-`;
    let sx = item.id.replace(prefix, '');
    if (!platformInfo.animal) {
      return [];
    }
    
    return platformInfo['animal'][sx].map( (num) => {
      return num*1;
    });
  }

  getRenderNums() {
    let nums = [];
    const {subpankou, peiyu} = this.props;
    let code = `LX-${subpankou.xzlxCode}`;
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
            <div className="pure-u-6-24"><div className="ui-item-son">生肖</div></div>
            <div className="pure-u-6-24"><div className="ui-item-son">赔率</div></div>
            <div className="pure-u-12-24"><div className="ui-item-son">号码</div></div>
          </div>
        </div>
        <div className="table4-body">
          {this.getRenderNums().map( (item, index) => {
            return <div key={item.id} className="pure-g">
              <div className="pure-u-6-24">
                <div className="ui-item-son">{item.number}</div>
              </div>
              <div className="pure-u-6-24">
                <div onClick={_this.onPeiyuSelected.bind(_this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
              </div>
              <div className="pure-u-12-24">
                <div className="ui-item-son">
                  {_this.getSxNums(item).map( (num, index)  => {
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

LX.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

LX.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default LX;