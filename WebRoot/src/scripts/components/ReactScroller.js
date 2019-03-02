import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

const FPS = 20;
const STEP = 1;
const SPEED_SCROLLER = 1 / FPS * 1000;
const TIMEOUT = 3 // 5s 一次滚动

class ReactScroller extends Component {
  
  constructor(props) {
    super(props);
    this.timer = null;
    this.componentMouted = false;
    this.state = {
      crtIndex: 0, // 当前消息的索引值
      textHeight: 0,
      scrollHeight: 0,
    };
    this.initData(props);
  }

  initData(props) {
    this.messages = props.messages;
    this.messages.push(this.messages[0]);
  }

  applyStyle() {
    let scroller = ReactDOM.findDOMNode(this.refs['ui-marquee-scroller']);

    let height = scroller.children[0].offsetHeight;
    this.setState({
      textHeight: height
    });
  }

  animate() {
    if (!this.componentMouted) {
      return 
    }
    let scroller = ReactDOM.findDOMNode(this.refs['ui-marquee-scroller']);
    let crtIndex = this.state.crtIndex + 1;
    // 最后一个
    if (crtIndex == this.messages.length) {
      crtIndex = 0;
    }
    this.setState({
      scrollHeight: crtIndex * this.state.textHeight,
      crtIndex: crtIndex
    });
  }

  componentDidMount() {
    this.componentMouted = true;
    this.applyStyle();
    this.timer = setInterval(this.animate.bind(this), TIMEOUT * 1000);
  }

  componentWillUnmount() {
    this.componentMouted = false;
    clearInterval(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  render() {
    
    let style = {
      'transform': 'translate3d(0px, -'+this.state.scrollHeight+'px, 0px)',
      'WebkitTransform': 'translate3d(0px, -'+this.state.scrollHeight+'px, 0px)',
      'MsTransform': 'translate3d(0px, -'+this.state.scrollHeight+'px, 0px)',
      'MozTransform': 'translate3d(0px, -'+this.state.scrollHeight+'px, 0px)'
    };
    
    // 最后一个
    if (this.state.crtIndex > 0) {
      style['transition'] = 'transform .5s ease';
    }

    let props = this.props;
    return <div ref="ui-marquee" className={"ui-marquee " + (props.className || '')} style={ {overflow: 'hidden'} }>
      <div className="ui-marquee-inner" ref="ui-marquee-inner" style={ {overflow: 'hidden', height: this.state.textHeight+'px'} }>
        <div className="ui-marquee-scroller" ref="ui-marquee-scroller" style={ style }>
        {this.messages.map((msg, index) => {
          return <div style={ {height: '14px', lineHeight: '14px'} } className="ui-marquee-text" key={index}>{msg}</div>
        })}
      </div></div>
    </div>;
  }
};

ReactScroller.defaultProps = {
  messages: [],
};

ReactScroller.propTypes = {
  messages: PropTypes.array,
};

export default ReactScroller;