import React , { Component , PropTypes } from "react";
import {connect }  from "react-redux";

import Ball from './Ball';

class OpenStyleCommon extends Component{
  
  render(){
    let code = this.props.code;
    let type = this.props.type;
    if(!type){
      return null;
    }
    type = type.toLowerCase();
    if(!code){
      code = "";
    }
    let codeList = [];
    codeList = code.split(",");
    return(
      <div className={"circle open-common " + type+"-ball"}>
        <ul>
          {codeList.map(function(item,index){
            return(
              <li key={index}><Ball num={parseInt(item)} color={"red"} /></li>
            )
          })}
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
export default connect(mapStateToProps)(OpenStyleCommon);