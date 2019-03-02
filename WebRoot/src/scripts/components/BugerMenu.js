import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import BurgeMenuAnimate from 'react-burger-menu';

const Menu = BurgeMenuAnimate.push;

const settings = {
  
};

class BugerMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateOpen: this.props.isOpen
    };
    this.onStateChange = this.onStateChange.bind(this);
  }
  
  remToPixel(rem) {
    let fontSize = parseInt(window.getComputedStyle(window.document.body).getPropertyValue('font-size'));
    return rem * fontSize;
  }

  onStateChange(state) {
    this.setState({
      stateOpen: state.isOpen
    });
    this.props.onStateChange(state);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      stateOpen: nextProps.isOpen
    });
  }

  render() {
    const {className} = this.props;
    return (
      <div id="burger-menu-wrap" className={className + ' ' + (this.state.stateOpen ? 'is-open': '') }>
        <Menu onStateChange={this.onStateChange} isOpen={this.state.stateOpen} noOverlay right width={ this.remToPixel(13.83) } pageWrapId={'burge-menu-content'} outerContainerId={'burger-menu-wrap'}>
          {React.createElement(this.props.menu, this.props, null)}
        </Menu>
        <div id="burge-menu-content">
          {this.props.children}
        </div>
      </div>
    );
  }
};

BugerMenu.defaultProps = {
  onStateChange: () => {}
};

BugerMenu.propTypes = {
  menu: PropTypes.func.isRequired,
  onStateChange: PropTypes.func
};

export default BugerMenu;