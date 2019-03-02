import React,{Component , PropTypes} from "react";
import {connect} from "react-redux";

import HKBall from "../../../OpenResultStyle/HKBall";
import {parseQuery, buildQuery} from '../../../../../../utils/url';
import TM from './TM';
import ZMT from './ZMT';
import ZM from './ZM';
import ZM1T6 from './ZM1T6';
import GG from './GG';
import LM from './LM';
import BB from './BB';
import YXYZTW from './YXYZTW';
import TXTW from './TXTW';
import ZYBZ from './ZYBZ';
import WSL from './WSL';
import LX from './LX';
import HX from './HX';
import {withRouter} from 'react-router';

class TableHK6 extends Component{
  
  renderTM() {
    return <TM {...this.props}/>
  }
  renderZMT() {
    return <ZMT {...this.props} />
  }
  renderZM() {
    return <ZM {...this.props} />
  }
  renderZM1T6() {
    return <ZM1T6 {...this.props} />
  }
  renderGG() {
    return <GG {...this.props} />
  }
  renderLM() {
    return <LM {...this.props} />
  }
  renderBB() {
    return <BB {...this.props} />
  }
  renderYXYZTW() {
    return <YXYZTW {...this.props} />
  }
  renderTXTW() {
    return <TXTW {...this.props} />
  }
  renderZYBZ() {
    return <ZYBZ {...this.props} />
  }
  renderWSL() {
    return <WSL {...this.props} />
  }
  renderLX() {
    return <LX {...this.props} />
  }
  renderHX() {
    return <HX {...this.props} />
  }
  render() {
    let {pankou, subpankou} = this.props;

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

TableHK6.propTypes = {
  pankou: PropTypes.object,
  subpankou: PropTypes.object,
  peiyu: PropTypes.array
};

export default withRouter(TableHK6);