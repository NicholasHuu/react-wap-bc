// 半场 & 全场 
import React, {Component, PropTypes} from 'react';
import {buildQuery} from '../../../../utils/url';
import BasePattern from '../BasePattern';

class HalfAllPattern extends BasePattern {

  render() {
    const event = this.props.score;
    //rType, bType, dType, selection, period
    return (
      <table className="sport score-board">
        <thead>
          <tr className="pink-board">
            <th>主 / 主</th>
            <th>主 / 和</th>
            <th>主 / 客</th>
          </tr>
        </thead>
        <tbody> 
          <tr className="pink-board">
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'H_H', 'H_H', 'f')}>{event.iorFhh}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'H_N', 'H_N', 'f')}>{event.iorFhn}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'H_C', 'H_C', 'f')}>{event.iorFhc}</a></span></td>
          </tr>
          <tr className="white-board">
            <td>和 / 主</td>
            <td>和 / 和</td>
            <td>和 / 客</td>
          </tr>
          <tr className="pink-board">
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'N_H', 'N_H', 'f')}>{event.iorFnh}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'N_N', 'N_N', 'f')}>{event.iorFnn}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'N_C', 'N_C', 'f')}>{event.iorFnc}</a></span></td>
          </tr>
          <tr className="white-board">
            <td>客 / 主</td>
            <td>客 / 和</td>
            <td>客 / 客</td>
          </tr>
          <tr className="pink-board">
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'C_H', 'C_H', 'f')}>{event.iorFch}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'C_N', 'C_N', 'f')}>{event.iorFcn}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'f', 'f', 'C_C', 'C_C', 'f')}>{event.iorFcc}</a></span></td>
          </tr>
        </tbody>
      </table>
    )
  }
}; 

export default (HalfAllPattern);