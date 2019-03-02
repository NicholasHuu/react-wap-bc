import React, {Component, PropTypes} from 'react';

class PosterMsg extends Component {
  render() {
    return <div onClick={this.props.onClick} className="template-type template-poster">
      <div className="inner">
        { this.props.bg && <img src={this.props.bg} className="image-bg" /> }
        <img src={this.props.image} alt=""/>
        <div className="bottom">
          <h4>{this.props.title}</h4>
          <i>点击查看</i>
        </div>
      </div>
    </div>;
  }
};

PosterMsg.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  bg: PropTypes.string,
  onClick: PropTypes.func,
};

PosterMsg.defaultProps = {
  image: '',
  title: '',
  bg: '',
  onClick: () => {},
};

export default PosterMsg