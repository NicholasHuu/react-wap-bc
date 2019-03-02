import React, {Component, PropTypes} from 'react';

// 走势图
class TrendLastThreeNums extends Component {
  
  constructor(props) {
    super(props);
  
    this.state = {
      pos: 0
    };

    this.onPosClick = this.onPosClick.bind(this);
  }

  onPosClick(pos) {
    this.setState({
      pos
    });
  }

  render() {
    const {lottery} = this.props;
    let trend = lottery.get('trend');
    if (typeof trend.head == 'undefined') {
      return null;
    }
    if (trend.head.length <= 0) {
      return (
        <div className="trend-data trend-three-nums">
          <div className="trend-wrap">
            <div className="table-header">
                <ul>
                  <li style={ {width: '100%'} }>暂无走势数据</li>
                </ul>
            </div>
            <div className="table-body">
              
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="trend-data trend-three-nums">
        <div className="trend-wrap">
          <div className="table-header">
            <ul className="clearfix">
              <li style={ {width: '14%'} }>位数</li>
              {trend.head.map( (head, index) => {
                return <li style={ {width: ( ( 100 - 14 ) / trend.head.length ).toFixed(2) + '%'} } key={index} onClick={this.onPosClick.bind(this, index)} className={ this.state.pos == index ? 'active': '' }>{head.title}</li>
              } )}
            </ul>
            <ul className="clearfix body-header">
              <li style={ {width: '14%'} }>期次</li>
              { trend.head[this.state.pos].ball.map( (ball, index) => {
                return <li style={ { width: ( (100 - 14 ) / trend.head[this.state.pos].ball.length ).toFixed(2) + '%' } } key={index}>{ball}</li>
              } ) }
            </ul>
          </div>
          <div className="table-body">
            {trend.list.map( (list, index) => {
              let balls = trend.head[this.state.pos].ball;
              let code = list.openCode[this.state.pos];
              let pos = balls.indexOf( code );
              if (list.isOpen == 0) {
                return <ul>
                  <li style={ { width: '14%'} }>{list.qsFormat}期</li>
                  <li style={ {'text-align': 'center', width: '86%'} }>暂未开奖</li>
                </ul>
              }
              return <ul key={index} className="clearfix">
                <li key={`${index}--1`} style={ {width: '14%'} }>{list.qsFormat}期</li>
                { list.yilou[this.state.pos].map( (yl, i2) => {
                  return <li className={ ({true: 'selected'})[pos == i2] } style={ {width: ( (100 - 14) / trend.head[this.state.pos].ball.length ).toFixed(2) + '%' } } key={ `${index}-${i2}` }><span>{ yl }</span></li>;
                } ) }
              </ul>
            } )}

            {trend.total.map( (summary, index) => {
              return ( <ul key={index} className="clearfix">
                <li  key={`${index}--1`} style={ {width: '14%'} }>{summary['title']}</li>
                {summary.data[this.state.pos].map( (item, i2) => {
                  return <li style={ {width: ( (100 - 14) / trend.head[this.state.pos].ball.length ).toFixed(2) + '%' } } key={ `${index}-${i2}` }><span>{item}</span></li>
                } ) }
              </ul> );
            } )}

          </div>
        </div>
        
      </div>
    );
  }
};

export default TrendLastThreeNums;