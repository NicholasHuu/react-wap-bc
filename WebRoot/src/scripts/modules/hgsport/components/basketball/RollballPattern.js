// 独赢 & 让球 & 大小 & 单 / 双 玩法
import React, {Component, PropTypes} from 'react';
import {buildQuery} from '../../../../utils/url';
import BasePattern from '../BasePattern';

class RollballParttern extends BasePattern {

  render() {
    const event = this.props.score;
    return (
      <table className="sport score-board">
        <thead>
          <tr className="pink-board">
            <th>全场</th>
            <th>独赢</th>
            <th>让分</th>
            <th>大小</th>
            <th>球队得分：大/小</th>
          </tr>
        </thead>
        <tbody>
          <tr className="white-board">
            <td>主</td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'re_main', 'dy', 'dy', 'H', 'f')}>{event.iorMh}</a></span></td>
            <td>{event.strong == 'H' ? event.ratio:'' } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'re_main', 'rf', 'rf', 'H', 'f')}>{event.iorRh}</a></span></td>
            <td>{event.iorOuc && <span><span>大{event.ratioU }</span> <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'re_main','dx','dx','H','f')}>{event.iorOuc}</a></span></span>}</td>
            <td> 
              {event.ratioOuho != '' && <span>大{event.ratioOuho } <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'re_main', 'jf', 'dx_big', 'H', 'f')}>{event.iorOuho}</a></span> </span> }
              &nbsp;{event.ratioOuhu != '' && <span>小{event.ratioOuhu } <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'re_main', 'jf', 'dx_small', 'H', 'f')}>{event.iorOuhu}</a></span></span> }
            </td>
          </tr>
          <tr className="white-board">
            <td>客</td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'re_main', 'dy', 'dy', 'C', 'f')}>{event.iorMc}</a></span></td>
            <td><span>{event.strong == 'C' ? event.ratio :'' } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'re_main', 'rf', 'rf', 'C', 'f')}>{event.iorRc}</a></span></span></td>
            <td><span>小{event.ratioO }</span> <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'re_main','dx','dx','C','f')}>{event.iorOuh}</a></span></td>
            <td>
              {event.ratioOuco != '' && <span>大{event.ratioOuco } <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'re_main', 'jf', 'dx_big', 'C', 'f')}>{event.iorOuco}</a></span></span> }
              &nbsp;{event.ratioOucu != '' && <span>小{event.ratioOucu } <span className="red"><a className="red" onClick={this.handleGoOrderClick.bind(this,'re_main', 'jf', 'dx_small', 'C', 'f')}>{event.iorOucu}</a></span></span> }
            </td>
          </tr> 
        </tbody>
      </table>
    );
  }
}

export default (RollballParttern);