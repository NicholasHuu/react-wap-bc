import React, {Component, PropTypes} from 'react';

class SM extends Component {

  constructor(props) {
    super(props);
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }

  getPeiyuWithGroup() {
    const {peiyu, platformInfo, pankou} = this.props;
  
    if (!platformInfo.betInfo) {
      return []
    }

    let labelGroups = {
      SM: ['GJ', 'YJ', 'JJ', 'D4M', 'D5M', 'D6M', 'D7M', 'D8M', 'D9M', 'D10M'],
    };
    let labelGroup = labelGroups[pankou.itemCode];
    let groups = [];
    for (let groupName of labelGroup) {
      let prefix = `SM-${groupName}-`;
      let groupItems = [];
      for (let peiyuItem of peiyu) {
        if (peiyuItem.id.indexOf(prefix) != -1 ) {
          groupItems.push(peiyuItem);
        }
      }
      groups.push({
        name: platformInfo.betInfo.oddinfo[1][groupName],
        items: groupItems
      });
    }

    return groups;
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }

    return (
      <div className="table4-column">
        <div className="table4-body">
          {this.getPeiyuWithGroup().map( (group, index) => {
            return ( <div className="pure-g" key={group.name + '-' + index}>
              <div className="pure-u-1-1">
                <div className="ui-item-son">{group.name}</div>
              </div>
              {group.items.map( item => {
                return <div className="pure-u-1-2" key={item.id}>
                  <div className="pure-u-1-2">
                    <div className="ui-item-son">{item.number}</div>
                  </div>
                  <div className="pure-u-1-2">
                    <div onClick={this.onPeiyuSelected.bind(this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
                  </div>
                </div>
              })}
            </div>);
          })}
          
        </div>
      </div>
    );
  }
};

SM.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

SM.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default SM;