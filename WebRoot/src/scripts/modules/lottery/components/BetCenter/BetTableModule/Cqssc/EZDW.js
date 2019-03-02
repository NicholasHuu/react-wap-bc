import React, {Component, PropTypes} from 'react';

import {range, unserializeContent, serializeContent} from '../../../../utils/helper';

class EZDW extends Component {

  constructor(props) {
    super(props);
    this.groups = {
      'EZDW-EZDW-EZDW': ['万', '仟', '佰', '拾', '个'], 
    };
  }

  onPeiyuGroupSelected(groupName, num, peiyu) {
    const {selectedPeiyu} = this.props;
    let number = selectedPeiyu[peiyu.id] && selectedPeiyu[peiyu.id].number;
    if (!number) {
      number = serializeContent({[groupName]: [num]});
    } else {
      let numbers = unserializeContent(number);
      let nums = numbers[groupName];
      if (!nums) {
        nums = [];
      }
      let index = nums.indexOf(num);
      if (index == -1) {
        nums.push(num);
      } else {
        nums.splice(index, 1);
      }
      numbers[groupName] = nums;
      number = serializeContent(numbers);
    }
    
    let clonedPeiyu = Object.assign({}, peiyu, {
      number
    });
    this.props.onPeiyuSelected(clonedPeiyu, clonedPeiyu.id);
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    let _this = this;

    return <div className="table4-column">
      {peiyu.map( item => {
        let number = selectedPeiyu[item.id] ? selectedPeiyu[item.id].number: null;
        let selectedGroupNums = {};
        if (number) {
          selectedGroupNums = unserializeContent(number);
        }
        return <div key={item.id} className="pure-g">
          
          {_this.groups[item.id] && _this.groups[item.id].map( groupName => {
            return <div className="pure-u-1-1" key={groupName}>
              <div className="pure-u-1-1"><div className="ui-item-son">{groupName}位</div></div>
              {range(0, 9).map(num => {
                let isSelected = selectedGroupNums[groupName] && selectedGroupNums[groupName].indexOf(num) != -1 ;
                return <div className="pure-u-1-2" key={ `${groupName}-${num}` }>
                  <div className="pure-u-1-2"><div className="ui-item-son">{num}</div></div>
                  <div className="pure-u-1-2">
                      <div onClick={_this.onPeiyuGroupSelected.bind(_this, groupName, num, item)} className="ui-item-son"> <span className={"peiyu " + (!isSelected ? '': 'selected') }>{item.pl}</span></div>
                  </div>
                </div>
              })}
            </div>
          })}
          
        </div>
        
      })}

    </div> ;
  }
};

EZDW.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

EZDW.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default EZDW;