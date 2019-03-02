import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {parseQuery, buildQuery} from '../../../utils/url';


class BugerHgMenu extends Component {
  
  constructor(props) {
    super(props);
    let ballTypes = this.props.ballTypes;
    this.crtballType = null;
  }

  onRtypeSelect(link, ballType) {
    const {history, onBugerMenuItemSelected} = this.props;
    history.push(link);
    onBugerMenuItemSelected(ballType);
    this.crtballType = ballType;
  }

  assignDefaultBallType(props) {
    let ballTypes = props.ballTypes;
    let location = props.location;
    let query = parseQuery(location.search);
    if (ballTypes.length) {
      if (query.rType) {
        for (let balltype of ballTypes) {
          if (balltype.rType == query.rType) {
            this.crtballType = balltype;
          }
        }
      } else {
        this.crtballType = ballTypes[0];
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.assignDefaultBallType(nextProps);
  }

  render() {
    let location = this.props.location;
    let ballTypes = this.props.ballTypes;
    for(let i in ballTypes){
      if(ballTypes[i].rName == "滚球"){
        ballTypes = ballTypes.splice(i,1);
      }
    }
    return (
      <div className="menu hg-buger-items">
        <section className="list-type menu-list">
          <ul>
            {ballTypes.map( ballType => {
              let to = Object.assign({}, location);
              let query = parseQuery(to.search);
              query.rType = ballType.rType;
              to.key = ballType.rType + (new Date().getTime());
              to.search = buildQuery(query);
              return <li className={ ( this.crtballType && this.crtballType.rType == ballType.rType) ? 'active': ''} onClick={this.onRtypeSelect.bind(this, to, ballType)} key={ballType.rType}><div><i></i><span>{ballType.rName}</span></div></li>
            })}
          </ul>
        </section>
      </div>
    )
  };
}

BugerHgMenu.defaultProps = {
  onBugerMenuItemSelected: () => {},
};

BugerHgMenu.propTypes = {
  ballTypes: PropTypes.array
};

export default withRouter(BugerHgMenu);