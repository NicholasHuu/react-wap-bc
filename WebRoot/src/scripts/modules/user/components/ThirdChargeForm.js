import React, {Component, PropTypes} from 'react';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import LoadingComponent from '../../../components/LoadingComponent';
import {format} from '../../../utils/datetime';
import {saveCompanyThirdPayment, saveCompanyBankPayment} from '../actions/Charge';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';
import StickLayout from '../../../components/StickLayout';

import FormNotice from '../../../components/FormNotice';

import {PAY_TYPE_WEIXIN, PAY_TYPE_ALIPAY, PAY_TYPE_CAIFUTONG} from '../constants/ChargeConstant';

import t from 'tcomb-form';

const Form = t.form.Form;
const schema = t.struct({
  count: t.String,
  paydate: t.String, 
  paytime: t.String, 
  account: t.String,
  nickname: t.String,
  remark: t.String
});

const focus = (event) => {
  let fieldGroup = event.currentTarget.parentNode;
  fieldGroup.className += ' focus';
}

const blur = (event) => {
  let fieldGroup = event.currentTarget.parentNode;
  fieldGroup.className = fieldGroup.className.replace('focus', '');
}

const options = {
  fields: {
    count: {
      label: '汇款金额:',
      type: 'text',
      attrs: {
        placeholder: '最低金额元',
      },
    },
    paydate: {
      label: '汇款日期:',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <DatePicker value={locals.value} onChange={locals.onChange} />
        }
      }),
      attrs: {
        
      },
    }, 
    paytime: {
      label: '汇款时间:',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <TimePicker value={locals.value} onChange={locals.onChange} />
        }
      }),
      attrs: {
        
      },
    },
    account: {
      label: <i>账<i style={ {    visibility: 'hidden'} }>付时</i>号:</i>,
      attrs: {
        placeholder: '请输入帐号',
      },
    },
    nickname: {
      label: <i>姓<i style={ {    visibility: 'hidden'} }>付时</i>名:</i>,
      attrs: {
        placeholder: '请输入姓名',
      },
    },
    remark: {
      label: <i>备<i style={ {    visibility: 'hidden'} }>付时</i>注:</i>,
      attrs: {
        placeholder: '请输入备注',
      },
    }
  }
};

class ThirdChargeForm extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.state = {
      value: {
        count: '',
        paydate: format(new Date(), 'Y-m-d'), 
        paytime: format(new Date(), 'HH') + ':' + format(new Date(), 'mm'), 
        account: '',
        nickname: '',
        remark:''
      }
    };

    this.payNameLabels = {
      [PAY_TYPE_WEIXIN]: '微信',
      [PAY_TYPE_ALIPAY]: '支付宝',
      [PAY_TYPE_CAIFUTONG]: '财付通',
    };

    this.payTypes = {
      [PAY_TYPE_WEIXIN]: '微信转账',
      [PAY_TYPE_ALIPAY]: '支付宝转账',
      [PAY_TYPE_CAIFUTONG]: '财付通转账',
    };

    this.noticeMessages = {
      [PAY_TYPE_WEIXIN]: 'compayWx',
      [PAY_TYPE_ALIPAY]: 'compayAlipay',
      [PAY_TYPE_CAIFUTONG]: 'compayTenpay',
    };

    this.onProcess = false;
  }

  componentWillReceiveProps(nextProps) {
    const {charge, match} = nextProps;
    let companyBankPayments = charge.get('companyBankPayments');
    let channel = this.channel = companyBankPayments.filter( item => item.payNo == match.params.channel)[0];
    let transfterTypeItems = charge.get('bankTransferTypeList');

    if (channel) {
      options.fields.count.attrs.placeholder = '最低金额'+channel.minEdu+'元';
    }

    this.closeLoading();
  }

  onFormSubmit() {
    if (this.onProcess) return ;
    const {dispatch ,history} = this.props;
    let channel = this.channel;
    let minEdu = channel.minEdu;

    let payName = this.payNameLabels[channel.payType];

    let values = this.state.value;
    if (values.count <= 0) {
      alert('请输入充值金额');
    } else if ( isNaN(values.count*1)) {
      alert('汇款金额输入不正确');
    } else if (values.count < minEdu) {
      alert(channel.minMaxDes);
    }else if (values.account.length <= 0 ) {
      alert('请输入账号');
    } else if (values.nickname.length <= 0) {
      alert('请输入姓名');
    } else {
      //money, payType, payNo, time, hkUserName,
      
      let _this = this;
      this.onProcess = true;

      this.openLoading();
      //money, time, payNo, hkName, hkType,
      dispatch(saveCompanyThirdPayment(
        values.count, 
        values.paydate + ' ' + values.paytime + ':00',
        channel.payNo, 
        values.nickname,
        values.remark,
        values.account,
        (data) => {
          _this.onProcess = false;
          _this.closeLoading();
          alert(data.msg, (popup) => {
            popup.close();
            if (data.errorCode == RES_OK_CODE) {
              history.goBack();
            }
          });
      }));
    }
  }

  onInputChange(value) {
    this.state.value = Object.assign(this.state.value, value);
  }

  render() {
  
    const {charge, match} = this.props;
    let thirdPayments = charge.get('companyBankPayments');
    let channel = thirdPayments.filter( item => item.payNo == match.params.channel )[0]
    if (!channel) {
      return null;
    }
    
    let payName = this.payNameLabels[channel.payType];
    let msgId = this.noticeMessages[channel.payType];
    //options.fields.account.label = payName + '账号';
    //options.fields.nickname.label = payName + '昵称';

    let bankInfo = <div className="company-info-desc">
      <div className="row">
        <span>{channel.bankType}</span>
        <span className="right">{channel.bankUser}</span>
      </div>
      <div className="row">
        <p>帐号: {channel.bankCard}</p>
      </div>
    </div>;

    return (
      <div className="charge-form company-charge-form form-type2">
        <div className="wrap">
          <div className="thirdpay-info company-info">
            <StickLayout image={ <img src={channel.bigPic} alt=""/> } content={bankInfo}></StickLayout>
          </div>
          <div className="inner company-charge-inner">
            <Form options={options} value={this.state.value} onChange={this.onInputChange} ref="form" type={schema}></Form>
            <FormNotice content={channel.remark}></FormNotice>
            <div className="btn-wrap">
              <button onClick={this.onFormSubmit} className="btn btn-submit btn-orange">提交表单</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ThirdChargeForm;