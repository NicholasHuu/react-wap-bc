import React, {Component, PropTypes} from 'react';

class PankouSwitcher extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      activePankou: null,
      activeGroup: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.activePankou = nextProps.activePankou;
    this.state.activeGroup = nextProps.activeGroup;
  }

  onGroupClick(pankou, group) {
    this.setState({
      activePankou: pankou.titleCode,
      activeGroup: group.gameCode
    });

    this.props.onClick(pankou.titleCode, group.gameCode);
  }

  onPankouClick(pankou) {
    // 盘口变化后 选择第一个group作为默认玩法
    const {pankous} = this.props;
    //let pankou = pankous.filter( p => p.titleCode == pankou)
    this.setState({
      activePankou: pankou.titleCode,
      //activeGroup: pankou.list[0].gameCode,
    });

  }

  render() {
    let self = this;
    let {pankous} = this.props;
    let {activePankou, activeGroup} = this.state;
    if (!activeGroup || !activeGroup) {
      activeGroup = this.props.activeGroup;
      activePankou = this.props.activePankou;
    }
    return (
      <div className="pankou-switcher-wrap">
        <div className="clearfix">
          <div className="left ps-navs">
            <ul className="clearfix">
              {pankous.map( (pankou, index) => {
                return <li className={ activePankou == pankou.titleCode ? 'active': '' } key={`nav-${index}`} onClick={self.onPankouClick.bind(self, pankou)}>{pankou['title']}</li>
              })}
            </ul>
          </div>
          <div className="right groups">
            {pankous.map( (pankou, index) => {
              if (pankou.titleCode == activePankou) {
                return <div key={`group-${index}`} className="group-items">
                  <ul className="clearfix">
                    {pankou['list'].map( (group, index2) => {
                      return <li className={ "pankou-item " + ( activeGroup == group.gameCode ? 'active': '' ) } key={`group-nav-${index2}`} onClick={self.onGroupClick.bind(self, pankou, group)}>{group['gameName']}</li>
                    })}
                  </ul>
                </div>
              }
            })}
          </div>
        </div>
      </div>
    );
  }

};

PankouSwitcher.propTypes = {
  pankous: PropTypes.array,
  onClick: PropTypes.func,
  activePankou: PropTypes.string,
  activeGroup: PropTypes.string
};

PankouSwitcher.defaultProps = {
  pankous: [],
  onClick: () => {},
  activePankou: '',
  activeGroup: '',
};

export default PankouSwitcher;

