import React, {Component, PropTypes} from 'react';
import Ball from './Ball';
class Lucky28Ball extends Component {

  constructor(props) {
    super(props);
    this.colors = {
      'pk10green': [1,4,7,10,16,19,22,25],
      'pk10gray': [0,13,14,27],
      'pk10blue':[2,5,8,11,17,20,23,26],
      'pk10red':[3,6,9,12,15,18,21,24]
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
    return <Ball color={color} num={num} />
  }
}

Lucky28Ball.propTypes = {
  num: PropTypes.number.isRequired,
}

export default Lucky28Ball;