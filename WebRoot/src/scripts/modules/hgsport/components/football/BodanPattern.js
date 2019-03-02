// 半波胆
import React, {Component, PropTypes} from 'react';
import {buildQuery} from '../../../../utils/url';
import BasePattern from '../BasePattern';

class BodanPattern extends BasePattern {

  render() {
    const event = this.props.score;
    return (
      <table className="sport score-board">
        <thead>
          <tr className="pink-board">
            <th>全场</th>
            <th>比分</th>
            <th>{event.teamH }</th>
            <th>{event.teamC}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="pink-board">
            <td rowSpan="16"></td>
            <td>1:0</td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '1_0', 'H', 'f')}>{event.iorH1c0}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '0_1', 'C', 'f')}>{event.iorH0c1}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>2:0</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '2_0', 'H', 'f')}>{event.iorH2c0}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '0_2', 'C', 'f')}>{event.iorH0c2}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>2:1</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '2_1', 'H', 'f')}>{event.iorH2c1}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '1_2', 'C', 'f')}>{event.iorH1c2}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:0</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '3_0', 'H', 'f')}>{event.iorH3c0}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '0_3', 'C', 'f')}>{event.iorH0c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:1</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '3_1', 'H', 'f')}>{event.iorH3c1}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '1_3', 'C', 'f')}>{event.iorH1c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:2</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '3_2', 'H', 'f')}>{event.iorH3c2}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '2_3', 'C', 'f')}>{event.iorH2c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>4:0</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '4_0', 'H', 'f')}>{event.iorH4c0}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '0_4', 'C', 'f')}>{event.iorH0c4}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>4:1</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '4_1', 'H', 'f')}>{event.iorH4c1}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '1_4', 'C', 'f')}>{event.iorH1c4}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>4:2</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '4_2', 'H', 'f')}>{event.iorH4c2}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '2_4', 'C', 'f')}>{event.iorH2c4}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>4:3</span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '4_3', 'H', 'f')}>{event.iorH4c3}</a></span></td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '3_4', 'C', 'f')}>{event.iorH3c4}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>0:0</span></td>
            <td colSpan="2"><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '0_0', 'H', 'f')}>{event.iorH0c0}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>1:1</span></td>
            <td colSpan="2"><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '1_1', 'H', 'f')}>{event.iorH1c1}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>2:2</span></td>
            <td colSpan="2"><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '2_2', 'H', 'f')}>{event.iorH2c2}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:3</span></td>
            <td colSpan="2"><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '3_3', 'H', 'f')}>{event.iorH3c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>4:4</span></td>
            <td colSpan="2"><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', '4_4', 'H', 'f')}>{event.iorH4c4}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>其他</span></td>
            <td colSpan="2"><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'pd', 'pd', 'other', 'H', 'f')}>{event.iorOvh}</a></span></td>
          </tr>
        </tbody>
      </table>
    );
  }
};

export default (BodanPattern);