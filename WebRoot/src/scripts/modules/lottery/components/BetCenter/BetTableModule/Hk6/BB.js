import React, {Component, PropTypes} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';
import {parseQuery} from '../../../../../../utils/url';

class BB extends Component {

  constructor(props) {
    super(props);
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }
  
  renderBall(peiyuItem) {
    let number = peiyuItem.number;
    if (isNaN(number * 1 )) {
      return <span className={peiyuItem.id}>{number}</span>
    } else {
      return <HKBall num={peiyuItem.number*1}/>;
    }
  }

  renderBallGroup(id) {
    let groupBB = {
      'BB-BB-RED_ODD': [1, 7, 13, 19, 23, 29, 35, 45],
      'BB-BB-RED_EVEN': [2, 8, 12, 18, 24, 30, 34, 40, 46],
      'BB-BB-RED_BIG': [29, 30, 34, 35, 40, 45, 46],
      'BB-BB-RED_SMALL': [1, 2, 7, 8, 12, 13, 18, 19, 23, 24],
      'BB-BB-GREEN_ODD': [5, 11, 17, 21, 27, 33, 39, 43],
      'BB-BB-GREEN_EVEN': [6, 16, 22, 28, 32, 38, 44, 49],
      'BB-BB-GREEN_SMALL': [5, 6, 11, 16, 17, 21, 22],
      'BB-BB-GREEN_BIG': [27, 28, 32, 33, 38, 39, 43, 44, 49],
      'BB-BB-BLUE_ODD': [3, 9, 15, 25, 31, 37, 41, 47],
      'BB-BB-BLUE_EVEN': [4, 10, 14, 20, 26, 36, 42, 48],
      'BB-BB-BLUE_BIG': [25, 26, 31, 36, 37, 41, 42, 47, 48],
      'BB-BB-BLUE_SMALL': [3, 4, 9, 10, 14, 15, 20],
    };
    let groupBBB = {
      'BB-BBB-RED_BIG_ODD': [29, 35, 45],
      'BB-BBB-RED_BIG_EVEN': [30, 34, 40, 46],
      'BB-BBB-RED_SMALL_ODD': [1, 7, 13, 19, 23],
      'BB-BBB-RED_SMALL_EVEN': [2, 8, 12, 18, 24],
      'BB-BBB-GREEN_BIG_ODD': [27, 33, 39, 43],
      'BB-BBB-GREEN_BIG_EVEN': [28, 32, 38, 44],
      'BB-BBB-GREEN_SMALL_ODD': [5, 11, 17, 21],
      'BB-BBB-GREEN_SMALL_EVEN': [6, 16, 22],
      'BB-BBB-BLUE_BIG_ODD': [25, 31, 37, 41, 47],
      'BB-BBB-BLUE_BIG_EVEN': [26, 36, 42, 48],
      'BB-BBB-BLUE_SMALL_ODD': [3, 9, 15],
      'BB-BBB-BLUE_SMALL_EVEN': [4, 10, 14, 20],
    };

    let groupBall = groupBB[id];
    if (!groupBall) {
      groupBall = groupBBB[id];
    }

    return (
      <div className="ball-group">
        {groupBall.map( (ball, index) => {
          return <HKBall key={index} num={ball} />
        })}
      </div>
    );
  }

  getPeiyuThatToView() {
    const {peiyu, match, location} = this.props;
    let query = parseQuery(location.search);
    if (!query.subpankou) {
      query.subpankou = 'BBB';
    }

    let items = peiyu.filter((item) => {
      if (item.id.indexOf(query.pankou+ '-' + query.subpankou + '-') == 0 ) {
        return true;
      }
      return false;
    });

    return items;
  }

  render() {
    const {peiyu, selectedPeiyu, match, location} = this.props;

    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    
    return (
      <div className="table4-column">
        {this.getPeiyuThatToView().map( (item, index) => {
          return (
            <div key={index} className="pure-g ball-margin-right">
              <div className="pure-u-6-24">
                <div className="ui-item-son">号码 / 赔率 </div>
              </div>
              <div className="pure-u-18-24">
                <div className="pure-u-1-2">
                  <div className={"ui-item-son " + item.id}>{item.number}</div>
                </div>
                <div className="pure-u-1-2">
                  <div className="ui-item-son">{item.pl}</div>
                </div>
              </div>
              <div className="pure-u-1-1">
                <div className={"ui-item-son " + ( selectedPeiyu[item.id] ? 'active': '' )} onClick={this.onPeiyuSelected.bind(this, item)}>
                  {this.renderBallGroup(item.id)}
                </div>
              </div>
            </div>);
        })}
        
      </div>
    );
  }
};

BB.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

BB.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default BB;