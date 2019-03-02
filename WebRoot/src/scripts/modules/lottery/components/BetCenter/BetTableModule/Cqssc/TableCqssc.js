import React,{Component , PropTypes} from "react";
import {connect} from "react-redux";

import {parseQuery, buildQuery} from '../../../../../../utils/url';
import DXDS  from './DXDS';
import SZP  from './SZP';
import YZDW  from './YZDW';
import EZDW  from './EZDW';
import SZDW  from './SZDW';
import YZZH  from './YZZH';
import EZZH  from './EZZH';
import EZHS  from './EZHS';
import ZXS  from './ZXS';
import ZXL  from './ZXL';
import KD  from './KD';
import LH  from './LH';

import {withRouter} from 'react-router';

class TablePl3 extends Component{
    
  renderDXDS() {
    return <DXDS {...this.props} />
  }
  renderSZP() {
    return <SZP {...this.props} />
  }
  renderYZDW() {
    return <YZDW {...this.props} />
  }
  renderEZDW() {
    return <EZDW {...this.props} />
  }
  renderSZDW() {
    return <SZDW {...this.props} />
  }
  renderYZZH() {
    return <YZZH {...this.props} />
  }
  renderEZZH() {
    return <EZZH {...this.props} />
  }
  renderEZHS() {
    return <EZHS {...this.props} />
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
  renderLH() {
    return <LH {...this.props} />
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

TablePl3.propTypes = {
  pankou: PropTypes.object,
  peiyu: PropTypes.array
};

export default withRouter(TablePl3);