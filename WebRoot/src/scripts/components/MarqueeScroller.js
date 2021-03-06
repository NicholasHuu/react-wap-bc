import React, {Component, PropTypes} from 'react';

import _Marquee from './ReactMarquee';
import TextScroller from './ReactScroller';

class Marquee extends Component {
  
  generateMessage() {
    return this.props.messages.join('  ');
  }

  render() {
    return (
      <div className="marquee">
        <div className="marquee-icon"><i></i></div>
        <div className="marquee-wrap">
          <TextScroller messages={this.props.messages} loop={true} hoverToStop={true}  />
        </div>
        <i className="arrow-icon"><img src="../misc/images/arrow-icon.png" alt="" /></i>
      </div>
    );
  }
};

Marquee.propTypes = {
  messages: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired]) 
};

export default Marquee;