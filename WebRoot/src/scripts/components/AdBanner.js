import React ,{Component , PropTypes}  from 'react';
import {Link} from 'react-router-dom';

import {staticURL} from '../utils/url';

class AdBanner extends Component {
  render() {
    return(
      <div className="adBanner-inner">
        <img src={staticURL(this.props.image)} alt=""/>
      </div>
    )
  }
};

AdBanner.propTypes = {
  image: PropTypes.string
};

export default AdBanner;