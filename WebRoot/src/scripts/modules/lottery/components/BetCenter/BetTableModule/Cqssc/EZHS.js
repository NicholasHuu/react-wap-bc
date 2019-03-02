import React, {Component, PropTypes} from 'react';

class EZHS extends Component {

  constructor(props) {
    super(props);
  }

  onPeiyuSelected(item) {
    this.props.onPeiyuSelected(item);
  }

  getPeiyuWithGroup() {
    const {subpankou, peiyu, platformInfo} = this.props;
  
    if (!platformInfo.betInfo) {
      return []
    }

    let labelGroups = {
      WQ: ['EZHS-WQ'],
      WB: ['EZHS-WB'],
      WS: ['EZHS-WS'],
      WG: ['EZHS-WG'],
      QB: ['EZHS-QB'],
      QS: ['EZHS-QS'],
      QG: ['EZHS-QG'],
      BS: ['EZHS-BS'],
      BG: ['EZHS-BG'],
      SG: ['EZHS-SG'],
    };
    let groups = [];
    for (let groupName in labelGroups) {
      let labelsOfGroupName = labelGroups[groupName];
      for (let peiyuId of labelsOfGroupName) {
        let prefix = `${peiyuId}-`;
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
    }

    return groups;
  }

  render() {
    const {peiyu, selectedPeiyu} = this.props;
    if (peiyu.length <= 0) {
      return <p>加载中</p>;
    }
    let id = 1;
    return (
      <div className="table4-column">
        <div className="table4-body">
          <div className="pure-g">
          {this.getPeiyuWithGroup().map( group => {
            return <div className="pure-u-1-2" key={group.name}>

              <div className="pure-u-1-1"><div className="ui-item-son">{group.name}</div></div>
              {group.items.map(item => {
                return <div className="pure-u-1-1" key={id ++}>
                  <div className="pure-u-1-2"><div className="ui-item-son">{item.number}</div></div>
                  <div className="pure-u-1-2">
                    <div onClick={this.onPeiyuSelected.bind(this, item)} className="ui-item-son"> <span className={"peiyu " + (!selectedPeiyu[item.id] ? '': 'selected') }>{item.pl}</span></div>
                  </div>
                </div>
              })}
              
            </div>
          })}
          </div>
        </div>
      </div>
    );
  }
};

EZHS.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

EZHS.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default EZHS;