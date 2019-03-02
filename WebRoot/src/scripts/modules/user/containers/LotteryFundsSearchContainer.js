import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import {buildQuery, parseQuery} from '../../../utils/url';
import * as validate from '../utils/validate';
import {alert} from '../../../utils/popup';

import {loadAllLottery} from '../actions/UserOrder';

class LotteryFundsSearchContainer extends Component {
  
  constructor(props) {

    super(props);

    this.onSearch = this.onSearch.bind(this);
    
    this.state = {
      account: '',
      startTime: moment().format('YYYY-MM-DD'),
      finishTime: moment().format('YYYY-MM-DD'),
      flag: 0,
      lotteryCode: '',
      changeType: 0,
    };

    console.log(['state', this.state]);

  }

  onSearch() {
    const {history, location} = this.props;
    if (this.state.account.trim().length > 0 && !validate.name(this.state.account)) {
      alert('请输入4-16位数字/字母或组合的帐号');
      return ;
    }
    let query = parseQuery(location.search);
    query = Object.assign({}, query, this.state);
    history.push(`/user/lotteryfunds?` + buildQuery(query));
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadAllLottery());
  }

  render() {
    
    const {lotteryItems, fundTypes} = this.props;
    let newFundTypes = fundTypes.clone();
    newFundTypes.unshift({
      code: '',
      name: '所有类型',
    });
    let self = this;

    return (
      
      <div className="page page-lottery-funds-search">
        
        <Header {...this.props}>
          
          <Back />
          <h3>彩票帐变搜素</h3>

        </Header>

        <div className="page-body">
          
          <div className="account-search">
            <input type="text" onChange={ val  => this.setState({account: val.target.value}) } value={this.state.account} placeholder="输入下级账号" />
          </div>

          <div className="search-form-wrap">
            <div className="date-group">
              <input type="date" onChange={ val => this.setState( {startTime: val.target.value} )} value={ this.state.startTime } />
              <span>至</span>
              <input type="date" onChange={ val => this.setState( {finishTime: val.target.value} )} value={ this.state.finishTime } />
            </div>
            <div className="sublevel">
              <input type="checkbox" onChange={ val => this.setState( {flag: val.target.value == 'on' ? 1: 0} ) } id="sublevel"/>
              <label htmlFor="sublevel">包含下级</label>
            </div>
            <fieldset className="element-group">
              <legend>彩种</legend>
              <ul>
                {lotteryItems.map( (item, index) => {
                  return <li key={index} onClick={ () => self.setState({lotteryCode: item.lotteryCode}) } className={ ({true: 'per4'})[ (index + 1) % 3 == 0] + ' ' + ({true: 'active'})[self.state.lotteryCode == item.lotteryCode] }><span>{item.lotteryName}</span></li>;
                } )}
              </ul>
            </fieldset>
            <fieldset className="element-group">
              <legend>帐变类型</legend>
              <ul>

                {newFundTypes.map( (item, index) => {
                  return <li key={index} onClick={ () => self.setState({changeType: item.code}) } className={ ({true: 'per4'})[ (index + 1) % 3 == 0] + ' ' + ({true: 'active'})[self.state.changeType == item.code] }><span>{item.name}</span></li>;
                } )}
              </ul>
            </fieldset>
            <button onClick={this.onSearch} className="btn btn-orange">确认</button>
          </div>

        </div>

      </div>

    );

  }

};


function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    lotteryItems: userModule.order.get('lotteryItems'),
    fundTypes: userModule.order.get('fundTypes'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(LotteryFundsSearchContainer));