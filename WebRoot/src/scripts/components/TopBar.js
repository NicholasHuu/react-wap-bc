import React, {Component, PropTypes} from 'react';

class TopBar extends Component {
  render() {
    const {className} = this.props;
    let _defaultClassName = 'site-header top-bar-header'
    if (className) {
      _defaultClassName += ' ' + className;
    }
    return (
      <div className={_defaultClassName}>
        {this.props.children}
      </div>
    );
  }
};

export default TopBar;