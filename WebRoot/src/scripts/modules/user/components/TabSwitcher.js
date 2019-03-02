import React, {Component, PropTypes} from 'react';

class TabSwitcher extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      crtTab: null
    };
  }

  onChange(tab) {
    this.setState({
      crtTab: tab
    });
    this.props.onChange(tab);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultTab != this.props.defaultTab) {
      this.state.crtTab = nextProps.defaultTab;
    }
  }

  crtTab() {
    const {tabs} = this.props;
    if (!this.state.crtTab) {
      return this.props.defaultTab || tabs[0][0];
    }
    return this.state.crtTab;
  }

  render() {
    const {tabs} = this.props;
    let self = this;

    return (
      <div className={" tab-switcher " + ({true: 'time-tab'})[this.props.timeTab]}>
        <div className="wrap">
          <ul>
            {
              tabs.map( (tab, index) => {
                return <li key={index} className={ ({true: 'active'})[self.crtTab() == tab[0]] }  onClick={this.onChange.bind(self, tab[0])}>
                  <div className="wrap">{tab[1]}</div>
                </li>
              } )
            }
          </ul>
        </div>
      </div>
    );
  }

}; 

TabSwitcher.propTypes = {
  tabs: PropTypes.array,
  onChange: PropTypes.func,
  timeTab: PropTypes.bool,
  defaultTab: PropTypes.string,
};

TabSwitcher.defaultProps = {
  tabs: [],
  onChange: () => {},
  timeTab: false,
  defaultTab: '',
};

export default TabSwitcher;