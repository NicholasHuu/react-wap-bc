import React, {Component, PropTypes} from 'react';

import {codeUrl} from '../../../utils/url';

class ImageCode extends Component {
  
  
  constructor(props) {
    super(props);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      time: props.imageCodeState
    };
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      time: nextProps.imageCodeState
    });
  }



  onRefresh(event) {
    this.setState({
      time: new Date().getTime()
    });
  }

  render() {
    return (
      <div className="image-code">
        <img src={codeUrl() + '?t=' + this.state.time} onClick={this.onRefresh} />
      </div>
    );
  }
};

export default ImageCode;