import React, {Component, PropTypes} from 'react';


class SelectBox extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.onSelect = this.onSelect.bind(this);
    this.onClick = this.onClick.bind(this);

    this.uniqueId =  () => {
      let nums = [];
      for (let i = 0; i < 5; i++) {
        nums.push( Math.floor( Math.random() * 10) );
      }
      return nums.join('');
    };
  }

  componentWillMount() {
    this.state.value = this.props.value;
  }

  componentWillReceiveProps(nextProps) {
    let options = nextProps.options;
    if (!this.state.value && options.length && nextProps.initChange) {
      this.state.value = options[0]['value'];
      this.setState({
        value: options[0]['value']
      });
      nextProps.onChange(options[0]['value']);
    }
  }

  onSelect() {
    this.state.value = this.refs.selectbox.value;
    this.setState({
      value: this.refs.selectbox.value
    }); 
    this.props.onChange(this.refs.selectbox.value);
  }

  renderSelectText()  {
    let value = this.state.value;
    let {options, placeholder} = this.props;

    if (!!!value && options.length) {
      if (placeholder) {
        return placeholder;
      }
      value = options[0].value; // 默认第一个
    };

    for (let option of options) {
      if (option.value == value) {
        return option.text;
      }
    }
  }

  onClick(){
    let clickEvent = this.props.onClick;
    if(clickEvent){
      clickEvent();
    }
  }

  render() {
    let options = this.props.options;
    let clickEvent = this.props.onClick;

    return (
      <div className="selectbox" onClick={this.onClick}>
        <div className="sbwrap">
          <span className={"cont " +  (this.state.value ? '': 'placeholder')}>
            {this.renderSelectText()}
            {!clickEvent &&  <select value={this.state.value } ref="selectbox" onChange={this.onSelect}>
              {options.map( (option, index) => <option data-key={this.uniqueId() + '-' + option.value + '-option'} key={ this.uniqueId() + option.value + '-option'} value={option.value}>{option.text}</option> ) }
            </select>}
          </span>
        </div>
      </div>
    );
  }
};

SelectBox.defaultTypes = {
  onChange: () => {},
  options: [],
  placeholder: '',
  initChange: false,
};

SelectBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClick : PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string
};

export default SelectBox;