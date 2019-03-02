import React, {Component, PropTypes} from 'react';
import Ball from './Ball';


class Pk10Ball extends Component {

  constructor(props) {
    super(props);
    this.colors = {
      'one': [1],
      'two':[2],
      'three':[3],
      'four':[4],
      'five':[5],
      'six':[6],
      'seven':[7],
      'eight':[8],
      'nine':[9],
      'ten': [10]
    };
  }

  getColorFromNum(num) {
    let color = '';
    for (color in this.colors) {
      let nums = this.colors[color];
      if(nums.indexOf(num) == 0){
        return color;
      }
    }
  }

  render() {
    let num = this.props.num;
    let color = this.getColorFromNum(num);
    return <Ball color={color} num={num} />
  }
}

Pk10Ball.propTypes = {
  num: PropTypes.number.isRequired,
}

export default Pk10Ball;