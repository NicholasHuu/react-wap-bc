import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

import Base from './Base';

class ZM1T6 extends Base {

  getGroupPeiyu() {
    const {peiyu} = this.props;
    // 对赔率进行组合
    let groupPeiyu = {'ZM1T6-ZM1': [], 'ZM1T6-ZM2': [], 'ZM1T6-ZM3': [], 'ZM1T6-ZM4': [], 'ZM1T6-ZM5': [], 'ZM1T6-ZM6': []};
    for (let item of peiyu) {
      let id = item.id;
      for (var key in groupPeiyu) {
        if (id.indexOf(key) == 0 ) {
          groupPeiyu[key].push(item);
        }
      }
    }

    return [groupPeiyu, {'ZM1T6-ZM1': '正码 1', 'ZM1T6-ZM2': '正码 2', 'ZM1T6-ZM3': '正码 3', 'ZM1T6-ZM4': '正码 4', 'ZM1T6-ZM5': '正码 5', 'ZM1T6-ZM6': '正码 6'}]
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    let [groupPeiyu, groupLabel] = this.getGroupPeiyu();
    
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    return (
      <div className="table4-column">
        <div className="table4-body">
          {Object.keys(groupPeiyu).map( (key, index) => {
            let groupPeiyuItems = groupPeiyu[key];
            return (
              <div key={key} className="pure-g">
                <h3 className="group-title">{groupLabel[key]}</h3>
                <div className="pure-g">
                  {groupPeiyu[key].map((item, index) => {
                    let name = item.id;
                    
                    return (
                    <div key={index} className="pure-u-1-2">
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
          })}
          
        </div>
      </div>
    );
  }
};

ZM1T6.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

ZM1T6.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default ZM1T6;