import React, {Component, PropTypes} from 'react';

class Timepicker extends Component {

  constructor(props) {
    super(props);
    this.onHourOrMinChange = this.onHourOrMinChange.bind(this);
  }
  
  range(f, t) {
    let nums = [];
    for (; f < t + 1; f++) {
      nums.push(f);
    }
    return nums;
  }

  onHourOrMinChange(type) {
    const {onChange} = this.props;
    onChange(this.refs.hour.value+':' + this.refs.min.value);
  }

  render() {
    let {value} = this.props;
    if (value == '') {
      value = '00:00';
    }
    let parts = value.split(':');
    return (
      <div className="timepicker">
        <div className="tpwrap">
          <div className="tp-item">
            <span className="num">{ ( "0" + parts[0] ).substr(-2)  }
              <select ref="hour" value={ parts[0] } onChange={this.onHourOrMinChange}>
                {this.range(0, 24).map( hour => <option key={hour} value={hour}>{("0"+hour).substr(-2) }</option>)}
              </select>
            </span>
            <span className="label">时</span>
          </div> 
          <div className="tp-item">
            <span className="num">{ ( "0" + parts[1] ).substr(-2) }
              <select ref="min" value={ parts[1] }  onChange={this.onHourOrMinChange}>
                {this.range(0, 59).map( min => <option key={min} value={min}>{("0"+min).substr(-2) }</option>)}
              </select>
            </span>
            <span className="label">分</span>
          </div>
        </div>
      </div>
    );
  }
};

Timepicker.defaultProps = {
  onChange: () => {},
  value: ''
};

Timepicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default Timepicker;
