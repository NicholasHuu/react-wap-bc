import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

let isDescendant = (parent, child) => {
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

class FilterBar extends Component {

  constructor(props) {
    super(props);
    let options = this.props.options;
    let crtoption = Object.keys(options)[0];
    if (this.props.defaultValue) {
      crtoption = this.props.defaultValue;
    }
    this.state = {
      crtoption,
      viewfilters: false
    };
    this.onFilterToggle = this.onFilterToggle.bind(this);
    this.bodyClickHander = this.bodyClickHander.bind(this);
  }

  bodyClickHander(event) {
    let selfDom = ReactDOM.findDOMNode(this);
      // 如果点击不是发生在子节点
    if (!isDescendant(selfDom, event.target)) {
      this.setState({
        viewfilters: false
      });
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.bodyClickHander);
    document.body.addEventListener('touchstart', this.bodyClickHander);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.bodyClickHander);
    document.body.removeEventListener('touchstart', this.bodyClickHander);
  }

  getCrtOptionLabel() {
    let options = this.props.options;
    return options[this.state.crtoption];
  }
  
  onOptionItemClicked(key) {
    this.setState({
      crtoption: key
    });
    this._toggleFiltersView();
    
    const {onChange} = this.props;

    setTimeout(() => {
      onChange(key);
    });
  }

  renderFilterOption(options) {
    let html = [];
    for (let key in options) {
      let value = options[key];
      html.push(<div key={key} className="filter-item" onClick={this.onOptionItemClicked.bind(this, key)}>{value}</div>);
    }
    return html;
  }

  componentWillReceiveProps(nextProps) {
    let options = nextProps.options;
    let crtoption = nextProps.defaultValue;
    if (crtoption) {
      this.state.crtoption = crtoption;
    } else if (!this.state.crtoption) {
      this.state.crtoption = Object.keys(options)[0];
    }
  }

  onFilterToggle() {
    this._toggleFiltersView();
    this.props.onClick();
  }

  _toggleFiltersView() {
    this.setState({
      viewfilters: !this.state.viewfilters
    });
  }

  render() {
    const {options} = this.props;
    return (
      <div className={"filter-bar " + ( this.props.className ? this.props.className: "" ) } onClick={this.onFilterToggle}>
        <div className={"inner " + ( this.state.viewfilters ? 'viewme': '' ) }>
          <span>{this.getCrtOptionLabel()}</span>
          {this.state.viewfilters && <div className={"filters"}>
            {this.renderFilterOption(options)}
          </div>}
        </div>
      </div>
    );
  }
};

FilterBar.defaultProps = {
  onChange: () => {},
  onClick: () => {}
};

FilterBar.propTypes = {
  options: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func
};

export default FilterBar;

