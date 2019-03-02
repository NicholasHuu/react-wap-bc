import React , { Component , PropTypes } from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from  'react-router';


class RaceResultBasketball extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      view : {}
    }
  }

  onChangeView(index) {
    let view = this.state.view;
    view = Object.assign(view, {
      ['index_'+index]: !!!view['index_'+index]
    });
    this.setState({
      view
    });
  }

  render() {
    const state = this.state;
    let {items, groupIndex} = this.props;
    let view = !!state.view['index_'+groupIndex];

    return (
      <div className="ball-item">
        <div className="item">
          <div className="megagame" onClick={this.onChangeView.bind(this, groupIndex)}><p>{this.props.name}</p><i className={view ? "arrow-down" : ""}></i></div>
          {items.map( (item, index) => {
            return <table key={index} className={view ? "" : "hide"}>
              <tbody>
                <tr>
                  <td rowSpan="8" className="background-style-1">
                    <p dangerouslySetInnerHTML={ {__html: item.matchRealTime} }></p>
                  </td>
                  <td colSpan="3">
                    <span>{item.teamH}</span> VS <span>{item.teamC}</span>
                  </td>
                </tr>
                <tr>
                  <td>第1节</td>
                  <td>{item.stageH1}</td>
                  <td>{item.stageC1}</td>
                </tr>
                <tr>
                  <td className="color-sty-red">第2节</td>
                  <td>{item.stageH2}</td>
                  <td>{item.stageC2}</td>
                </tr>
                <tr>
                  <td className="color-sty-red">第3节</td>
                  <td>{item.stageH3}</td>
                  <td>{item.stageC3}</td>
                </tr>
                <tr>
                  <td>第4节</td>
                  <td>{item.stageH4}</td>
                  <td>{item.stageC4}</td>
                </tr>
                <tr>
                  <td className="color-sty-red">上半场</td>
                  <td>{item.stageHS}</td>
                  <td>{item.stageCS}</td>
                </tr>
                <tr>
                  <td className="color-sty-red">下半场</td>
                  <td>{item.stageHX}</td>
                  <td>{item.stageCX}</td>
                </tr>
                <tr>
                  <td className="red">全场</td>
                  <td className="red">{item.stageHF}</td>
                  <td className="red">{item.stageCF}</td>
                </tr>
              </tbody>
            </table>
          })}
        </div>
      </div>
    );
  }
}

RaceResultBasketball.defaultProps = {
  items: []
};

RaceResultBasketball.propTypes = {
  name: PropTypes.string,
  items: PropTypes.array
};

export default RaceResultBasketball;