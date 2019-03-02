import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {parseQuery} from '../../../utils/url';

import {loadChildSalary} from '../actions/UserOrder';
import ChildSalaryForm from '../components/ChildSalaryForm';
import LoadingComponent from '../../../components/LoadingComponent';

class ChildSalaryFormContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.state = {
      item: null
    };

    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    const {match, dispatch, history, teamAgent, teamAccount} = this.props;
    let id = match.params.id;
    let item = teamAgent.items.filter(item => item.id == id);
    if (item.length <= 0 ) {
      item = teamAccount.items.filter(item => item.id == id);
    }
    item = item[0];
    if (!item) {
      return history.goBack();
    }
    this.setState({
      item,
    });

    dispatch(loadChildSalary({
      account: item.userName,
    }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.childSalaryItems.items.length > 0 || nextProps.childSalaryItems.items != this.props.childSalaryItems.items){
      this.closeLoading();
    }
  }

  onFinish(){
    const {history, location} = this.props;
    let back = parseQuery(location.search).from;
    if (!back) {
      back = '/user/salary/child';
    }
    history.replace(back);
  }

  render() {
    
    const {item} = this.state;
    const {childSalaryItems} = this.props;
    // 用户没有日薪情况下 增加日薪
    let items = childSalaryItems.items;
    if (items.length <= 0) {
      if (item) {
        items = [{
          userName: item.userName,
        }]; 
      } else {
        return null;
      }
    }

    if (!item) return null;

    return (
      <div className="page page-child-salary-form page-user-salary">
        <Header {...this.props}>
          <Back />
          <h3>日薪调配</h3>
        </Header>
        
        <div className="page-body">
          
          <ChildSalaryForm onFinish={this.onFinish} item={items[0]} {...this.props}></ChildSalaryForm>
      
        </div>

      </div>
    );
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    teamAgent: userModule.order.get('teamMemberOfAgent'),
    teamAccount: userModule.order.get('teamMemberOfAccount'),
    childSalaryItems: userModule.order.get('childSalaryItems'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(ChildSalaryFormContainer));