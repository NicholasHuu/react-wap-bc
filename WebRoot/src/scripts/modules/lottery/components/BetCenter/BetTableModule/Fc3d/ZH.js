import React, {Component, PropTypes} from 'react';

import {range} from '../../../../utils/helper';

const DIFF_ID = 'ZH-EZZH_DIF-DIF';
const SAME_ID = 'ZH-EZZH_SAME-SAME';
const SZ_SZ = 'ZH-SZZH_SZ-SZ';
const SZ_ZU3 = 'ZH-SZZH_ZU3-ZU3';
const SZ_ZU6 = 'ZH-SZZH_ZU6-ZU6';

class ZH extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ezzh: [],
      szzh: [],
    };
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }

  getRenderNums() {
    let nums = [];
    const {subpankou, peiyu} = this.props;
    let code = `ZH-${subpankou.xzlxCode}`;
    return peiyu.filter( (item) => {
      if (item.id.indexOf(code) == 0 ) {
        return true;
      }
    });
  }

  onNumberSelected(type, num, group) {
    
    let nums = this.state[type];
    let minLen = 2;
    if (type == 'szzh') {
      minLen = 3;
    }
    
    let key = `${group}-${num}`;
    let isExist = false;
    let newnums = nums.filter( (fnum) => {
      if (fnum[key] != undefined) {
        isExist = true;
        return false;
      }
      return true;
    });
    if (!isExist) {
      newnums.push({
        [key]: num
      });
    }
  
     // 超出长度就把第一个去掉
    if (newnums.length > minLen) {
      newnums.splice(0, 1);
    }

    this.setState({
      [type]: newnums
    });
    
    // 拼出选出的哪一个赔率和对应的数字
    let selectedNums = newnums.map( newnum => {
      return newnum[Object.keys(newnum)[0]];
    });

    function isSame(content) {
      var isSame = true;
      for (var i = 0; i < content.length - 1; i++) {
        if (content[i] != content[i+1]) {
          isSame = false;
        }
      }
      return isSame;
    }

    function isWhat(content) {
      
      var newarray = [];
      for (var i = 0; i < content.length; i++) {
        if (newarray.indexOf(content[i]) == -1) {
          newarray.push(content[i]);
        }
      }
      
      return newarray.length;
    }
    let peiyuItems = this.getRenderNums();
    let item;
    if (type == 'ezzh') {
      let same = isSame(selectedNums);
      let ID = same ? SAME_ID: DIFF_ID;
      item = peiyuItems.filter( peiyuItem => {
        if (peiyuItem.id == ID ) {
          return true;
        }
      })[0];
    } else if (type == 'szzh') {
      let what = isWhat(selectedNums);
      let ID ;
      if (what == 3) {
        ID = SZ_ZU6;
      } else if (what == 2) {
        ID = SZ_ZU3;
      } else {
        ID = SZ_SZ;
      }
      item = peiyuItems.filter(peiyuItem => {
        if (peiyuItem.id == ID ) {
          return true;
        }
      })[0];
    }
      
    item = Object.assign({}, item);
    item.number = selectedNums.join('');
    this.props.onPeiyuSelected(item, 'fc3d_zh');

  }

  numIsSelected(type, group, num) {
    let nums = this.state[type];
    let key = `${group}-${num}`;
    let isExist = false;
    for (let mnum of nums) {
      if (mnum[key] != undefined) {
        isExist = true;
        break;
      }
    }
    return isExist;
  }

  renderYZZH() {
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
            {this.getRenderNums().map((item, index) => {
              return (<div key={index} className="pure-u-1-2">
                <div className="pure-u-1-2">
                  <div className="ui-item-son ui-item-son-ball">
                    <span className={item.id}>{item.number}</span>
                  </div>
                </div>
                <div className="pure-u-1-2">
                  <div onClick={_this.onPeiyuSelected.bind(this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
                </div>
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }

  renderEZZH() {
    let _this = this;
    return (
      <div className="table4-column">

        <div className="head-2_2">
          <div className="pure-g">
            {this.getRenderNums().map(item => {
              return <div className="pure-u-1-2" key={item.id}><div className="ui-item-son">{item.number}@{item.pl}</div></div>
            })}
          </div>
        </div>
        
        <div className="pure-g">
          {range(0, 1).map(group => {
            let children = range(0, 9).map( num => {
              let exist = _this.numIsSelected('ezzh', group, num);
              return (
                <div key={num} className="ui-item-son">
                  <div onClick={_this.onNumberSelected.bind(_this, 'ezzh', num, group)}> <span className={"peiyu peiyu-radius " + ( exist  ?  'selected': '') }>{num}</span></div>
                </div>
              );
            });
            return (
              <div key={group} className="pure-u-1-2">
                {children}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderSZZH() {
    let _this = this;
    return (
      <div className="table4-column">

        <div className="head-2_2">
          <div className="pure-g">
            {this.getRenderNums().map(item => {
              return <div className="pure-u-1-3" key={item.id}><div className="ui-item-son">{item.number}@{item.pl}</div></div>
            })}
          </div>
        </div>
        
        <div className="pure-g">
          {range(0, 2).map(group => {
            let children = range(0, 9).map( num => {
              let exist = _this.numIsSelected('szzh', group, num);
              return (
                <div key={num} className="ui-item-son">
                  <div onClick={_this.onNumberSelected.bind(_this, 'szzh', num, group)}> <span className={"peiyu peiyu-radius " + ( exist  ?  'selected': '') }>{num}</span></div>
                </div>
              );
            });
            return (
              <div key={group} className="pure-u-1-3">
                {children}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    const {subpankou, peiyu} = this.props;
    if (subpankou.xzlxCode == 'YZZH') {
      return this.renderYZZH();
    } else if (subpankou.xzlxCode == 'EZZH') {
      return this.renderEZZH();
    } else if (subpankou.xzlxCode == 'SZZH') {
      return this.renderSZZH();
    }
  }
};

ZH.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

ZH.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default ZH;