import React, {Component, PropTypes} from 'react';

class ZXL extends Component {

  constructor(props) {
    super(props);
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
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
              return (<div key={index} className="pure-u-1-2">
                <div className="pure-u-1-2">
                  <div className="ui-item-son ui-item-son-ball">
                    <span className={item.id}>{item.number}</span>
                  </div>
                </div>
                <div className="pure-u-1-2">
                  <div className="ui-item-son"> <span className={"peiyu tiny " + (!selectedPeiyu[item.id] ? '': 'selected')} onClick={this.onPeiyuSelected.bind(this, item)}>请选择</span></div>
                </div>
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }
};

ZXL.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

ZXL.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default ZXL;