import React, {Component, PropTypes} from 'react';

import ZXS from './ZXS';

class ZXL extends ZXS {
  getRenderNums() {
    let nums = [];
    const {subpankou, peiyu} = this.props;
    let code = `ZXL-${subpankou.xzlxCode}`;
    return peiyu.filter( (item) => {
      if (item.id.indexOf(code) == 0 ) {
        return true;
      }
    });
  }
};

ZXL.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

ZXL.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default ZXL;