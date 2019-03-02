import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import {format, DateFromString} from '../utils/datetime';

class DateRange extends Component {

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
    this.onBack = this.onBack.bind(this);
    this.onForward = this.onForward.bind(this);
  }

  onBack() {
    let date = this.state.date;
    let timestamp = ~~(DateFromString(date).getTime() / 1000);
    let state = {
      date: format(new Date( ( timestamp - 24 * 60 * 60 ) * 1000 ) , this.dateFormat)
    };
    this.setState(state);

    this.hasChanged = true;
    this.props.onChange(state.date);
  }

  onForward() {
    let date = this.state.date;
    let timestamp = ~~(DateFromString(date).getTime() / 1000);
    let state = {
      date: format(new Date( ( timestamp + 24 * 60 * 60 ) * 1000 ) , this.dateFormat)
    };
    this.setState(state);

    this.hasChanged = true;
    this.props.onChange(state.date);
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
      <div className="datetime-picker datetime-range-picker">
        <span className="back" onClick={this.onBack}></span>
        <div className="datetime-viewer">
          <span className="date">
            { this.hasChanged == false  &&  this.props.placeholder  != '' ? this.props.placeholder: this.state.date  }
          </span>
        </div>
        <span className="forward" onClick={this.onForward}></span>
      </div>
    );
  }
};

DateRange.defaultProps = {
  value: '',
  placeholder: '',
  onChange: () => {}
};

DateRange.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default DateRange