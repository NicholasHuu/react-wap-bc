import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import ChildSalaryForm from '../components/ChildSalaryForm';

class ChildSalaryDetailContainer extends Component {
  
  constructor(props) {
    super(props);
    this.onBackClick = this.onBackClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.onUpdateFinish = this.onUpdateFinish.bind(this);

    this.state = {
      item: null,
      viewUpdateForm: false,
    };
  }

  componentDidMount() {
    const {salaryItems, match, history} = this.props;
    let item = salaryItems.items.filter(item => item.id == match.params.id);
    if (item.length <= 0) {
      history.goBack();
    } else {
      item = item[0];
    }
    this.setState({
      item
    });
  }

  onBackClick() {
    if (this.state.viewUpdateForm) {
      this.setState({
        viewUpdateForm: false
      });
    } else {
      if (this.props.match.onBack) {
        this.props.match.onBack();
      } else {
        const {history} = this.props;
        history.goBack();
      }
    }
  }

  onUpdateFinish(updatedSalaryItem) {
    this.setState({
      viewUpdateForm: false
    });
    let item = this.state.item;
    for (let key in updatedSalaryItem) {
      item[key] = updatedSalaryItem[key];
    }
    this.props.onBack && this.props.onBack();
  }

  onUpdateClick() {
    this.setState({
      viewUpdateForm: true
    });
  }
  
  render() {
    if (!this.state.item) return null;
    return (
      <div className="page page-user-salary">
        <Header {...this.props}>
          <a onClick={this.onBackClick}/>
          
          <h3>{this.state.viewUpdateForm ? '日薪调配': '日薪管理'}</h3>

        </Header>
        
        <div className="page-body">

          <ul>
            <li className="summary">
              <label>用户名</label>
              <span className="color-orange">{this.state.item.userName}</span>
            </li>
            <li><label>日薪金额</label><span className="color-orange">{this.state.item.salaryMoney}</span></li>
            <li><label>起始金额</label><span className="color-orange">{this.state.item.startMoney}</span></li>
            <li><label>发放模式</label><span>{this.state.item.privodeFangshi}</span></li>
            <li><label>发放周期</label><span>{this.state.item.privodezhouqi}</span></li>
            <li><label>投注人数要求</label><span>{this.state.item.personCount}</span></li>
            <li><label>封顶金额</label><span>{this.state.item.moneyCount}</span></li>
            <li><label>亏损要求</label><span>{this.state.item.lossCount}</span></li>
            <li><label>开通时间</label><span>{this.state.item.createTime}</span></li>
          </ul>
        
          <ul>
            <button className="btn btn-orange" onClick={this.onUpdateClick}>修改日薪规则</button>
          </ul>
        
          {this.state.viewUpdateForm && <div className="salary-edit-form-wrap"> <ChildSalaryForm onFinish={this.onUpdateFinish} {...this.props} item={this.state.item}></ChildSalaryForm></div>}

        </div>

      </div>
    );
  }
  
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    salaryItems: userModule.order.get('childSalaryItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(ChildSalaryDetailContainer));