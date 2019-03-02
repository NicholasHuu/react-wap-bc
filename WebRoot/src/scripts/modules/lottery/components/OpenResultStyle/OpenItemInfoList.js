import React ,{ Component , PropTypes } from "react";

class OpenItemInfoList extends Component{
  
  constructor(props){
    super(props);
  }

  render(){
    let items = this.props.list;
    if(!items){items = [{},{}]}
    items = items.slice(1);
    return(
      <div className="open-item-info-list">
        <ul>
          {items.map(function(item,index){
            return(
              <li key={index}>
                <p>第<span>{item.qs}</span>期 <span>{item.openTime}</span></p>
                <p>{item.openCode}</p>
              </li>
            )
          })}
              
        </ul>
      </div>
      
    )
  }
}

export default OpenItemInfoList;