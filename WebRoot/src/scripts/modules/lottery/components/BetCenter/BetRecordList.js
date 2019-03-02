import React , { Component , PropTypes } from "react";
import {connect} from 'react-redux';
import BetRecordListUnit from './BetRecordListUnit';
 
class BetRecordList extends Component{


  render(){
    const list = this.props.list;
    return(
      <div className="bet-recordList">
        <ul>
          {list.map(function(items,index){
            return(
              <BetRecordListUnit item={items} key={index} />
            )
          })}
        </ul>
      </div>
    )
  }
}

export default BetRecordList;