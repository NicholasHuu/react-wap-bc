import React, {PropTypes, Component} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

import Base from './Base';

class GG extends Base {

  onPeiyuSelected(item, key) {
    this.props.onPeiyuSelected(item, key);
  }

  getGroupPeiyu() {
    const {peiyu} = this.props;
    // 对赔率进行组合
    let groupPeiyu = {'GG-ZM1': [], 'GG-ZM2': [], 'GG-ZM3': [], 'GG-ZM4': [], 'GG-ZM5': [], 'GG-ZM6': []};
    for (let item of peiyu) {
      let id = item.id;
      for (var key in groupPeiyu) {
        if (id.indexOf(key) == 0 ) {
          groupPeiyu[key].push(item);
        }
      }
    }

    return [groupPeiyu, {'GG-ZM1': '正码 1', 'GG-ZM2': '正码 2', 'GG-ZM3': '正码 3', 'GG-ZM4': '正码 4', 'GG-ZM5': '正码 5', 'GG-ZM6': '正码 6'}]
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
                    let selectedItem = selectedPeiyu[key];
                    return (
                    <div key={index} className="pure-u-1-2">
                      <div className="pure-u-1-2">
                        <div className="ui-item-son ui-item-son-ball">
                          {this.renderBall(item)}
                        </div>
                      </div>
                      <div className="pure-u-1-2">
                        <div onClick={this.onPeiyuSelected.bind(this, item, key)} className="ui-item-son"> <span className={"peiyu " + ( selectedItem && selectedItem.id == item.id ? 'selected': '') }>{item.pl}</span></div>
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


GG.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

GG.propTypes = {
  peiyu: PropTypes.array,
  selectedPeiyu: PropTypes.object,
  onPeiyuSelected: PropTypes.func
};

export default GG;