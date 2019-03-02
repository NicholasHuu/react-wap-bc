import React, {PropTypes, Component} from 'react';
import HKBall from '../../../OpenResultStyle/HKBall';

import Base from './Base';

class ZMT extends Base {
  // 
};


ZMT.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

ZMT.propTypes = {
  peiyu: PropTypes.array,
  selectedPeiyu: PropTypes.object,
  onPeiyuSelected: PropTypes.func
};

export default ZMT;