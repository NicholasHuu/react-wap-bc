import React, {Component, PropTypes} from 'react';
import {formatTimer} from '../../../utils/datetime';

class LotteryTimer extends Component {

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      second: props.second
    };
    this.startTimer = this.startTimer.bind(this);
  }

  componentDidMount() {
    if (!this.props.isClose) {
      this.startTimer(this.state.second);  
    }
  }

  componentWillReceiveProps(nextProps) {
    let second = nextProps.second;
    if (!nextProps.isClose) {
      this.startTimer(second);  
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startTimer(second) {
    const {onFinish, isClose} = this.props;
    if (isClose) return ;
    if (this.timer) {
      clearInterval(this.timer);
    }
    let self = this;
    self.timer = setInterval(() => {
      second--;

      if (second <= 0 ) {
        onFinish();
        clearInterval(self.timer);
        self.timer = null;
      } else {
        self.setState({
          second
        });
      }

    }, 1000);
  }

  render() {
    const {second} = this.state;
    const {isClose, closeDes} = this.props;
    let html = null;
    if (isClose) {
      html = <span className="lottery-timer">{closeDes}</span>
    } else {
      html = <span className="lottery-timer">{formatTimer(second)}</span>
    }
    return html;
  }
};

LotteryTimer.propTypes = {
  second: PropTypes.number,
  isClose: PropTypes.bool,
  closeDes: PropTypes.string,
  onFinish: PropTypes.func
};

LotteryTimer.defaultProps = {
  second: 0,
  isClose: false,
  closeDes: '',
  onFinish: () => {},
};

export default LotteryTimer;