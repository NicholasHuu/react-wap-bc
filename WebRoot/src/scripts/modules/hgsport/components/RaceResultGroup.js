import React ,{ Component , PropsTypes } from 'react';
import {connect} from 'react-redux';

import RaceResultFootball from './RaceResultFootball';
import RaceResultBasketball from './RaceResultBasketball';


class RaceResultGroup extends Component {

  constructor(props){
    super(props);
  }

  renderGroup(items) {
    let html = [];
    let index = 1;
    for (let group of items) {
      let results = group['result'];
      let groupName = group['league'];
      let matchType = results[0].flScoreC;
      // 篮球没有这个数据 在这里用来判断是否是足球还是篮球
      if (typeof matchType == 'undefined') {
        html.push(<RaceResultBasketball groupIndex={index} name={groupName} items={results} key={index} />);  
      } else {
        html.push(<RaceResultFootball groupIndex={index} name={groupName} items={ results } key={index} />);  
      }
      
      index += 1;
    }

    return html;
  }

  render(){
    const {items} = this.props;

    return (
      <div className="result-group">
        <div className="basketball">
          {this.renderGroup(items)}
        </div>
      </div>
    );
  }
}

export default RaceResultGroup;