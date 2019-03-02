import React,{Component , PropTypes} from "react";
import {connect} from "react-redux";

import {parseQuery, buildQuery} from '../../../../../../utils/url';
import SM from './SM';
import GJ from './GJ';
import YJ from './YJ';
import JJ  from './JJ';
import D4M  from './D4M';
import D5M  from './D5M';
import D6M  from './D6M';
import D7M  from './D7M';
import D8M  from './D8M';
import D9M  from './D9M';
import D10M  from './D10M';
import GYJH  from './GYJH';


import {withRouter} from 'react-router';

class TableBjpk10 extends Component{
    
  renderSM() {
    return <SM {...this.props} />
  }
  renderGJ() {
    return <GJ {...this.props} />
  }
  renderYJ() {
    return <YJ {...this.props} />
  }
  renderJJ() {
    return <JJ {...this.props} />
  }
  renderD4M() {
    return <D4M {...this.props} />
  }
  renderD5M() {
    return <D5M {...this.props} />
  }
  renderD6M() {
    return <D6M {...this.props} />
  }
  renderD7M() {
    return <D7M {...this.props} />
  }
  renderD8M() {
    return <D8M {...this.props} />
  }
  renderD9M() {
    return <D9M {...this.props} />
  }
  renderD10M() {
    return <D10M {...this.props} />
  }
  renderGYJH() {
    return <GYJH {...this.props} />
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

TableBjpk10.propTypes = {
  pankou: PropTypes.object,
  peiyu: PropTypes.array
};

export default withRouter(TableBjpk10);