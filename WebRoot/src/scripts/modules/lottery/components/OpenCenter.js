import React , { Component, PropTypes } from "react";
import {connect} from 'react-redux';
import {Link,withRouter} from 'react-router-dom';

import {resetOpenResultResult} from '../actions/LotteryAction';

class OpenCenter extends Component{
  
  constructor(props){
    super(props);
  }

  onItemClick(item) {
    let to = `/lottery/openiteminfo/${item.gameCode}`;
    const {history, dispatch} =  this.props;
    dispatch(resetOpenResultResult());
    history.push(to);
  }

  render(){
    let result = this.props.items;
    return(
      <div className="open-items">
        <ul>
          {result.map( (items, index) =>{
            return (
              <li className={items.gameCode} key={index}>
                <a onClick={this.onItemClick.bind(this, items)} >
                  <i className="icon"  style={ {backgroundImage: 'url('+items.bigPic+')' } }></i>
                  <div className="">
                    <p className="title"><span>{items.gameName}</span><span>第<i>{items.qs}</i>期</span></p>
                    <p className="number">{items.openCode}</p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )

  }
}

export default withRouter(OpenCenter);