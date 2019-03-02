import React,{Component , PropTypes} from "react";
import {connect} from "react-redux";
import {withRouter} from 'react-router';

import TableHk6 from "../components/BetCenter/BetTableModule/Hk6/TableHk6";
import TableFc3d from '../components/BetCenter/BetTableModule/Fc3d/TableFc3d';
import TableLucky28 from '../components/BetCenter/BetTableModule/Lucky28/TableLucky28';
import TableBjpk10 from '../components/BetCenter/BetTableModule/Bjpk10/TableBjpk10';
import TableCqssc from '../components/BetCenter/BetTableModule/Cqssc/TableCqssc';
import Klsf from '../components/BetCenter/BetTableModule/Klsf/TableKlsf';

import LotteryTimer from '../components/LotteryTimer';


class TableContaner extends Component {

  handleFenpan() {
    // console.log('封盘了');
  }

  handleKaijiang() {
    // console.log('开奖了');
  }

  renderHK6Platform() {
    return <TableHk6 {...this.props} />
  }

  renderFC3DPlatform() {
    return <TableFc3d {...this.props} />
  }
  
  renderPL3Platform() {
    return <TableFc3d {...this.props} />
  }

  renderBJKL8Platform() {
    return <TableLucky28 {...this.props} />
  }

  renderBJPK10Platform() {
    return <TableBjpk10 {...this.props} />
  }

  renderCQSSCPlatform() {
    return <TableCqssc {...this.props} />
  }

  renderTJSSCPlatform() {
    return <TableCqssc {...this.props} />
  }

  renderXJSSCPlatform() {
    return <TableCqssc {...this.props} />
  }

  renderCAKENOPlatform() {
    return <TableLucky28 {...this.props} />
  }

  renderGDKLSFPlatform() {
    return <Klsf {...this.props} />
  }

  renderTJKLSFPlatform() {
    return <Klsf {...this.props} />
  }
  
  renderPlatformBetTable() {
    const {match} = this.props;
    let gameCode = match.params.gameCode;
   
    let renderMethod = 'render' + gameCode.toUpperCase() + 'Platform';
    
    if (typeof this[renderMethod] != 'undefined') {
      return this[renderMethod]();
    } else {
      return <p>对应的平台暂不支持</p>
    }
  }

  render() {
    return(
      <div className="table-group">
        <LotteryTimer 
          fpSecond={this.props.fenpanSecond} 
          kjSecond={this.props.kaijiangSecond} 
          qs={this.props.qs} 
          kaijiang={this.props.onKaijiangFinish} 
          fenpan={this.props.onFenpanFinish} />
        {this.renderPlatformBetTable()}
      </div>
    )
  }
}

TableContaner.propTypes = {
  pankou: PropTypes.object,
  peiyu: PropTypes.array,
  qs: PropTypes.string,
  fenpanSecond: PropTypes.number,
  kaijiangSecond: PropTypes.number,
  onKaijiangFinish: PropTypes.func,
  onFenpanFinish: PropTypes.func,
};

export default withRouter(TableContaner);