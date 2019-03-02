import React,{Component , PropTypes} from "react";
import {connect} from "react-redux";

import {parseQuery, buildQuery} from '../../../../../../utils/url';
import DW from './DW';
import ZH from './ZH';
import HS from './HS';
import ZXS from './ZXS';
import ZXL from './ZXL';
import KD from './KD';

import {withRouter} from 'react-router';

class TableFc3d extends Component{
    
  renderDW() {
    return <DW {...this.props} />
  }
  renderZH() {
    return <ZH {...this.props} />
  }
  renderHS() {
    return <HS {...this.props} />
  }
  renderZXS() {
    return <ZXS {...this.props} />
  }
  renderZXL() {
    return <ZXL {...this.props} />
  }
  renderKD() {
    return <KD {...this.props} />
  }
  render() {
    let {pankou} = this.props;
    if (pankou && pankou.itemCode) {
      pankou = pankou.itemCode.toUpperCase();
      let renderMethod = `render${pankou}`;
      if (this[renderMethod]) {
        return this[renderMethod]();  
      }
    }
    return <p></p>;
  }
}

TableFc3d.propTypes = {
  pankou: PropTypes.object,
  peiyu: PropTypes.array
};

export default withRouter(TableFc3d);