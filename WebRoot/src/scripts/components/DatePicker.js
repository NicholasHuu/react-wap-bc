import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import {format, DateFromString} from '../utils/datetime';

class DatetimePicker extends Component {

  constructor(props) {
    super(props);
    this.dateFormat = 'Y-m-d';
    this.state = {
      date: '',
    };
    this.hasChanged = false;
    this.onDateChange = this.onDateChange.bind(this);
    let value = this.props.value;
    if (typeof value == 'string') {
      if (value == '') value = new Date();
      else value = DateFromString(value);
    }
    this.state.date =  format(value, this.dateFormat);
  }

  onDateChange() {
    let date = this.refs.date.value;
    this.setState({
      date
    });
    this.hasChanged = true;
    this.props.onChange(date);
  }

  render() {
    return (
      <div className="datetime-picker">
        <div className="datetime-viewer">
          <span className="date">
            { this.hasChanged == false  &&  this.props.placeholder  != '' ? this.props.placeholder: this.state.date  }
            <input type="date" ref="date" onChange={this.onDateChange} />
          </span>
        </div>
      </div>
    );
  }
};

DatetimePicker.defaultProps = {
  value: '',
  placeholder: '',
  onChange: () => {}
};

DatetimePicker.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default DatetimePicker