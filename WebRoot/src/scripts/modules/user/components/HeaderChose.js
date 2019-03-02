import React, {Component, PropTypes} from 'react';
import BaseHeader from '../../../components/Header';
import {Link} from 'react-router-dom';
import TopBar from '../../../components/TopBar';

class Header extends BaseHeader {
    constructor(props){
        super(props);
        this.change = this.change.bind(this);
        this.state = {
          curValue: '',
          curText: '',
          status: false,
        }
    }
    componentWillMount(){
      const {list} = this.props;
      if(list){
        this.setState({
          curValue: list[0].value,
          curText: list[0].label,
        })
      }
    }
    change(item){
      if(item.value != this.state.curValue){
        this.setState({
          curValue: item.value,
          curText: item.label,
          status: !this.state.status
        })
        this.props.swithItem(item.value);
      }

    }
    showOrClose(){
      this.setState({
        status: !this.state.status
      })
    }
  render() {
    let list = this.props.list;
    if(!list) return null;
    let _this = this;
    return (
      <div className="header-chose">
        <h4 onClick={this.showOrClose.bind(this)}><p>{this.state.curText}<i className={"icon-triangle " +(this.state.status ? 'trans': '') }></i></p></h4>
        <div className={"chose-popup " +(this.state.status ? 'show' : '') }>
          {list.map(function(item,index){
            return <div className={"chose-item "+ (item.value == _this.state.curValue ? 'active' : '')} key={index} onClick={_this.change.bind(_this,item)}>{item.label}</div>
          })}
        </div>
      </div>
    )
  }

};

export default Header;