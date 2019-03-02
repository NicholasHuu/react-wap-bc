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
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r', 'dy', 'dy', 'H', 'f')}>{event.iorMh}</a></span></td>
            <td>{event.strong == 'H' ? event.ratio:'' } <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r', 'rq', 'rq', 'H', 'f')}>{event.iorRh}</a></span></td>
            <td>{ event.iorOuc != '' && <span><span>大{event.ratioU }</span> <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dx','dx','H','f')}>{event.iorOuc}</a></span></span> } </td>
            <td><span>{event.strOdd }</span> <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','ds','ds','H','f')}>{event.iorEoo }</a></span></td>
          </tr>
          <tr className="white-board">
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dy','dy','C','f')}>{event.iorMc }</a></span></td>
            <td><span>{event.strong == 'C' ? event.ratio : '' }</span> <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','rq','rq','C','f')}>{event.iorRc }</a></span></td>
            <td>{event.iorOuh != '' &&  <span>小{event.ratioO } <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dx','dx','C','f')}>{event.iorOuh }</a></span></span> }</td>
            <td><span>{event.strEven}</span> <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','ds','ds','C','f')}>{event.iorEoe}</a></span></td>
          </tr>
          <tr className="white-board">
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dy','dy','N','f')}>{event.iorMn}</a></span></td>
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
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dy','dy','H','h')}>{event.iorHmh}</a></span></td>
            <td>{event.hstrong == 'H' ? event.hratio: ''} <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','rq','rq','H','h')}>{event.iorHrh}</a></span></td>
            <td>{event.hratioO != '' &&  <span>大{event.hratioO } </span> }<span>{event.iorHouc == 'H' ? event.iorHouc: ''}</span><span className="red"> <a onClick={this.handleGoOrderClick.bind(this,'r','dx','dx','H','h')}>{event.iorHouc}</a></span></td>
            <td></td>
          </tr>
          <tr className="pink-board">
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dy','dy','C','h')}>{event.iorHmc}</a></span></td>
            <td>{event.hstrong == 'C' ? event.hratio: ''} <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','rq','rq','C','h')}>{event.iorHrc}</a></span></td>
            <td>{event.hratioU != '' &&  <span>小{event.hratioU }</span>}<span>{event.iorHouh == 'H' ? event.hratioO: ''}</span> <span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dx','dx','C','h')}>{event.iorHouh}</a></span></td>
            <td></td>
          </tr>
          <tr className="pink-board">
            <td><span className="red"><a onClick={this.handleGoOrderClick.bind(this,'r','dy','dy','N','h')}>{event.iorHmn}</a></span></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default (SingleParttern);