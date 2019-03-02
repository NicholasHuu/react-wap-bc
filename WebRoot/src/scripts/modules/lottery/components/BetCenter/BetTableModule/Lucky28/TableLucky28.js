import React,{Component , PropTypes} from "react";
import {connect} from "react-redux";

import {parseQuery, buildQuery} from '../../../../../../utils/url';
import TM from './TM';


import {withRouter} from 'react-router';

class TableLucky28 extends Component{
    
  renderTM() {
    return <TM {...this.props} />
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

TableLucky28.propTypes = {
  pankou: PropTypes.object,
  peiyu: PropTypes.array
};

export default withRouter(TableLucky28);