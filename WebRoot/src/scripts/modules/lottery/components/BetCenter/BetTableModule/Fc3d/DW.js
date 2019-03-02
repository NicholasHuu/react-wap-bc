import React, {Component, PropTypes} from 'react';

import {range, unserializeContent, serializeContent} from '../../../../utils/helper';

class DW extends Component {

  constructor(props) {
    super(props);
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }

  getRenderNums() {
    let nums = [];
    const {subpankou, peiyu} = this.props;
    let code = `DW-${subpankou.xzlxCode}`;
    return peiyu.filter( (item) => {
      if (item.id.indexOf(code) == 0 ) {
        return true;
      }
    });
  }

  renderPeiyuNums() {
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
            {this.getRenderNums().map((item, index) => {
              return (<div key={index} className="pure-u-1-2">
                <div className="pure-u-1-2">
                  <div className="ui-item-son ui-item-son-ball">
                    <span className={item.id}>{item.number}</span>
                  </div>
                </div>
                <div className="pure-u-1-2">
                  <div onClick={this.onPeiyuSelected.bind(this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
                </div>
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }

  getGroupNumLabel(item) {
    let id = item.id;
    const {platformInfo} = this.props;
    if (platformInfo.betInfo) {
      return platformInfo.betInfo.oddinfo[1][id.split('-')[2]];
    }
    return '';
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

  renderGroupNums(item ,groups) {
    let _this = this;
    const {selectedPeiyu} = this.props;
    if (!item) {
      return null;
    }

    let groupNums = {};
    for (let groupName of groups) {
      groupNums[groupName] = range(0, 9);
    }

    let number = selectedPeiyu[item.id] ? selectedPeiyu[item.id].number: null;
    let selectedGroupNums = {};
    if (number) {
      selectedGroupNums = unserializeContent(number);
    }

    return (
      <div className="table-group">
        <div className="table4-column">
          <div className="table4-body">
            {Object.keys(groupNums).map( (groupName) => {
              let nums = groupNums[groupName];
              return (
                <div key={groupName} className="pure-g">
                  <div className="pure-u-1-1"><div className="ui-item-son ui-header">{groupName}</div></div>
                  {nums.map((num) => {
                    let isSelected = selectedGroupNums[groupName] && selectedGroupNums[groupName].indexOf(num) != -1 ;
                    return (
                      <div key={num} className="pure-u-12-24">
                        <div className="pure-u-12-24"><div className="ui-item-son ui-item-son-ball">{num}</div></div>   
                        <div className="pure-u-12-24">
                          <div onClick={_this.onPeiyuGroupSelected.bind(_this, groupName, num, item)} className="ui-item-son "> <span className={"peiyu " + ( isSelected ? 'selected': '') }>{item.pl}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    );
  }

  render() {

    const {subpankou, peiyu} = this.props;
    
    let getPeiyuItem = () => {
      if (subpankou.xzlxCode) {
        return peiyu.filter( (item) => {
          if (item.id.indexOf(`-${subpankou.xzlxCode}`) != -1) {
            return item;
          }
        })[0];
      }

      return [];
    }

    if (subpankou.xzlxCode == 'BDW'
      || subpankou.xzlxCode == 'SDW'
      || subpankou.xzlxCode == 'GDW') {
      return this.renderPeiyuNums();
    } else if (subpankou.xzlxCode == 'BSDW') {
      return this.renderGroupNums(getPeiyuItem(), ['佰', '拾']);
    } else if (subpankou.xzlxCode == 'BGDW') {
      return this.renderGroupNums(getPeiyuItem(), ['佰', '个']);
    } else if (subpankou.xzlxCode == 'SGDW') {
      return this.renderGroupNums(getPeiyuItem(), ['拾', '个']);
    } else if (subpankou.xzlxCode == 'BSGDW') {
      return this.renderGroupNums(getPeiyuItem(), ['佰', '拾', '个']);
    }
    return null;
  }
};

DW.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

DW.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default DW;