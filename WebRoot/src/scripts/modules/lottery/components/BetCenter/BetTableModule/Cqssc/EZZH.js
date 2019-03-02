import React, {Component, PropTypes} from 'react';

import EZDW from './EZDW';

class EZZH extends EZDW {

  constructor(props) {
    super(props);
    this.groups = {
      'EZZH-EZZH-EZZH': ['万', '仟', '佰', '拾', '个'], 
    };
  }
  
};

EZZH.defaultProps = {
  peiyu: [],
  onPeiyuSelected: () => {},
  selectedPeiyu: {},
};

EZZH.propTypes = {
  peipy: PropTypes.array,
  onPeiyuSelected: PropTypes.func,
  selectedPeiyu: PropTypes.object
};

export default EZZH;