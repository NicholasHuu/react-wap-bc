import React, {Component, PropTypes} from 'react';
import {format} from '../../../utils/datetime';
import moment from 'moment';

let d = new Date();
let f = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);

export const periodes = [
   {
    text: '今天',
    to: moment(f).add(24 * 60 * 60 - 1 ,'seconds').format('YYYY-MM-DD HH:mm:ss'),
    from: moment(f).format("YYYY-MM-DD HH:mm:ss"),
  },  {
    text: '一周',
    to: moment().format('YYYY-MM-DD HH:mm:ss'),
    from: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
  }, {
    text: '一月',
    to: moment().format('YYYY-MM-DD HH:mm:ss'),
    from: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
];


class DatePeriodSwitcher extends Component {
  


  constructor(props) {
    super(props);
    
    this.state = {
      crtPeriod: '',
    };
  }

  onPeriodChange(period) {
    this.setState({
      crtPeriod: period
    });

    this.props.onPeriodChange(period);
  }

  render() {
    let self = this;
    return (
      <div className="helpermenu-wrap">
        <div className="helpermenu">
          <ul className="clearfix">
            {periodes.map( (period, index) => {
              return <li key={index} onClick={ this.onPeriodChange.bind(self, period) }><a>{period['text']}</a></li>;
            })}
          </ul>
        </div>
      </div>
    );
  }

};

DatePeriodSwitcher.propTypes = {
  onPeriodChange: PropTypes.func
};

DatePeriodSwitcher.defaultProps = {
  onPeriodChange: () => {},
};

export default DatePeriodSwitcher;