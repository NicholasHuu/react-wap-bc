import React, {Component, PropTypes} from 'react';

const posarr = ["万", "千", "百", "十", "个"];
const codes = {'rx_rx2_zuxfs': 2, 'rx_rx3_zu3': 3, 'rx_rx3_zu6': 3};
const k3 = 'k3';
import {rxShouldRendeAndDefaultPos} from '../utils/Lottery';

// 彩票的号码面板
class NumberBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIds: [],
      touchedIds: {},
      selectPos: [],
      groupQuicks: {

      }
    };

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clean) {
      let [_, selectPos] = this.rxShouldRendeAndDefaultPos();
      this.setState({
        groupQuicks: {},
        selectPos,
      });
      let selectedIds = this.emptySelectIds();
      this.setState({
        selectedIds
      });
    }

    if (nextProps.numbers.length != this.props.numbers.length || this.state.selectedIds.length != nextProps.numbers.length) {
      let selectedIds = this.emptySelectIds();
      let [_, selectPos] = this.rxShouldRendeAndDefaultPos();
      this.setState({
        selectedIds,
        selectPos,
      });
    }

    let selectedNums = nextProps.selectedNums;
    if (selectedNums !== this.props.selectedNums && selectedNums.length > 0) {
      // 任选号码放在了第二个位置
      let [shouldRende, selectPos] = this.rxShouldRendeAndDefaultPos();
      if (shouldRende) {
        selectedNums = selectedNums[1];
      }
      this.setSelectIds(selectedNums);
      this.setState({
        selectPos
      });
    }
  }

  emptySelectIds() {
    const {numbers} = this.props;
    if (numbers.length) {
      let selectedIds = [];
      numbers.map( (numGroup, index) => {
        selectedIds[index] = [];
      });
      this.state.selectedIds = selectedIds;
      return selectedIds;
    }
  }

  setSelectIds(selectedIds) {
    const {numbers, viewYl} = this.props;
    let self = this;

    this.setState({
      selectedIds
    }, () => {
      // 如果只有一组号码，则需要对选择的号码降维
      // [ [1,2,3] ] ====> [1,2,3]
      let nums = selectedIds;
      if (numbers.length == 1) {
        nums = selectedIds[0];
      }
      
      // 任选需要特殊处理
      let [shouldRende, _] = self.rxShouldRendeAndDefaultPos();
      if (shouldRende) {
        let pos = [];
        for (let name of self.state.selectPos) {
          pos.push(posarr.indexOf(name));
        }
        nums = [pos, nums];
      }

      self.props.onSelected(nums);
    });
  }
  
  // 全
  selectAll(index, group) {
    let balls = group['ball'];
    let name = group['ws'];
    let nums = [];
    let selectedIds = this.state.selectedIds;
    selectedIds[index] = [];
    for (let ball of balls) {
      ball = ball.hm;
      selectedIds[index].push(ball);
    }
    let groupQuicks = this.state.groupQuicks;
    groupQuicks[group['ws']] = 'all';
    
    this.setSelectIds(selectedIds);

    this.setState({
      groupQuicks
    });
  }

  ballMax(balls) {
    let max = 0;
    for (let ball of balls) {
      ball = ball.hm;
      if (ball * 1 > max) {
        max = ball *1;
      }
    }

    return max;
  }

  //大
  selectBig(index, group) {

    let balls = group['ball'];
    let name = group['ws'];
    let nums = [];
    let selectedIds = this.state.selectedIds;
    selectedIds[index] = [];
    let max = this.ballMax(balls);
    for (let ball of balls) {
      ball = ball.hm;
      let middle = max % 2 == 0 ? max / 2 : Math.floor(max / 2);
      if (ball * 1 > middle) {
        selectedIds[index].push(ball);
      }
    }

    let groupQuicks = this.state.groupQuicks;
    groupQuicks[group['ws']] = 'big';
  
    this.setSelectIds(selectedIds);
    this.setState({
      groupQuicks
    });
  }

  //小
  selectSmall(index, group) {
    let balls = group['ball'];
    let name = group['ws'];
    let nums = [];
    let selectedIds = this.state.selectedIds;
    selectedIds[index] = [];
    let max = this.ballMax(balls);
    for (let ball of balls) {
      ball = ball.hm;
      let middle = max % 2 == 0 ? max / 2 : Math.floor(max / 2);
      if (ball * 1 <= middle) {
        selectedIds[index].push(ball);
      }
    }

    let groupQuicks = this.state.groupQuicks;
    groupQuicks[group['ws']] = 'small';
  
    this.setSelectIds(selectedIds);
    this.setState({
      groupQuicks
    });
  }

  //单
  selectOdd(index, group) {

    let balls = group['ball'];
    let name = group['ws'];
    let nums = [];
    let selectedIds = this.state.selectedIds;
    selectedIds[index] = [];
    for (let ball of balls) {
      ball = ball.hm;
      if (ball * 1 % 2  != 0 ) {
        selectedIds[index].push(ball);
      }
    }

    let groupQuicks = this.state.groupQuicks;
    groupQuicks[group['ws']] = 'odd';
  
    this.setSelectIds(selectedIds);
    this.setState({
      groupQuicks
    });
  }

  // 双
  selectEven(index, group) {

    let balls = group['ball'];
    let name = group['ws'];
    let nums = [];
    let selectedIds = this.state.selectedIds;
    selectedIds[index] = [];
    for (let ball of balls) {
      ball = ball.hm;
      if (ball * 1 % 2  == 0 ) {
        selectedIds[index].push(ball);
      }
    }

    let groupQuicks = this.state.groupQuicks;
    groupQuicks[group['ws']] = 'even';
  
    this.setSelectIds(selectedIds);
    this.setState({
      groupQuicks,
    });
  }

  // 清
  selectClean(index, group) {

    let balls = group['ball'];
    let name = group['ws'];
    let nums = [];
    let selectedIds = this.state.selectedIds;
    selectedIds[index] = [];

    let groupQuicks = this.state.groupQuicks;
    groupQuicks[group['ws']] = 'clean';
  
    this.setSelectIds(selectedIds);
    this.setState({
      groupQuicks,
    });
  }

  numberSelected(num, index) {
    
    let selectedIds = this.state.selectedIds;
    
    let nums = selectedIds[index];

    let gameCode = this.props.gameCode;
    // 包胆 | 胆拖
    if (gameCode.search(/\_bd$/) != -1 || ( gameCode.search(/\_dt$/) != -1 && index == 0 ) ) {
      nums = [num];
    } else if (gameCode.indexOf('tm_tm_bs') != -1) {
      // 特码包三 只能选择3个号码
      var i = nums.indexOf(num);
      if (i == -1 ) {
          if (nums.length > 2) {
            nums.splice(0, 1);// 把第一个弹出去
          }
          nums.push(num);
      } else {
        nums.splice(i, 1);
      }

    } else {
      if (!!!nums) {
        nums = [];
      }
      let i = nums.indexOf(num);
      if ( i == -1) {
        nums.push(num);
      } else {
        nums.splice(i, 1);
      }
    }

    selectedIds[index] = nums;

    this.setSelectIds(selectedIds);
  }

  setTouchedNumber(num, name) {
    let key = `${num}-${name}`;
    let touchedIds = Object.assign({}, this.state.touchedIds);
    touchedIds[key] = true;
    this.setState({
      touchedIds
    });
  }

  releaseTouchedNumber(num, name) {
    let key = `${num}-${name}`;
    let touchedIds = Object.assign({}, this.state.touchedIds);
    touchedIds[key] = false;
    this.setState({
      touchedIds
    });
  }

  rxShouldRendeAndDefaultPos() {
    const {gameCode} = this.props;
    return rxShouldRendeAndDefaultPos(gameCode);
  }

  rxPostionSelect(pos) {
    let selectPos = this.state.selectPos;
    let index = selectPos.indexOf(pos);
    if (index == -1) {
      selectPos.push(pos);
    } else {
      selectPos.splice(index, 1);
    }
    this.setState({
      selectPos
    });
    this.setSelectIds(this.state.selectedIds);
  }

  // 渲染任选玩法下的位置
  renderRxPosition() {
    
    let [shouldRende, defaultSelectPos] = this.rxShouldRendeAndDefaultPos();
    let selectPos = this.state.selectPos;
    if (selectPos.length <= 0) {
      selectPos = defaultSelectPos;
    }
    let self = this;

    return shouldRende && <div className="rx-pos-wrap">
      <ul className="clearfix">
        {posarr.map( (name, index) => {
          return (
            <li key={index} onClick={self.rxPostionSelect.bind(self, name)} className={ selectPos.indexOf(name) != -1 ? 'active': '' }><span>{name}</span></li>
          );
        })}
      </ul>
    </div>;
  }
    
  // 渲染快三
  renderK3() {
    const {numbers, viewYl, yl, lottery, gameCode} = this.props;
    let shortGameCode = gameCode.replace(lottery+ '_', '');
    let self = this;

    let isDigit = num => !isNaN(num * 1);
    
    // 渲染骰子
    let renderSz = (num)  => {
      let nums = num.split("");
      let html = [];
      let i = 0;
      for (let n of nums){
        html.push(<span key={ shortGameCode + i } className={ "sz sz-" + n }>{n}</span>);
        i ++;
      }
      return html;
    };

    // 是否渲染骰子
    let shouldRendeSz = () => {
      if (shortGameCode == 'ds_ds_dtys' 
        || shortGameCode == 'es_es_ebt' 
        || shortGameCode == 'es_es_eth'
        || shortGameCode == 'ss_ss_slh'
        || shortGameCode == 'ss_ss_sbt'
        || shortGameCode == 'ss_ss_sth') {
        return true;
      }
      return false;
    }

    return (
          <div className="nums-group">

            {numbers.map((numGroup, index) => {
              let nums = numGroup['ball'];
              let name = numGroup['ws'];
              let code = numGroup['code'];
              let ylNums = typeof yl[code] == 'undefined' ? []: yl[code];
              return ( <div className="nums-item" key={`numgroup-${index}`}>
                <div className={"k3 right " + shortGameCode + ' ' + ( shouldRendeSz() ? 'sz-right':'' )}>
                  {nums.map((num, i) => {
                    let des = num['sm'];
                    num = num['hm'];
                    return ( <div 
                      key={`num-el-${i}`} 
                      className={"num-el " +  (self.state.selectedIds[index] && self.state.selectedIds[index].indexOf(num) != -1 ? 'active': '') + ' ' 
                      + ' '  
                      + ( !isDigit(num) && (num+"").length > 1 ? 'num-el-'+num.length: ''  ) }>
                      <div 
                        onClick={ self.numberSelected.bind(self, num, index) } 
                        onTouchStart={self.setTouchedNumber.bind(self, num, name)} 
                        onTouchEnd={self.releaseTouchedNumber.bind(self, num, name)} 
                        className={"num " + ( self.state.touchedIds[`${num}-${name}`] ? 'high': '' ) }>
                        <span className="view-num">
                          {shouldRendeSz() && renderSz(num) }
                          {!shouldRendeSz() && <span className="nc">{num}</span> }
                          {!shouldRendeSz() && des && <span className="nd">{des}</span>}
                        </span>
                        <span className="border"></span>
                      </div>
                    </div> );
                  })}
                </div>
              </div>);
            })}
            
          </div>
    );
  }
    
  // 渲染一般号码
  renderPlainNumber() {
    const {numbers, viewYl, yl} = this.props;
    let self = this;

    let isDigit = num => !isNaN(num * 1);

    return (
          <div className="nums-group">
            
            {this.renderRxPosition()}

            {numbers.map((numGroup, index) => {
              let nums = numGroup['ball'];
              let name = numGroup['ws'];
              let code = numGroup['code'];
              let viewQuick = !!(numGroup['fastButton']*1);
              let ylNums = typeof yl[code] == 'undefined' ? []: yl[code];
              return ( <div className="nums-item" key={`numgroup-${index}`}>
                <div className="left">
                  { <span className={"name " + ( name != "" ? '': 'disable' ) }>{name}</span> }
                  { viewYl && <span className="name">遗漏</span> }
                </div>
                <div className="right">
                  {nums.map((num, i) => {
                    num = num['hm']+"";
                    return ( <div 
                      key={`num-el-${i}`} 
                      className={"num-el " +  (self.state.selectedIds[index] && self.state.selectedIds[index].indexOf(num) != -1 ? 'active': '') + ' ' 
                      + ( viewYl ? '': 'hide-yl' ) + ' '  
                      + ( !isDigit(num) && (num+"").length > 1 ? 'num-el-'+num.length: ''  ) }>
                      <div 
                        onClick={ self.numberSelected.bind(self, num, index) } 
                        onTouchStart={self.setTouchedNumber.bind(self, num, name)} 
                        onTouchEnd={self.releaseTouchedNumber.bind(self, num, name)} 
                        className={"num " + ( self.state.touchedIds[`${num}-${name}`] ? 'high': '' ) }>
                        {isDigit(num) && <span className="high-num">
                          <span className="hn-wrap">{num}</span>
                        </span> }
                        <span className="view-num">{num}</span>
                      </div>
                       <span className="yl"> {ylNums[num*1]} </span>
                    </div> );
                  })}
                </div>
                { viewQuick &&  <div className="quick-nums right">
                  <div className={"num-el quick-el " + ( self.state.groupQuicks[numGroup['ws']] == 'all' ? '': '' )} 
                    onClick={self.selectAll.bind(self, index, numGroup)}>
                    <div className="num">
                      <div className="view-num">全</div>
                    </div>
                  </div>
                  <div className={"num-el quick-el " + ( self.state.groupQuicks[numGroup['ws']] == 'big' ? '': '' )} 
                    onClick={self.selectBig.bind(self, index, numGroup)}>
                    <div className="num">
                      <div className="view-num">大</div>
                    </div>
                  </div>
                  <div className={"num-el quick-el " + ( self.state.groupQuicks[numGroup['ws']] == 'small' ? '': '' )} 
                    onClick={self.selectSmall.bind(self, index, numGroup)}>
                    <div className="num">
                      <div className="view-num">小</div>
                    </div>
                  </div>
                  <div className={"num-el quick-el " + ( self.state.groupQuicks[numGroup['ws']] == 'odd' ? '': '' )} 
                    onClick={self.selectOdd.bind(self, index, numGroup)}>
                    <div className="num">
                      <div className="view-num">单</div>
                    </div>
                  </div>
                  <div className={"num-el quick-el " + ( self.state.groupQuicks[numGroup['ws']] == 'even' ? '': '' )} 
                    onClick={self.selectEven.bind(self, index, numGroup)}>
                    <div className="num">
                      <div className="view-num">双</div>
                    </div>
                  </div>
                  <div className={"num-el quick-el " + ( self.state.groupQuicks[numGroup['ws']] == 'clean' ? '': '' )} 
                    onClick={self.selectClean.bind(self, index, numGroup)}>
                    <div className="num">
                      <div className="view-num">清</div>
                    </div>
                  </div>
                </div> }
              </div>);
            })}
            
          </div>
    );
  }

  render() {

    const {lottery} = this.props;
    if (lottery.indexOf(k3) != -1) {
        return this.renderK3();
    } else {
      return this.renderPlainNumber();
    }
  }
};

NumberBoard.propTypes = {
  numbers: PropTypes.array,
  onSelected: PropTypes.func,
  viewYl: PropTypes.bool,
  clean: PropTypes.bool,
  lottery: PropTypes.string,
  gameCode: PropTypes.string,
  viewQuick: PropTypes.bool,
  selectedNums: PropTypes.array,
  yl: PropTypes.object,
};

NumberBoard.defaultProps = {
  numbers: [],
  onSelected: () => {},
  viewYl: true,
  clean: false,
  lottery: '',
  gameCode: '',
  viewQuick: true,
  selectedNums: [],
  yl: {},
};

export default NumberBoard;