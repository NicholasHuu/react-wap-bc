import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

class Base extends Component {

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

  shouldBeRender(item) {
    const {subpankou} = this.props;
    if (Object.keys(subpankou).length <= 0 ) return true;
    if (item.id.indexOf(subpankou.xzlxCode) != -1 ) {
      return true;
    }
    return false;
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    let _this = this;
    return (
      <div className="table4-column">
        <div className="head-2_2">
          <ul className="clearfix">
            <li>号码</li>
            <li>赔率</li>
            <li>号码</li>
            <li>赔率</li>
          </ul>
        </div>
        <div className="table4-body">
          <div className="pure-g">
            {peiyu.map((item, index) => {
              if (_this.shouldBeRender(item)) {
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
              }
            })}
          </div>
        </div>
      </div>
    );
  }
};

Base.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

Base.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default Base;