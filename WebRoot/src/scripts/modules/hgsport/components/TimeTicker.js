import React, {Component, PropTypes} from 'react';

class TimeTicker extends Component {
  
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      second: this.props.second
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  startTimer() {
    let _this = this;
    if (this.timer) {
      this.destroyTimer();
    }
    this.timer = window.setInterval(() => {
      // 倒计时结束后 停止倒计时 并尝试调用 finished() 方法
      if (_this.state.second <= 0 ) {
        _this.destroyTimer();
        _this.props.finished();
      } else {
        _this.props.start && _this.setState({
          second: _this.state.second - 1
        });
      }
    }, 1000);
  } 

  destroyTimer() {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.second != this.state.second && nextProps.start) {
      this.state.second = nextProps.second;
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.destroyTimer();
  }

  render() {
    return <div className="time-ticker"><i className="time-ticker-second">{this.state.second}</i>&nbsp;刷新</div>;
  }
}

TimeTicker.defaultProps = {
  finished: () => {},
  start: true
};

TimeTicker.proptTypes = {
  start: PropTypes.bool.isRequired,
  second: PropTypes.number,
  finished: PropTypes.func
};

export default TimeTicker;