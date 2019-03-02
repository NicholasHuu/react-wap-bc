// 综合过关入球
import React, {Component, PropTypes} from 'react';
import {buildQuery} from '../../../../utils/url';
import BasePatter from '../BasePattern';

class GuoguanPattern extends BasePatter {

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
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this ,'bk_p3', 'dy', 'dy', 'H', 'f') }>{event.iorMh}</a></span></td>
            <td>{event.iorPrh && <span>{event.strong == 'H' ? event.ratio:'' } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'bk_p3', 'rf', 'rf', 'H', 'f')}>{event.iorPrh}</a></span></span> }</td>
            <td>{event.iorPouc && <span> { event.ratioO != '' && <span>大</span>}{event.ratioO } <span className="red"><a onClick={this.handleGoOrderClick.bind(this, 'bk_p3','dx','dx','H','f')}>{event.iorPouc}</a></span></span>}</td>
            <td>
              {event.iorPouho && <span>{event.ratioPouho != '' && <span>大</span>}{event.ratioPouho} <span className="red"><a onClick={this.handleGoOrderClick.bind(this, 'bk_p3','jf','dx_big','H','f')}>{event.iorPouho }</a></span></span>} 
              &nbsp;{event.iorPouhu && <span>{event.ratioPouhu != '' && <span>小</span>}{event.ratioPouhu} <span className="red"><a onClick={this.handleGoOrderClick.bind(this, 'bk_p3','jf','dx_small','H','f')}>{event.iorPouhu }</a></span></span>}
            </td>
          </tr>
          <tr className="white-board">
            <td>客</td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this ,'bk_p3', 'dy', 'dy', 'C', 'f') }>{event.iorMc}</a></span></td>
            <td>{event.strong == 'C' ? event.ratio:'' } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'bk_p3', 'rf', 'rf', 'C', 'f')}>{event.iorPrc}</a></span></td>
            <td>{event.iorPouh && <span>{ event.ratioU != '' && <span>小</span>}{event.ratioU } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this, 'bk_p3','dx','dx','C','f')}>{event.iorPouh}</a></span></span>}</td>
            <td>
              {event.iorPouco && <span>{event.ratioPouco != '' && <span>大</span>}{event.ratioPouco} <span className="red"><a onClick={this.handleGoOrderClick.bind(this, 'bk_p3','jf','dx_big','C','f')}>{event.iorPouco }</a></span></span>} 
              &nbsp;{event.iorPoucu && <span>{event.ratioPoucu != '' && <span>小</span>}{event.ratioPoucu} <span className="red"><a onClick={this.handleGoOrderClick.bind(this, 'bk_p3','jf','dx_small','C','f')}>{event.iorPoucu }</a></span></span>}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
};

export default GuoguanPattern;