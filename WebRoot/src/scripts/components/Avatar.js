import React, {Component, PropTypes} from 'react';

class Avatar extends Component {

  render() {
    return <div className="template-type template-avatar" onClick={this.props.onClick}>
      <div className="inner">
        <div className="avatar-wrap">
          { this.props.bg && <img src={this.props.bg} className="image-bg" alt=""/> }
          <img src={this.props.avatar} alt=""/>
        </div>
        
        <i>{this.props.name}</i>
      </div>
    </div>
  }
}

Avatar.propTypes = {
  avatar: PropTypes.string,
  bg: PropTypes.string,
  onClick: PropTypes.func,
  name: PropTypes.string
};

Avatar.defaultProps = {
  avatar: '',
  bg: '',
  onClick: () => {},
  name: '',
};

export default Avatar;