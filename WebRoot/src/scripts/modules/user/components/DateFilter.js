import React, {Component, PropTypes} from 'react';

import DatePicker from '../../../components/DatePicker';

class DateFilter extends Component {

  constructor(props) {
    super(props);
    this.onDateFromChange = this.onDateFromChange.bind(this);
    this.onDateToChange = this.onDateToChange.bind(this);
    this.fromDate = '';
    this.toDate = '';
  }
  
  onDateFromChange(value) {
    this.fromDate = value;
    this.props.onChange(this.fromDate, this.toDate);
  }

  onDateToChange(value) {
    this.toDate = value;
    this.props.onChange(this.fromDate, this.toDate);
  }

  render() {
    return (
      <div className="date date-filter">
        <div className="start-date-txt">
          <DatePicker placeholder={this.props.placeholderStart} value={''} onChange={this.onDateFromChange } />
        </div>
        <div className="end-date-txt">
          <DatePicker placeholder={this.props.placeholderEnd} value={''} onChange={this.onDateToChange } />
        </div>
      </div>
    );
  }
};

DateFilter.defaultProps = {
  onChange() {
    
  }
};

DateFilter.propTypes = {
  onChange: PropTypes.func,
  placeholderStart: PropTypes.string,
  placeholderEnd: PropTypes.string
};

export default DateFilter;