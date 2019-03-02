import React , { Component , PropTypes } from "react";
import {connect }  from "react-redux";

import Pk10Ball from './Pk10Ball';

class OpenStylePk10 extends Component{
  
  render(){
    let code = this.props.code;
    if(!code){
      code="";
    }
    let currentCode=[];
    currentCode = code.split(",");
    
    return(
      <div className="circle open-Pk10">
        <ul className="">
          {currentCode.map(function(item,index){
            return(
              <li key={index}><Pk10Ball num={parseInt(item)} /></li>
            )
          })}
        </ul>
      </div>
      
    )
  }
}

export default OpenStylePk10;