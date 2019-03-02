// 综合过关入球
import React, {Component, PropTypes} from 'react';
import {buildQuery} from '../../../../utils/url';
import BasePattern from '../BasePattern';

class GuoguanPattern extends BasePattern {

  render() {
    const event = this.props.score;
    return (
      <table className="sport score-board">
        <thead>
          <tr className="pink-board">
            <th>场次</th>
            <th>独赢</th>
            <th>让球</th>
            <th>大小</th>
            <th>单双</th>
          </tr>
        </thead>
        <tbody>
          <tr className="white-board">
            <td rowSpan="3">
              <span>全场</span>
              <span>主</span>
              <span>客</span>
              <span>和</span>
              <i>空</i>
            </td>
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'p3', 'dy', 'dy', 'H', 'f')}>{event.iorMh}</a></span></td>
            <td>{event.strong == 'H' ? event.ratio:'' } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3', 'rq', 'rq', 'H', 'f')}>{event.iorPrh}</a></span></td>
            <td>{ event.iorPouc != '' && <span><span>大{event.ratioU }</span> <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'p3','dx','dx','H','f')}>{event.iorPouc}</a></span></span> } </td>
            <td>{event.iorPeoo != '' && <span>单</span>} <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','ds','ds','H','f')}>{event.iorPeoo }</a></span></td>
          </tr>
          <tr className="white-board">
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dy','dy','C','f')}>{event.iorMc }</a></span></td>
            <td><span>{event.strong == 'C' ? event.ratio : '' }</span> <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'p3','rq','rq','C','f')}>{event.iorPrc }</a></span></td>
            <td>{event.iorPouh != '' &&  <span>小{event.ratioO } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dx','dx','C','f')}>{event.iorPouh }</a></span></span> }</td>
            <td> {event.iorPeoe != '' && <span>双</span> } <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','ds','ds','C','f')}>{event.iorPeoe}</a></span></td>
          </tr>
          <tr className="white-board">
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dy','dy','N','f')}>{event.iorMn}</a></span></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr className="pink-board">
            <td rowSpan="3">
              <span>半场</span>
              <span>主</span>
              <span>客</span>
              <span>和</span>
              <i>空</i>
            </td>
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dy','dy','H','h')}>{event.iorHmh}</a></span></td>
            <td>{event.hstrong == 'H' ? event.hratio: ''} <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','rq','rq','H','h')}>{event.iorHprh}</a></span></td>
            <td><span>大{event.hratioU }</span> <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dx','dx','H','h')}>{event.iorHpouc}</a></span></td>
            <td></td>
          </tr>
          <tr className="pink-board">
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dy','dy','C','h')}>{event.iorHmc}</a></span></td>
            <td>{event.hstrong == 'C' ? event.hratio: ''} <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','rq','rq','C','h')}>{event.iorHprc}</a></span></td>
            <td>{event.iorHpouh && <span><span>小{event.hratioO }</span> <span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dx','dx','C','h')}>{event.iorHpouh}</a></span></span>}</td>
            <td></td>
          </tr>
          <tr className="pink-board">
            <td><span className="red"><a  onClick={this.handleGoOrderClick.bind(this,'p3','dy','dy','N','h')}>{event.iorHmn}</a></span></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  }
};

export default (GuoguanPattern);