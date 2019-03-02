import React, {Component, PropTypes} from 'react';

class StickLayout extends Component {
  render() {
    return (
      <div className={"stick-layout " + this.props.className}>
        <div className="inner">
          <div className="image">{this.props.image}</div>
          <div className="content">{this.props.content}</div>
        </div>
      </div>
    );
  }
};

StickLayout.propTypes = {
  image: PropTypes.object,
  content: PropTypes.object,
};

StickLayout.defaultProps = {
  className: ''
};

export default StickLayout;