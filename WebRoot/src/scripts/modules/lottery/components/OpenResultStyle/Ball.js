import React, {Component, PropTypes} from 'react';

class Ball extends Component {
  render() {
    const {color, num} = this.props;

    return <span className={'ball ball-' + color}>{num}</span>
  }
}

Ball.propTypes = {
  num: PropTypes.oneOf(PropTypes.number.isRequired, PropTypes.string.isRequired),
  color: PropTypes.string,
}

export default Ball;