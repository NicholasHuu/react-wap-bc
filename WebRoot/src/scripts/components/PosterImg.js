import React, {Component, PropTypes} from 'react';

class PosterImg extends Component {
  render() {
    return <div onClick={this.props.onClick} className="template-type template-poster">
      <div className="inner">
        { this.props.bg &&  <img src={this.props.bg} className="image-bg" /> }
        <img src={this.props.image} alt=""/>
      </div>
    </div>;
  }
};

PosterImg.propTypes = {
  image: PropTypes.string,
  bg: PropTypes.string,
  onClick: PropTypes.func,
};

PosterImg.defaultProps = {
  image: '',
  bg: '',
  onClick: () => {},
};

export default PosterImg