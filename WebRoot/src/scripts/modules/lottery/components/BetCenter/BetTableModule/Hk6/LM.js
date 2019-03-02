import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

import {range} from '../../../../utils/helper';

class HX extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rrtype: 0,
      playMode: 1, // 2,
      selectedNums: [],
      dm1: 0,
      dm2: 0
    };
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }

  componentWillReceiveProps(nextProps) {
    const {selectedPeiyu} = nextProps;
    if (typeof selectedPeiyu[0] == 'undefined') {
      this.setState({
        selectedNums: [],
        dm1: 0,
        dm2: 0
      });
    }
  }
  
  renderBall(peiyuItem) {
    let number = peiyuItem.number;
    if (isNaN(number * 1 )) {
      return <span className={peiyuItem.id}>{number}</span>
    } else {
      return <HKBall num={peiyuItem.number*1}/>;
    }
  }

  getPeiyuItemWithId(id) {
    const {peiyu} = this.props;
    for (let item of peiyu) {
      if (item.id == id) {
        return item;
      }
    }

    return {};
  }

  setCrtRRType(type){
    this.setState({
      rrtype: type,
      selectedNums: [],
      dm1: 0,
      dm2: 0,
      playMode: 1
    });
  }

  setCrtPlayMode(playMode) {
    this.setState({
      playMode,
      selectedNums: [],
      dm1: 0,
      dm2: 0,
    });
  }

  onNumberSelected(num) {
    let nums = this.state.selectedNums;
    let index = nums.indexOf(num);
    let dm1 = 0;
    let dm2 = 0;
    if (index == -1 ) {
      nums.push(num);
    } else {
      let part1 = nums.slice(0, index);
      let part2 = nums.slice(index+1);
      nums = part1.concat(part2);
    }
    
    if (this.state.playMode == 2) {

      if (!this.state.dm1) {
        dm1 = num;
        this.setState({
          dm1: num
        });
      } else {
        dm1 = this.state.dm1;
      }

      if (this.state.dm1 && !this.state.dm2) {
        dm2 = num;
        this.setState({
          dm2: num
        });
      } else {
        dm2 = this.state.dm2;
      }
    }

    this.setState({
      selectedNums: nums
    });

    this.props.onPeiyuSelected(this.state.rrtype, this.state.playMode, nums, dm1, dm2);
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;

    console.log(['peiyu', this.state.playMode]);
    
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    
    return (
      <div className="table4-column">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <div className="ui-item-son ui-header">赔率</div>
          </div>
          <div className="pure-u-1-1">
            <div className="pure-u-8-24"><div className="ui-item-son">三全中</div></div>
            <div className="pure-u-4-24"><div className="ui-item-son">{this.getPeiyuItemWithId('LM-3QZ-3QZ').pl}</div></div>
            <div className="pure-u-8-24"><div className="ui-item-son">三中二之中二</div></div>
            <div className="pure-u-4-24"><div className="ui-item-son">{this.getPeiyuItemWithId('LM-3Z2-Z2').pl}</div></div>
            <div className="pure-u-8-24"><div className="ui-item-son">三中二之中三</div></div>
            <div className="pure-u-4-24"><div className="ui-item-son">{this.getPeiyuItemWithId('LM-3Z2-Z3').pl}</div></div>
            <div className="pure-u-8-24"><div className="ui-item-son">二全中</div></div>
            <div className="pure-u-4-24"><div className="ui-item-son">{this.getPeiyuItemWithId('LM-2QZ-2QZ').pl}</div></div>
            <div className="pure-u-8-24"><div className="ui-item-son">二中特之中特</div></div>
            <div className="pure-u-4-24"><div className="ui-item-son">{this.getPeiyuItemWithId('LM-2ZT-ZT').pl}</div></div>
            <div className="pure-u-8-24"><div className="ui-item-son">二中特之中二</div></div>
            <div className="pure-u-4-24"><div className="ui-item-son">{this.getPeiyuItemWithId('LM-2ZT-TZ2').pl}</div></div>
            <div className="pure-u-8-24"><div className="ui-item-son">特串</div></div>
            <div className="pure-u-4-24"><div className="ui-item-son">{this.getPeiyuItemWithId('LM-TC-TC').pl}</div></div>
          </div>
          <div className="pure-u-1-1">
            <div className="ui-item-son ui-header">类别</div>
            <div className="pure-u-1-1">
              <div className="pure-u-1-5"><div onClick={this.setCrtRRType.bind(this, 0)} className={"ui-item-son " + (this.state.rrtype == 0 ? 'active': '') } >三全中</div></div>
              <div className="pure-u-1-5"><div onClick={this.setCrtRRType.bind(this, 1)} className={"ui-item-son " + (this.state.rrtype == 1 ? 'active': '') } >三中二</div></div>
              <div className="pure-u-1-5"><div onClick={this.setCrtRRType.bind(this, 2)} className={"ui-item-son " + (this.state.rrtype == 2 ? 'active': '') }>二全中</div></div>
              <div className="pure-u-1-5"><div onClick={this.setCrtRRType.bind(this, 3)} className={"ui-item-son " + (this.state.rrtype == 3 ? 'active': '') }>二中特</div></div>
              <div className="pure-u-1-5"><div onClick={this.setCrtRRType.bind(this, 4)} className={"ui-item-son " + (this.state.rrtype == 4 ? 'active': '') }>特串</div></div>
            </div>
            <div className="pure-u-1-1">
              <div className="pure-u-1-2"><div onClick={this.setCrtPlayMode.bind(this, 1)} className={"ui-item-son " + (this.state.playMode == 1 ? 'active': '') }>复式</div></div>
              <div className="pure-u-1-2"><div onClick={this.setCrtPlayMode.bind(this, 2)} className={"ui-item-son " + (this.state.playMode == 2 ? 'active': '') }>胆拖</div></div>
            </div>
            {this.state.playMode == 2 && <div className="pure-u-1-1">
              <div className="pure-u-1-2">
                <div className="pure-u-1-2"><div className="ui-item-son">胆1</div></div>
                <div className="pure-u-1-2"><div className="ui-item-son"> {   this.state.dm1 ? this.state.dm1: '请选择' } </div></div>
              </div>
              {( this.state.rrtype == 0 || this.state.rrtype == 1 ) && <div className="pure-u-1-2">
                <div className="pure-u-1-2"><div className="ui-item-son">胆2</div></div>
                <div className="pure-u-1-2"><div className="ui-item-son">{ this.state.dm2 ? this.state.dm2: '请选择'  }</div></div>
              </div>}
            </div>}
            <div className="pure-u-1-1">
              {range(1, 49).map( (num) => {
                return <div key={num} onClick={this.onNumberSelected.bind(this, num)} className="pure-u-1-4" ><div className={ "ui-item-son " + (this.state.selectedNums.indexOf(num) != -1 ? 'active': '') }><HKBall num={num} /></div></div>
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

HX.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

HX.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default HX;