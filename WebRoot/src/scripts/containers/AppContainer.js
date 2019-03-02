import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

class AppContainer extends Component {

  render() {
    return (
      <div className="app-container">
        {this.props.children}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    
  };
}

export default connect(mapStateToProps)(AppContainer); 

