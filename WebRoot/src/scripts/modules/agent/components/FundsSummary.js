import React, {Component, PropTypes} from 'react';

class FundsSummary extends Component {

  render() {
    const {summary} = this.props;
    return (
      <div className="funds-summary">
        <table>
          <thead>
            <tr>
              <th>存款手续费</th>
              <th>取款手续费</th>
              <th>行政手续费</th>
              <th>佣金</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{summary.costSave}</td>
              <td>{summary.costDraw}</td>
              <td>{summary.costXz}</td>
              <td>{summary.costYongjin}</td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>返水总量</th>
              <th>入款总量</th>
              <th>出款总量</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{summary.costFanshui}</td>
              <td>{summary.totalIn}</td>
              <td>{summary.totalOut}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

};

FundsSummary.propTypes = {
  summary: PropTypes.object
};

FundsSummary.defaultProps = {
  summary: {}
};

export default FundsSummary;
