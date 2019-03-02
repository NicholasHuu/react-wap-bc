// 半波胆
import React, {Component, PropTypes} from 'react';
import {buildQuery} from '../../../../utils/url';
import BasePattern from '../BasePattern';

class HBodanPattern extends BasePattern {

  render() {
    const event = this.props.score;
    return (
      <table className="sport score-board">
        <thead>
          <tr className="pink-board">
            <th>半场</th>
            <th>比分</th>
            <th>{event.teamH }</th>
            <th>{event.teamC}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="pink-board">
            <td rowSpan="11"></td>
            <td>1:0</td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '1_0', 'H', 'h')}>{event.iorH1c0}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '0_1', 'C', 'h')}>{event.iorH0c1}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>2:0</span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '2_0', 'H', 'h')}>{event.iorH2c0}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '0_2', 'C', 'h')}>{event.iorH0c2}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>2:1</span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '2_1', 'H', 'h')}>{event.iorH2c1}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '1_2', 'C', 'h')}>{event.iorH1c2}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:0</span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '3_0', 'H', 'h')}>{event.iorH3c0}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '0_3', 'C', 'h')}>{event.iorH0c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:1</span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '3_1', 'H', 'h')}>{event.iorH3c1}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '1_3', 'C', 'h')}>{event.iorH1c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:2</span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '3_2', 'H', 'h')}>{event.iorH3c2}</a></span></td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '2_3', 'C', 'h')}>{event.iorH2c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>0:0</span></td>
            <td colSpan="2"><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '0_0', 'H', 'h')}>{event.iorH0c0}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>1:1</span></td>
            <td colSpan="2"><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '1_1', 'H', 'h')}>{event.iorH1c1}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>2:2</span></td>
            <td colSpan="2"><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '2_2', 'H', 'h')}>{event.iorH2c2}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>3:3</span></td>
            <td colSpan="2"><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', '3_3', 'H', 'h')}>{event.iorH3c3}</a></span></td>
          </tr>
          <tr className="pink-board">
            <td><span>其他</span></td>
            <td colSpan="2"><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'hpd', 'hpd', 'other', 'H', 'h')}>{event.iorOvh}</a></span></td>
          </tr>
        </tbody>
      </table>
    );
  }
};

export default HBodanPattern;