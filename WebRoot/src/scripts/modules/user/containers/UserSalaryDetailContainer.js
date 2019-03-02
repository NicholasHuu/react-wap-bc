import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';

import {loadSelfSalary} from '../actions/UserOrder';
import PTR from '../../../utils/pulltorefresh';

class UserSalaryDetailContainer extends Component {
  
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadSelfSalary());
  }

  setupPullToRefresh(destroy = false) {
    const {dispatch} = this.props;

    PTR.destroyAll();
    if (destroy) {
      return ;
    }
    PTR({
      mainElement: '.page-body-inner',
      refreshHandler({close, handler}) {
        dispatch(loadSelfSalary(() => {
          close();
        }));
      }
    });
  }

  componentDidUpdate() {
    this.setupPullToRefresh();
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }
  
  render() {
    const {salary} = this.props;
    return (
      <div>
        { Object.keys(salary).length <= 0 && <p className="no-data">暂无数据</p> }

        {Object.keys(salary).length > 0 && 
          <div>
            <div className="salary-summary">
              <div className="inner">
                <div className="wrap">
                  <div className="left">
                    <span>日薪金额</span>
                    <span>{salary.salaryMoney}</span>
                  </div>
                  <div className="right">
                    <span>起始金额</span>
                    <span>{salary.startMoney}</span>
                  </div>
                </div>
              </div>
            </div>

            <ul>
              <li><label>发放模式</label><span>{salary.privodeFangshi}</span></li>
              <li><label>发放周期</label><span>{salary.privodezhouqi}</span></li>
              <li><label>投注人数</label><span>{salary.personCount}</span></li>
              <li><label>封顶金额</label><span>{salary.moneyCount}</span></li>
              <li><label>亏损要求</label><span>{salary.lossCount}</span></li>
              <li><label>开通时间</label><span>{salary.createTime}</span></li>
            </ul>
          </div>
        }
      </div>
    );
  }
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    salary: userModule.order.get('selfSalary'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(UserSalaryDetailContainer));