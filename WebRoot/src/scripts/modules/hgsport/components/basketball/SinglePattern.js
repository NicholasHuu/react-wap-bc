// 单式 玩法
import React, {Component, PropTypes} from 'react';
import {buildQuery} from '../../../../utils/url';
import BasePattern from '../BasePattern';

class SingleParttern extends BasePattern {

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
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'dy', 'dy', 'H', 'f')}>{event.iorMh}</a></span></td>
            <td><span>{event.strong == 'H' ? event.ratio:'' }</span> <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'rf', 'rf', 'H', 'f')}>{event.iorRh}</a></span></td>
            <td>{event.iorOuc != '' && <span><span>{event.ratioO ? '大': ''}{event.ratioO } </span>&nbsp;<span className="red"><a className="red" onClick={this.handleGoOrderClick.bind(this,'bk_r_main','dx','dx','H','f')}>{event.iorOuc}</a></span></span>}</td>
            <td>
              {event.iorOuho != '' && <span>大{event.ratioOuho } <a className="red" onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'jf', 'dx_big', 'H', 'f')}>{event.iorOuho}</a></span> }
              &nbsp;{event.iorOuhu != '' && <span>小{event.ratioOuhu } <a className="red" onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'jf', 'dx_small', 'H', 'f')}>{event.iorOuhu}</a></span> }
            </td>
          </tr>
          <tr className="white-board">
            <td>客</td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'dy', 'dy', 'C', 'f')}>{event.iorMc}</a></span></td>
            <td><span>{event.strong == 'C' ? event.ratio:'' }</span> <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'rf', 'rf', 'C', 'f')}>{event.iorRc}</a></span></td>
            <td>{ event.iorOuh != '' && <span><span>{event.ratioU != '' ? '小': ''}{event.ratioU } </span>&nbsp;<span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'bk_r_main','dx','dx','C','f')}>{event.iorOuh}</a></span></span>  }</td>
            <td>
              {event.iorOuco != '' ? '大': ''}<span>{event.ratioOuco } <a className="red" onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'jf', 'dx_big', 'C', 'f')}>{event.iorOuco}</a></span>
              &nbsp;{event.iorOucu != '' ? '小': ''}<span>{event.ratioOucu } <a className="red" onClick={this.handleGoOrderClick.bind(this,'bk_r_main', 'jf', 'dx_small', 'C', 'f')}>{event.iorOucu}</a></span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default (SingleParttern);