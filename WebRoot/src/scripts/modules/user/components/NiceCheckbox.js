import React, {Component, PropTypes} from 'react';


class NiceCheckbox extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      checked: {

      },
    };

    // 工具方法 - 生成唯一id
    this.unique =  ( () => {
      let nums = [];
      let rand = () => {
        return Math.floor(Math.random() * 10);
      };
      for (let i = 0; i < 5; i++) {
        nums.push(rand());
      }
      
      return nums.join('');

    } )();

    this.onSelect = this.onSelect.bind(this);

    // 设置默认值
    this.setDefaultChecked(props);

  }

  setDefaultChecked(props) {
    let options = props.options;
    options.map( (option, index) => {
      let key = `${option.value}-${this.unique}-${index}`;
      if (typeof this.state.checked[key] == 'undefined') {
        //console.log([typeof props.value, props.value, option.value === props.value, option.value , typeof props.value != 'object']);
        if (typeof props.value != 'object' && option.value === props.value ) {
          this.state.checked[key] = option.value;
        } else {
          for (let v of props.value) {
            if (option.value === v) {
              this.state.checked[key] = option.value;
            }
          }
        }
      }
    } );

  }

  componentWillMount() {
    this.state.value = this.props.value;
  }

  componentWillReceiveProps(nextProps) {
    let options = nextProps.options;
    if (!this.state.value && options.length && nextProps.initChange) {
      // this.state.value = options[0]['value'];
      // this.setState({
      //   value: options[0]['value']
      // });
      // nextProps.onChange(options[0]['value']);
    }

    // 设置默认值
    this.setDefaultChecked(nextProps);

    // TODO:: 实现多选
    if (this.props.multile) {
      let newvalue = nextProps.value;
    } else {
      
      // 重置选择
      let newvalue = nextProps.value;
      console.log(['newvalue', newvalue, this.state.value]);
      if (this.state.value != newvalue && ( newvalue === '' || !newvalue ) ) {
        this.setState({
          checked: {},
          value: '',
        });
      }
    }

    // 设置默认值

  }

  onSelect(el) {
    let id = el.target.id,
      value = el.target.value;

    let checked = this.state.checked;
    if (this.props.multile) {
      
      checked[id] = ({true: value, false: ''})[el.target.checked];
      
      let values = [];
      for (let id in checked) {
        if (checked[id]) {
          values.push(checked[id]);
        }
      }
      this.setState({
        checked,
        value,
      });

    } else {
      checked = {
        [id]: ({true: value, false: ''})[el.target.checked]
      };
      
      this.setState({
        checked,
        value
      });
      this.props.onChange(value);

    }
  }

  render() {
    let options = this.props.options;
    let self = this;
    //console.log(['checked', self.state.checked]);

    return (
      <div className="nick-checkbox-wrap">
        {
          options.map( (option, index) => {
            let key = `${option.value}-${this.unique}-${index}`;
            return (
              <label htmlFor={key} key={key} className={ ({true: 'selected'})[ self.state.checked[key] === option.value]  }>
                {option.text}
                {this.props.multile && <input onChange={self.onSelect} type="checkbox" id={key} value={option.value} name={self.props.name} />}
                {!this.props.multile && <input onChange={self.onSelect} type="radio" checked={ ({true: "checked", false: ""})[self.state.checked[key] === option.value] } id={key} value={option.value} name={self.props.name} />}
              </label>
            );
          })
        }
      </div>
    );
  }
};

NiceCheckbox.defaultProps = {
  onChange: () => {},
  options: [],
  placeholder: '',
  initChange: false,
  multile: false,
  value: '',
};

NiceCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClick : PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  multile: PropTypes.bool,
  value: PropTypes.oneOfType(PropTypes.string, PropTypes.array),
};

export default NiceCheckbox;