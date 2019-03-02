import React, {Component, PropTypes} from 'react';

class TrendLastNums extends Component {
  
  render() {
    
    const {lottery} = this.props;
    let trend = lottery.get('trend');
    if (typeof trend.head == 'undefined') {
      return null;
    }

    return (
      <div className="trend-data trend-last-nums">
        <div className="trend-wrap">
          
          <div className="table-header">
            <ul className="clearfix">
              <li>期次</li>
              <li>开奖号码</li>
            </ul>
          </div>

          <div className="table-body">
            
            {trend.list.map( (item, index) => {

              return ( <ul key={index} className="clearfix">
              <li>{item.qsFormat}期</li>
              <li>
                {item.openCode.map( (code, i2) => {
                  return <span key={`${index}-${i2}`}>{code}</span>
                } )}
              </li>
            </ul>)
            } )}
            
          </div>
        </div>
      </div>
    );
  }

};

export default TrendLastNums;