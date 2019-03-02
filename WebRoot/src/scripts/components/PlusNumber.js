import React, {Component, PropTypes} from 'react';

class PlusNumber extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.onChange = this.onChange.bind(this);
    this.onPlus = this.onPlus.bind(this);
    this.onSub = this.onSub.bind(this);
    this.disable = this.props.disable.split(',');
  }

  onPlus() {
    if (this.disable.indexOf('plus') != -1) return ;
    let value = this.state.value*1 + this.props.step > this.props.max ? this.props.max: this.state.value*1 + this.props.step;
    value = value.toFixed(1);
    this.setState({
      value
    });
    this.props.onChange(value);
  }

  onSub() {
    if (this.disable.indexOf('sub') != -1 ) return ;
    let value = this.state.value*1 - this.props.step < this.props.min ? this.props.min: this.state.value*1 - this.props.step;
    value = value.toFixed(1);
    this.setState({
      value
    });
    this.props.onChange(value);
  }

  onChange(el) {
    let value = el.target.value*1;
    if (isNaN(value)) {
      return ;
    }
    console.log(['value', value]);
    if (value > this.props.max) {
      value = this.props.max;
    } else if (value < this.props.min) {
      //value = this.props.min;
    }
    this.setState({
      value
    });
    this.props.onChange(value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.state.value) {
      this.state.value = nextProps.value;
    }
  }

  render() {
    return (<div className="plusnumber">
        <div className="wrap">
          <span onClick={this.onSub} className="left">-</span>
          <input type="text" name={this.props.name} value={ ( this.state.value )} onChange={this.onChange}/>
          <span onClick={this.onPlus}  className="right">+</span>
        </div>
      </div>);
  }

};

PlusNumber.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
  disable: PropTypes.string,
};

PlusNumber.defaultProps = {
  name: '',
  onChange: () => {},
  value: 1,
  max: 100000000,
  min: -100000000,
  step: .1,
  disable: '',
};

export default PlusNumber;