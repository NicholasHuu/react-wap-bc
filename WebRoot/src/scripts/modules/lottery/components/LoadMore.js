import React , { Component , PropTypes} from "react";
import {connect} from "react-redux";


import Header from "../../../components/Header";
import Back from "../../../components/Back";


class LoadMore extends Component{

  render(){
    const { dispatch, match, location} = this.props;
    const clickEvent = this.props.event;
    let status = this.props.status;
    return(
      <div onClick={clickEvent} className="load-more">
        <span ref="text-type-1" id="load-more-text1">{status ? "加载中..." : "加载更多"}</span>
        
      </div>
    )
  }
}

export default LoadMore;
