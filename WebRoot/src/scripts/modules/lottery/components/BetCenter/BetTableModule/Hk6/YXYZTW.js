import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

class YXYZTW extends Component {

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

  getTailBall() {
    const {peiyu} = this.props;
    return peiyu.filter( (item) =>{
      if (item.id.indexOf('YXYZTW-ZTWXZ') == 0) {
        return true;
      }
    });
  }

  getSxBall() {
    const {peiyu} = this.props;
    return peiyu.filter( (item) => {
      if (item.id.indexOf('YXYZTW-YXXZ') == 0) {
        return true;
      }
    });
  }

  getSxNums(item) {
    let id = item.id;
    let nums = [];
    const {platformInfo} = this.props;
    let animal = platformInfo.animal;
    let _name = id.split('-')[2];
    for (let animalName in animal) {
      if (_name == animalName ) {
        nums = animal[animalName];
      }
    }
    return nums;
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    let _this = this;
    
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    
    return (
      <div className="table4-column">
        <div className="pure-g">
          <div className="pure-u-6-24"><div className="ui-item-son ui-header">号码</div></div>
          <div className="pure-u-6-24"><div className="ui-item-son ui-header">赔率</div></div>
          <div className="pure-u-6-24"><div className="ui-item-son ui-header">号码</div></div>
          <div className="pure-u-6-24"><div className="ui-item-son ui-header">赔率</div></div>
        </div>
        <div className="table4-body ball-margin-right">
          <div className="pure-g">
            {this.getTailBall().map((item, index) => {
              return (<div key={index} className="pure-u-1-2">
                <div className="pure-u-1-2">
                  <div className="ui-item-son ui-item-son-ball">
                    {_this.renderBall(item)}
                  </div>
                </div>
                <div className="pure-u-1-2">
                  <div onClick={_this.onPeiyuSelected.bind(_this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
                </div>
              </div>);
            })}
          </div>
          <br />
          <div className="pure-g">
            <div className="pure-u-6-24"><div className="ui-item-son ui-header">生肖</div></div>
            <div className="pure-u-6-24"><div className="ui-item-son ui-header">赔率</div></div>
            <div className="pure-u-12-24"><div className="ui-item-son ui-header">号码</div></div>
            {this.getSxBall().map( (item, index) => {
              return <div className="pure-u-24-24" key={index}>
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
          </div>
        </div>
      </div>
    );
  }
};

YXYZTW.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

YXYZTW.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object,
  platformInfo: PropTypes.object
};

export default YXYZTW;