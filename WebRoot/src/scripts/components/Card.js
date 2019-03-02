import React, {Component, PropTypes} from 'react';

class Card extends Component {
  render() {
    const {light, className} = this.props;
    return <div className={ className + " template-type card-template " + (light ? 'card-light-template': '')} onClick={this.props.onClick}>
      {this.props.bg && <img src={this.props.bg} className="image-bg" />}
      <div className="inner">
        <img src={this.props.image} alt=""/>
        <div className="right">
          <h4>{this.props.title}</h4>
          <p>{this.props.summary}</p>
        </div>
      </div>
    </div>
  }
};

Card.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  summary: PropTypes.string,
  onClick: PropTypes.func,
  light: PropTypes.bool,
  bg: PropTypes.string,
  className: PropTypes.string,
};

Card.defaultProps = {
  image: '',
  title: '',
  summary: '',
  onClick: () => {},
  light: false,
  bg: '',
  className: ''
};

export default Card;