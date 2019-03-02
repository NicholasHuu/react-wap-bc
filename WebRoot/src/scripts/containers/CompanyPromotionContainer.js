import React , {Component , PropTypes}  from 'react';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../components/Back';
import Slider from '../components/Slider';

class CompanyPromotionContainer extends Component{

  render(){
    const {app, promotion} = this.props;

    return(
      <div className="page companyPromotion">
        <Header {...this.props}>
          <Back />
          <h3>公司入款优惠</h3>
        </Header>
        <div className="page-body">
          <Slider sliders={app.get('companyPromotionSlider')}/>
          <div className="companyPromotion-text">
              <div className="part">
                <h3>优惠方案</h3> 
                <p>新老会员通过（网银、ATM、手机银行转账、支付宝、微信转账或到柜台存入公司账户）进行游戏充值，即可享受充值金额0.6%的返利。银行卡入款的会员无需申请，系统将自动增加优惠返利到会员账户（次次存，次次送）无上限。</p>
              </div>
              <div className="part"> 
                <h3>活动规则</h3> 
                <p>新老会员通过（网银、ATM、手机银行转账、支付宝、微信转账或到柜台存入公司账户）进行游戏充值，即可享受充值金额0.6%的返利。银行卡入款的会员无需申请，系统将自动增加优惠返利到会员账户（次次存，次次送）无上限。</p>

              </div>
          </div>
        </div>
      </div>
    )
  }

}

function MapStateToProps(state){
  const {userModule , app} = state;
  return{
    userModule,
    app
  };
}


export default connect(MapStateToProps)(CompanyPromotionContainer);