import React , { Component , PropTypes } from "react";
import {connect }  from "react-redux";

import HKBall from './HKBall';

class OpenStyleMarkSix extends Component{
  
  render(){
    let code = this.props.code;
    if(!code){
      code = "";
    }
    let code_1 = [],code_2 = [];
    code_1 = code.split("+");
    code_2 = code_1[0].split(",");  
    return(
      <div className="circle open-marksix">
        <ul className="">
          {code_2.map(function(item,index){
            return(
              <li key={index}><HKBall num={parseInt(item)} /></li>
            )
          })}
          <li className="add-icon">+</li>
          <li><HKBall num={parseInt(code_1[1])} /></li>
        </ul>
      </div>
      
    )
  }
}


export default OpenStyleMarkSix;