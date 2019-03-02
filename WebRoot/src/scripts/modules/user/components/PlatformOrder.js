import React, {PropTypes, Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

class PlatformOrder extends Component {

  goLogPage(link) {
    const {history} = this.props;
    history.push(link); 
  }

  render() {
    const {path} = this.props.match;
    const {items} = this.props;
    if(!items){
      return false;
    }
    return (
      <div className="user-order-list">
        <ul>
          {items.map( (item, index) => {
            return <li onClick={this.goLogPage.bind(this, path+'/'+item.flat ) } key={index}>
              <i><img src={item.smallPic} alt=""/></i>
              <span>{item.flatName}平台</span>
              <div className="arrow"></div>
            </li>;
          })}
        </ul>
      </div>
    );
  }
};

PlatformOrder.propTypes = {
  items: PropTypes.array.isRequired
};

export default withRouter(PlatformOrder);
