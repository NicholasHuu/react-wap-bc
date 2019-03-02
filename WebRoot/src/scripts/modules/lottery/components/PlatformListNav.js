import  React ,{ Component, PropTypes} from "react";
import {connect } from "react-redux";
import {Link} from 'react-router-dom';

class PlatformListNav extends Component{
  constructor(props){
    super(props);
  }
  
  render(){
    const gameList = this.props.items;
    return (
      <div className="nav-list">
        <div className="inner">
          {gameList.map( (item, index) =>{
            return (
              <Link key={index} to={"/lottery/betcenter/"+ item.flatCode + '/home'}>
                {item.smallBackgroundPic && <img src={item.smallBackgroundPic} className="image-bg" alt=""/> }
                <div className="items"><span><img src={item.smallPic} alt=""/></span><p>{item.flatName}</p></div>
              </Link>
            )
          })}
        </div>        
      </div>
    )
  }
}

PlatformListNav.propTypes = {
  items: PropTypes.array.isRequired
};


export default PlatformListNav;