import React, {Component, PropTypes} from 'react';

class RandomBtns extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewRandomBtns: false
    };
    this.onClickHandle = this.onClickHandle.bind(this);
  }

  onClickHandle(count = false) {
    this.setState({
      viewRandomBtns: !this.state.viewRandomBtns
    });
    count !== false && this.props.onRandom(count);
  }

  render() {
    return <div className="random-btns" onClick={ () => { this.onClickHandle(false) } }>
      {this.state.viewRandomBtns && <div className="random-options">
        <ul className="clearfix">
          <li onClick={() => { this.onClickHandle(1) } }>
            <span>1注</span>
          </li>
          <li onClick={ () => { this.onClickHandle(5)  } }>
            <span>5注</span>
          </li>
          <li onClick={ () => { this.onClickHandle(10) } }>
            <span>10注</span>
          </li>
        </ul>
      </div> }
      <button className="btn-random">机选</button>
    </div>
  }

};

RandomBtns.propTypes = {
  onRandom: PropTypes.func,
};

RandomBtns.defaultProps = {
  onRandom: () => {},
};

export default RandomBtns;