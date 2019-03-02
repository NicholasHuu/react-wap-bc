import React, {Component, PropTypes} from 'react';

import EZDW from './EZDW';

class SZDW extends EZDW {

  constructor(props) {
    super(props);
    this.groups = {
      'SZDW-SZDW-SZDW': ['万', '仟', '佰', '拾', '个'], 
    };
  }
  
};

SZDW.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

SZDW.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default SZDW;