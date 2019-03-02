import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../../../components/Back';


class OrderContentDetailContainer extends Component {
  constructor(props){
    super(props);
    this.flat = this.props.match.params.type;
  }

  componentWillMount(){
    const {dispatch} = this.props;
  }

  componentDidMount() {
    const {order} = this.props.userModule;
    const {history} = this.props;
    let orderItems = order.get('orderItems');
    if (orderItems.length <= 0) {
      history.goBack();
    }
  }

  render() {
    const {match} = this.props;
    const {order} = this.props.userModule;
    const {platform} = this.props.userModule;
    var platformList = platform.get('platformItems');
    
    var title = "";
    for(var i = 0;i < platformList.length;i++){
      if(this.flat == platformList[i]['flat']){
        title = platformList[i]['flatName'] + '游戏记录';
      }
    }

    let orderId = match.params.order;
    let orderItems = order.get('orderItems');
    console.log(['item', orderId, orderItems]);
    if (orderItems.length <= 0) return null;
    console.log(['这里']);
    let item = null
    for (item of orderItems) {
      if (item.betWagersId == orderId) {
        break;
      }
    }
    if (!item) return null;

    return (
    <div className="page order-detail-page">
      <div className="inner">
        <Header {...this.props}>
          <Back />
          <h3>{title}</h3>
        </Header>
        <div className="page-body">
          <div className="summary">
            <h2>{item.betContent}</h2>
            <p>下注时间: {item.betTime}</p>
            <p>订单号: {item.betWagersId}</p>
          </div>
          <div className="detail">
            <div className="wrap">
              <div className="left">
                <h3>投注金额</h3>
                <p>{item.betIn}</p>
              </div>
              <div className="left">
                <h3>返点金额</h3>
                <p>{item.backWaterMoney}</p>
              </div>
              <div className="right">
                <h3>投注结果</h3>
                <p className={ ({true: 'green', false: 'red'}[item.betUsrWin < 0 ]) }>{item.betUsrWin < 0 ? `+${item.betUsrWin}`: `-${item.betUsrWin}`} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  };
}

export default connect(mapStateToProps)(OrderContentDetailContainer);