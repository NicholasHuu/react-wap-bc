import React, {Component, PropTypes} from 'react';

import DXDS from './DXDS';

class KD extends DXDS {

  getPeiyuWithGroup() {
    const {peiyu, platformInfo, pankou} = this.props;
  
    if (!platformInfo.betInfo) {
      return []
    }

    let labelGroups = {
      KD: ['QSW', 'ZSW', 'HSW'],
    };
    let labelGroup = labelGroups[pankou.itemCode];
    let groups = [];
    for (let groupName of labelGroup) {
      let prefix = `KD-${groupName}-`;
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
};

KD.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

KD.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default KD;