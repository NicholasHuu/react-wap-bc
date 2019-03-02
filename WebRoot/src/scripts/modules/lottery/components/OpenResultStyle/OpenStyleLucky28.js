import React , { Component , PropTypes } from "react";
import {connect }  from "react-redux";

import Lucky28Ball from './Lucky28Ball';

class OpenStyleLucky28 extends Component{
  
  render(){
    let code = this.props.code;
    if(!code){
      code = "";
    }
    let code_1 = [],code_2 = [];
    code_1 = code.split("=");
    code_2 = code_1[0].split("+");  
    return(
      <div className="circle open-lucky28">
        <ul className="">
          <li><Lucky28Ball num={parseInt(code_2[0])} /></li>
          <li className="add-icon">+</li>
          <li><Lucky28Ball num={parseInt(code_2[1])} /></li>
          <li className="add-icon">+</li>
          <li><Lucky28Ball num={parseInt(code_2[2])} /></li>
          <li className="add-icon">=</li>
          <li><Lucky28Ball num={parseInt(code_1[1])} /></li>
        </ul>
      </div>
      
    )
  }
}


function mapStateToProps(state){
  const {app,userModule} = state;
  return{
    app,userModule
  }
}
export default connect(mapStateToProps)(OpenStyleLucky28);