import React,{Component , PropTypes} from "react";
import {connect} from "react-redux";

import {parseQuery, buildQuery} from '../../../../../../utils/url';
import {withRouter} from 'react-router';
import D1Q  from './D1Q';
import D2Q  from './D2Q';
import D3Q  from './D3Q';
import D4Q  from './D4Q';
import D5Q  from './D5Q';
import D6Q  from './D6Q';
import D7Q  from './D7Q';
import D8Q  from './D8Q';
import ZHLH  from './ZHLH';
import LM  from './LM';

class TableKlsf extends Component{
  renderD1Q() {
    return <D1Q {...this.props} />
  }
  renderD2Q() {
    return <D2Q {...this.props} />
  }
  renderD3Q() {
    return <D3Q {...this.props} />
  }
  renderD4Q() {
    return <D4Q {...this.props} />
  }
  renderD5Q() {
    return <D5Q {...this.props} />
  }
  renderD6Q() {
    return <D6Q {...this.props} />
  }
  renderD7Q() {
    return <D7Q {...this.props} />
  }
  renderD8Q() {
    return <D8Q {...this.props} />
  }
  renderZHLH() {
    return <ZHLH {...this.props} />
  }
  renderLM() {
    return <LM {...this.props} />
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

TableKlsf.propTypes = {
  pankou: PropTypes.object,
  peiyu: PropTypes.array
};

export default withRouter(TableKlsf);