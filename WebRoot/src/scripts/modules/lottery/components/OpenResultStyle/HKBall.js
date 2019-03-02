import React, {Component, PropTypes} from 'react';
import Ball from './Ball';
class HKBall extends Component {

  constructor(props) {
    super(props);
    this.colors = {
      'hk-red': [1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46],
      'hk-blue': [3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48],
      'hk-green':[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]
    };
  }

  getColorFromNum(num) {
    let color = '';
    for (color in this.colors) {
      let nums = this.colors[color];
      if(nums.indexOf(num) >= 0){
        return color;
      }
    }
  }

  render() {
    let num = this.props.num;
    let color = this.getColorFromNum(num);
    if (num < 10) {
      num = "0"+num;
    }
    return <Ball color={color} num={num} />
  }
}

HKBall.propTypes = {
  num: PropTypes.number.isRequired,
}

export default HKBall;