import React, {Component, PropTypes} from 'react';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import SelectBox from '../../../components/SelectBox';
import {format} from '../../../utils/datetime';

import {saveCompanyBankPayment, saveWebsiteChargePayment} from '../actions/Charge';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import FormNotice from '../../../components/FormNotice';
import StickLayout from '../../../components/StickLayout';

import {alert} from '../../../utils/popup';

import {PAY_TYPE_ALIPAY, 
  PAY_TYPE_WEIXIN, 
  PAY_TYPE_CAIFUTONG, 
  PAY_TYPE_BANK, 
  PAY_TYPE_WEBSITE} from '../constants/ChargeConstant';

import t from 'tcomb-form';

const Form = t.form.Form;

const focus = (event) => {
  let fieldGroup = event.currentTarget.parentNode;
  fieldGroup.className += ' focus';
}

const blur = (event) => {
  let fieldGroup = event.currentTarget.parentNode;
  fieldGroup.className = fieldGroup.className.replace('focus', '');
}

let options = {
  fields: {
    count: {
      label: '充值金额:',
      type: 'number',
      attrs: {
        placeholder: '最低金额元',
      }
    },
  }
};

let schema = t.struct({
  count: t.Number
});

class WebsiteChargeForm extends LoadingComponent {
  
  constructor(props) {
    super(props);
    let bankList = t.enums({});
    let payWay = t.enums({});

    this.state = {
      value: {
        count: '',
      }
    };

    this.onProcess = false;
    this.channel = null;

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onFormFieldChange = this.onFormFieldChange.bind(this);
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    
    this.closeLoading();
    const {charge, match} = nextProps;
    let companyBankPayments = charge.get('companyBankPayments');
    let channel = this.channel = companyBankPayments.filter( item => item.payNo == match.params.channel)[0];

    if (channel) {
      options.fields.count.attrs.placeholder = channel.minMaxDes;
    }
  }

  onSubmitHandler() {
    let _this = this;

    const {charge, match, history, dispatch} = this.props;
    let channel = this.channel;
    
    let values =this.state.value;

    let minEdu = channel.minEdu;
      
    if (values.count <= 0) {
      alert('请输入充值金额');
    } else if (isNaN(values.count*1)) {
      alert('充值金额输入不正确');
    } else if (values.count < minEdu) {
      alert(channel.minMaxDes);
    } else {
      if (this.onProcess) {
        return ;
      }
      this.onProcess = true;
      // money, payNo, payType,
      let _this = this;
      _this.openLoading();
      dispatch(saveWebsiteChargePayment(values.count, channel.payNo, channel.payType, (data) => {
        _this.closeLoading();
        alert(data.msg, (popup) => {
          popup.close();
          if (data.errorCode == RES_OK_CODE) {
            history.goBack();
          } else {
            //
          }
        });
        
      }));
    }
  }

  onFormFieldChange(values) {
    this.state.value = Object.assign(this.state.value, values);
  }

  render() {
    const {charge, match} = this.props;
    let channel = this.channel;

    if (!channel) {
      return null;
    }
    
    let bankInfo = <div className="company-info-desc">
      <div className="row">
        <span>{channel.bankType}</span>
      </div>
      <div className="row">
        <p>支付网址: {channel.payLink}</p>
        <a target="_blank" href={channel.payLink}>进入充值</a>
      </div>
    </div>;

    return (
      <div className="charge-form company-charge-form form-type2">
        <div className="wrap">
          <div className="website-info thirdpay-info company-info">
            <StickLayout image={ <img src={channel.bigPicUrl} alt=""/> } content={bankInfo}></StickLayout>
          </div>
          <div className="inner company-charge-inner">
            <Form ref="form" options={options} onChange={this.onFormFieldChange} value={this.state.value} type={schema}></Form>
            <FormNotice content={channel.remark}></FormNotice>
            <div className="btn-wrap">
              <button onClick={this.onSubmitHandler} className="btn btn-submit btn-orange">提交表单</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default WebsiteChargeForm;