import React, { Component, PropTypes } from "react";

class GameItemNav extends Component {

  constructor(props){
    super(props);
    
    this.state = {
      activeIndex: 0
    }
  }

  componentDidMount() {
    //
  }

  navSwitch(index,groupCode){
    this.setState({
      activeIndex: index
    });

    let anchorElement = document.getElementById(groupCode);      
    if (anchorElement) {
      // window.scrollTo(0, anchorElement.offsetTop - window.innerHeight / 2);
      console.log(anchorElement);
      anchorElement.scrollIntoView({
        'behavior': "smooth",
        'block': 'start',
        'inline': 'start' 
      })
    }

  }
  render() {
    let list = this.props.list;
    let _this = this;
    return(
      <div className="navList">
        <ul className="clearfix">
        {list.map(function(item,index){
          return(
            <li key={item.pxh} className={index == _this.state.activeIndex ? 'active' : ''} 
            onClick={_this.navSwitch.bind(_this,index,item.groupCode)}>{item.groupCodeName}</li>
          )
        })}
        </ul>
      </div>
    )
  }
} 

export default GameItemNav;


