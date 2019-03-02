import React, {Component, PropTypes} from 'react';

class ToggleBtn extends Component {

  render() {
    return (
      <label className="switch">
        <input type="checkbox" onChange={this.props.onChange} />
        <span className="slider round"></span>
      </label>
    );
  }

};

ToggleBtn.propTypes = {
  onChange: PropTypes.func,
};

ToggleBtn.defaultProps = {
  onChange: () => {},
};

export default ToggleBtn;
