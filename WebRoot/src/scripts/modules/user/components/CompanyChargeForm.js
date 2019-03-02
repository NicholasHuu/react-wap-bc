import React, {Component, PropTypes} from 'react';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import SelectBox from '../../../components/SelectBox';
import {format} from '../../../utils/datetime';

import NiceCheckbox from './NiceCheckbox';

import {saveCompanyBankPayment} from '../actions/Charge';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import FormNotice from '../../../components/FormNotice';
import StickLayout from '../../../components/StickLayout';
import copy from 'copy-to-clipboard';
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
    payway: {
      label: '汇款方式:',
      template: t.form.Form.templates.select.clone({
        renderSelect(locals) {
          let options = locals.options.splice(1);
          return <NiceCheckbox placeholder={locals.attrs.placeholder} name={"payway"} value={locals.value} initChange={true} onChange={locals.onChange} options={options}  />
        }
      }),
      attrs: {
        placeholder: '选择汇款方式',
      }
    },
    name: {
      label: '汇款人姓名:'
    }
  }
};

class CompanyChargeForm extends Component {
  
  constructor(props) {
    super(props);
    let bankList = t.enums({});
    let payWay = t.enums({});

    this.state = {
      value: {
        count: '',
        paydate: format(new Date(), 'Y-m-d'), 
        paytime: format(new Date(), 'HH') + ':' + format(new Date(), 'mm'),
        payway: '',
        name: '',
      }
    };
    this.state.schema = t.struct({
      paytime: t.String,
      paydate: t.String,
      payway: payWay,
      name: t.String
    });

    this.onProcess = false;
    this.channel = null;

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onFormFieldChange = this.onFormFieldChange.bind(this);

    this.noticeMessages = {
      [PAY_TYPE_WEIXIN]: 'compayWx',
      [PAY_TYPE_CAIFUTONG]: 'compayTenpay',
      [PAY_TYPE_ALIPAY]: 'compayAlipay',
      'bank': 'compayBank',
    };
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {

    const {charge, match} = nextProps;
    let companyBankPayments = charge.get('companyBankPayments');
    let channel = this.channel = companyBankPayments.filter( item => item.payNo == match.params.channel)[0];
    let transfterTypeItems = charge.get('bankTransferTypeList');

    if (channel) {

      let transferTypeoptions = {};
      for (let item of transfterTypeItems) {
        transferTypeoptions[item.codeValue] = item.codeShowName;
      }

      let payWay = t.enums(transferTypeoptions);

      this.setState({
        schema: t.struct({
          count: t.String,
          paytime: t.String,
          paydate: t.String,
          name: t.String,
          payway: payWay,
        })
      });

      options.fields.count.attrs.placeholder = channel.minMaxDes;

    }
  }

  onSubmitHandler() {
    let _this = this;

    const {charge, match, history} = this.props;
    let channel = this.channel;
    
    let values =this.state.value;
    const {dispatch} = this.props;

    let minEdu = channel.minEdu;
    let maxEdu = channel.maxPay;
      
    if (values.count <= 0) {
      alert('请输入充值金额');
    } else if (isNaN(values.count*1)) {
      alert('充值金额输入不正确');
    } else if (values.count < minEdu && minEdu > 0) {
      alert(channel.minMaxDes);
    } else if (values.count > maxEdu && maxEdu > 0) {
      alert(channel.minMaxDes);
    } else if (values.payway == '') {
      alert('请选择汇款方式');
    } else if (values.name == ''){
      alert('请输入汇款人姓名');
    } else {
      if (this.onProcess) {
        return ;
      }
      this.onProcess = true;
      let userBank = channel.hkUserBank;
      let companyBank = channel.hkCompanyBank;
      dispatch(saveCompanyBankPayment(values.count, 
        channel.payNo, 
        values.paydate + ' ' + values.paytime + ':00',
        values.payway,
        values.name,
        companyBank,
        userBank,
        (data) => {
          alert(data.msg, (popup) => {
            popup.close();
            _this.onProcess = false;
            if (data.errorCode == RES_OK_CODE) {
              history.goBack();
            }
          });
      }));
    }
  }

  onFormFieldChange(values) {
    this.state.value = Object.assign(this.state.value, values);
  }
  copySomeThing(text){
    copy(text,{
      debug: false,
      message: '点击“确定”按钮复制',
    });
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isAndroid){
      alert("该浏览器不支持快捷复制，请手动复制");
    }else{
      alert("已复制到粘贴板");
    }
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
        <span>开户名: {channel.bankUser}</span>
        <span className="copyBtn" onClick={this.copySomeThing.bind(this,channel.bankUser)}>复制</span>
      </div>
      <div className="row">
        <p>{channel.bankCard}<span className="copyBtn" onClick={this.copySomeThing.bind(this,channel.bankCard)}>复制</span></p>
        <p style={{ marginBottom: 0 }}>开户行: {channel.bankAddress}</p>

      </div>
    </div>;

    let msgId = this.noticeMessages['bank'];


    if (channel.payType == PAY_TYPE_WEIXIN 
      || channel.payType == PAY_TYPE_CAIFUTONG
      || channel.payType == PAY_TYPE_ALIPAY ) {
      bankInfo = <div className="company-info-desc">
        <div className="row">
          <span>{channel.bankType}</span>
        </div>
        <div className="row">
          <p>{channel.bankCard}</p>
        </div>
      </div>;
      msgId = this.noticeMessages[channel.payType];
    }

    return (
      <div className="company-charge-form form-type2">
        <div className="wrap">
          <div className="company-info">
            <StickLayout image={ <img src={channel.bigPic} alt=""/> } content={bankInfo}></StickLayout>
          </div>
          <div className="inner special_notice company-charge-inner">
            <Form ref="form" options={options} onChange={this.onFormFieldChange} value={this.state.value} type={this.state.schema}></Form>
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

export default CompanyChargeForm;