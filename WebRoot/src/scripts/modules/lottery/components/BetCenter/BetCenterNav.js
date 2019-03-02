import React , { Component , PropTypes } from "react";
import {withRouter} from 'react-router';
import {Link ,NavLink} from 'react-router-dom';

class BetCenterNav extends Component{

  constructor(props) {
    super(props);
    const {match,history,location} = this.props;
    this.state = {
      crtpath: match.path,
      tabLinks: []
    };
    this.gameCode = match.params.gameCode;
    this.setTabLinks(false);
  }

  setTabLinks(refresh = true) {
    let gameCode = this.gameCode;
    let links = [{
      to: '/lottery/betcenter/'+gameCode+'/home' ,
      title: '投注',
      marking: 'home'
    }, {
      to: '/lottery/betcenter/'+gameCode+'/open',
      title: '开奖',
      marking: 'open'
    }, {
      to: '/lottery/betcenter/'+gameCode+'/order',
      title: '注单',
      marking: 'order'
    }, {
      to: '/lottery/betcenter/'+gameCode+'/rule',
      title: '玩法',
      marking: 'rule'
    }];
    if (refresh) {
      this.setState({
        tabLinks: links
      });
    } else {
      this.state.tabLinks = links;
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const {match} = nextProps;
    this.gameCode = match.params.gameCode;
    this.setTabLinks();
  }

  onTabClick(index) {
    this.props.onTabClick(index);
  }

  render(){
    const link = this.state.tabLinks;
    const crtIndex = this.props.index;
    const _this = this;
    
    return(
      <div className="bet-nav">
        <div className="inner">
          {link.map(function(item,index){
            return(
              <a key={index} to={item.to} onClick={_this.onTabClick.bind(_this, index)} className={"item "+(crtIndex == index ? "active" : "" )} >
                <div>{item.title}</div>
              </a>
            )
          })}
        </div>
      </div>
    )
  }
}

BetCenterNav.defaultProps = {
  index: 0,
  onTabClick: () => {},
};

BetCenterNav.propTypes = {
  index: PropTypes.number,
  onTabClick: PropTypes.func
};

export default withRouter(BetCenterNav);