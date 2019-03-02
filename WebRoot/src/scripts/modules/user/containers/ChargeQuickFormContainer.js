import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import t from "tcomb-form";

import Header from "../components/Header";
import Back from "../../../components/Back";
import ThirdChargeForm from "../components/ThirdChargeForm";
import CompanyChargeForm from "../components/CompanyChargeForm";
import LoadingComponent from "../../../components/LoadingComponent";
import { parseQuery } from "../../../utils/url";
import FormNotice from "../../../components/FormNotice";
import { alert } from "../../../utils/popup";
import { RES_OK_CODE } from "../../../constants/AppConstant";
import {
  PAY_TYPE_WEIXIN,
  PAY_TYPE_ALIPAY,
  PAY_TYPE_CAIFUTONG,
  PAY_TYPE_NORMAL,
  PAY_TYPE_MOBILE_WX_APP,
  PAY_TYPE_MOBILE_ALI_APP,
  PAY_TYPE_MOBILE_BANK_APP
} from "../constants/ChargeConstant";
import {
  loadChargePaymentItems,
  payWithOnlineQuick,
  saveScanPayment,
  loadChargeAllPayment
} from "../actions/Charge";
import SelectBox from "../../../components/SelectBox";

import { bodyClass, resetBodyClass } from "../../../actions/AppAction";

const onlineFormFields = t.struct({
  count: t.Number
});

const countInput = t.form.Form.templates.textbox.clone({
  renderInput(locals) {
    let value = locals.value;
    if (value == 0) value = "";
    return (
      <input
        onChange={locals.attrs.onChange}
        placeholder={locals.attrs.placeholder}
        value={value}
      />
    );
  }
});

const onlineFormOptions = {
  fields: {
    count: {
      label: "充值金额:",
      type: "number",
      attrs: {
        placeholder: ""
      },
      template: countInput
    }
  }
};

const offlineChargeFields = t.struct({
  count: t.maybe(t.Number),
  account: t.maybe(t.String),
  remark: t.maybe(t.String)
});

const offlineChageOptions = {
  fields: {
    count: {
      label: "充值金额:",
      type: "number",
      attrs: {
        placeholder: ""
      },
      template: countInput
    },
    account: {
      label: (
        <i>
          姓<i style={{ visibility: "hidden" }}>值金</i>名:
        </i>
      ),
      attrs: {
        placeholder: "请输入姓名"
      },
      template: countInput
    },
    remark: {
      label: (
        <i>
          备<i style={{ visibility: "hidden" }}>值金</i>注:
        </i>
      ),
      attrs: {
        placeholder: "请输入备注"
      }
    }
  }
};

const Form = t.form.Form;

class ChargeQuickFormContainer extends LoadingComponent {
  constructor(props) {
    super(props);
    const { location, match } = this.props;
    let query = parseQuery(location.search);
    this.thirdPayId = query.thirdPayId;
    this.payNo = query.payNo;
    this.payType = query.payType;
    this.type = match.params.way.toLowerCase();
    this.onProcess = false;
    this.noticeMessages = {
      online: {
        [PAY_TYPE_ALIPAY]: "onlineAlipay",
        [PAY_TYPE_WEIXIN]: "onlineWx",
        [PAY_TYPE_CAIFUTONG]: "onlineTenpay"
      },
      offline: {
        [PAY_TYPE_ALIPAY]: "traditAlipay",
        [PAY_TYPE_WEIXIN]: "traditWx",
        [PAY_TYPE_CAIFUTONG]: "traditTenpay"
      }
    };
    this.msgId = null;
    this.loadCrtChannel();
    this.chargeOnlineSubmit = this.chargeOnlineSubmit.bind(this);
    this.changeOnScanSubmit = this.changeOnScanSubmit.bind(this);
    this.state = {
      onlineFormValues: {},
      onlineCharge: {
        count: ""
      },
      offlineCharge: {
        count: "",
        account: ""
      },
      title: "",
      minCharge: "", // 最低充值金额
      maxCharge: "" // 最大充值金额
    };
  }

  componentDidMount() {
    this.openLoading();
    this.resetTitleAndFormOption(this.props);
  }

  resetTitleAndFormOption(props) {
    const { app } = props;
    let formInformation = app.get("formInformation");
    if (this.channel) {
      let title = "";
      let minEdu = 0;
      let maxEdu = 0;
      title = this.channel.payName;
      if (this.channel.payType == PAY_TYPE_ALIPAY) {
        //offlineChageOptions.fields.account.attrs.placeholder = formInformation.member.fast_scan_code_pay_ali_account.informationValue;
        //offlineChageOptions.fields.account.label = '支付宝帐号:';
      } else if (this.channel.payType == PAY_TYPE_WEIXIN) {
        //title = '传统微信充值';
        //offlineChageOptions.fields.account.attrs.placeholder = formInformation.member.fast_scan_code_pay_wx_account.informationValue;
        //offlineChageOptions.fields.account.label = '微信帐号:';
      } else if (this.channel.payType == PAY_TYPE_CAIFUTONG) {
        //title = '传统财付通充值';
        //offlineChageOptions.fields.account.attrs.placeholder = '输入扫码支付的财付通帐号';
        //offlineChageOptions.fields.account.label = '财付通帐号:';
      }

      if (this.type == "online") {
        minEdu = this.channel.payMinEdu;
        maxEdu = this.channel.payMaxEdu;
        if (this.channel.payType == PAY_TYPE_ALIPAY) {
          title = "在线支付宝充值";
        } else if (this.channel.payType == PAY_TYPE_WEIXIN) {
          title = "在线微信充值";
        } else if (this.channel.payType == PAY_TYPE_CAIFUTONG) {
          title = "在线财付通充值";
        } else if (
          [
            PAY_TYPE_MOBILE_BANK_APP,
            PAY_TYPE_MOBILE_ALI_APP,
            PAY_TYPE_MOBILE_WX_APP
          ].indexOf(this.channel.payType) != -1
        ) {
          title = "手机在线支付";
        }
        title = this.channel.payName;
      } else if (this.type == "offline") {
        minEdu = this.channel.minPay;
        maxEdu = this.channel.maxPay;
      }

      this.setState({
        title,
        minCharge: minEdu,
        maxCharge: maxEdu
      });
      onlineFormOptions.fields.count.attrs.placeholder = this.channel.minMaxDes;
      offlineChageOptions.fields.count.attrs.placeholder = this.channel.minMaxDes;

      this.setState({
        onlineCharge: {
          count: 0
        },
        offlineCharge: {
          count: 0,
          account: 0,
          remark: ""
        }
      });
    }
  }

  loadCrtChannel(props = null) {
    if (!props) props = this.props;
    // 线上快捷支付
    if (this.type == "online") {
      let channels = props.charge.get("onlineQuickPayments");
      let mobileOnlineChannels = props.charge.get("mobileOnlinePayments");
      for (let item of channels) {
        if (
          item.thirdPayId == this.thirdPayId &&
          item.payType == this.payType
        ) {
          this.channel = item;
          break;
        }
      }
      for (let item of mobileOnlineChannels) {
        if (
          item.thirdPayId == this.thirdPayId &&
          item.payType == this.payType
        ) {
          this.channel = item;
          break;
        }
      }

      if (this.channel) {
        this.msgId = this.noticeMessages["online"][this.channel.payType];
      }
    } else if (this.type == "offline") {
      let channels = props.charge.get("offlineQuickPayments");
      for (let item of channels) {
        if (item.payNo == this.payNo) {
          this.channel = item;
          break;
        }
      }

      if (this.channel) {
        this.msgId = this.noticeMessages["offline"][this.channel.payType];
      }
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(loadChargeAllPayment());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    resetBodyClass();
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
    this.loadCrtChannel(nextProps);
    this.resetTitleAndFormOption(nextProps);
  }

  changeOnScanSubmit() {
    if (this.onProcess) {
      return;
    }
    let payment = this.channel;
    const { dispatch, history } = this.props;
    let formValues = this.state.offlineCharge;
    formValues.count = formValues.count * 1;
    if (!formValues.count) {
      alert("请输入金额");
    } else if (
      formValues.count < this.state.minCharge &&
      this.state.minCharge > 0
    ) {
      alert(payment.minMaxDes);
    } else if (
      formValues.count > this.state.maxCharge &&
      this.state.maxCharge > 0
    ) {
      alert(payment.minMaxDes);
    } else if (formValues.account == "") {
      /*let label = offlineChageOptions.fields.account.label;
      if (label[label.length - 1] == ':') {
        label = label.substr(0, label.length - 1);
      }*/
      alert("请输入正确的姓名！");
    } else {
      const { charge } = this.props;
      let money = formValues.count;
      let account = formValues.account;
      let remark = formValues.remark;
      if (payment) {
        let _this = this;
        this.openLoading();
        this.onProcess = true;
        dispatch(
          saveScanPayment(
            money,
            payment.payType,
            payment.payNo,
            payment.module,
            account,
            remark,
            data => {
              _this.closeLoading();
              _this.onProcess = false;
              console.log(["data.errorCode", data.errorCode]);

              if (data.errorCode == RES_OK_CODE) {
                alert(data.msg, popup => {
                  popup.close();
                  console.log("closed");
                  history.goBack();
                });
              } else {
                alert(data.msg);
              }
            }
          )
        );
      }
    }
  }

  chargeOnlineSubmit() {
    if (this.onProcess) {
      return;
    }
    let payment = this.channel;
    const { dispatch } = this.props;
    let formValues = this.state.onlineFormValues;
    console.log(["form values", formValues, formValues.count]);
    if (!formValues.count) {
      alert("请输入金额");
    } else if (
      formValues.count < this.state.minCharge ||
      formValues.count > this.state.maxCharge
    ) {
      alert(payment.minMaxDes);
    } else {
      const { charge } = this.props;
      let money = formValues.count;
      let bankCode = formValues.bankCode ? formValues.bankCode : "";

      if (payment) {
        let _this = this;
        this.openLoading();
        this.onProcess = true;

        dispatch(
          payWithOnlineQuick(
            money,
            payment.payType,
            payment.module,
            data => {
              _this.closeLoading();
              _this.onProcess = false;
              if (data.errorCode == RES_OK_CODE) {
                // let windowReference = window.open();
                let href = "/user/goPayCenter";
                href =
                  href +
                  "?pay_url=" +
                  data.datas.pay_url +
                  "&sendParams=" +
                  data.datas.sendParams;
                // windowReference.location = href;
                window.location.href = href;
              } else {
                alert(data.msg);
              }
            },
            bankCode
          )
        );
      }
    }
  }

  onlineChargeForm() {
    this.loadCrtChannel();
    let options = Object.assign({}, onlineFormOptions);
    let fields = onlineFormFields;

    if (this.channel && this.channel.bank && this.channel.bank.length > 0) {
      let bankOptions = {};
      for (let bank of this.channel.bank) {
        bankOptions[bank.bankCode] = bank.bankName;
      }
      options.fields.bankCode = {
        label: "选择银行",
        attrs: {
          placeholder: "请选择支付银行"
        },
        template: t.form.Form.templates.select.clone({
          renderSelect: locals => {
            return (
              <SelectBox
                options={locals.options.splice(1)}
                initChange={true}
                onChange={locals.onChange}
              />
            );
          }
        })
      };
      fields = t.struct({
        count: t.Number,
        bankCode: t.enums(bankOptions)
      });
    }
    return (
      <div className="form-type2 charge-form">
        <div className="inner">
          <Form
            ref="onlineChargeForm"
            value={this.state.onlineFormValues}
            onChange={values => {
              this.state.onlineFormValues = Object.assign(
                this.state.onlineFormValues,
                values
              );
            }}
            options={options}
            value={this.state.onlineCharge}
            type={fields}
          />
          <FormNotice content={this.channel && this.channel.remark} />
          <div className="btn-wrap">
            <button
              className="btn btn-orange"
              onClick={this.chargeOnlineSubmit}
            >
              确定充值
            </button>
          </div>
        </div>
      </div>
    );
  }

  offlineChargeForm() {
    const { dispatch } = this.props;
    bodyClass("charge-body");
    return (
      <div className="form-type2 charge-form">
        <div className="inner">
          <div className="charge-info">
            <img src={this.channel && this.channel.picUrl} alt="" />
            <p className="name">APP扫码或“长按”保存二维码完成支付</p>
            <p style={{ marginTop: "1rem" }} className="desc">
              {this.channel && this.channel.payRname}
            </p>
          </div>
        </div>
        <div className="form-inner">
          <div className="charge-form-wrap">
            <Form
              ref="offlineChargeForm"
              value={this.state.offlineCharge}
              onChange={value => {
                this.setState({ offlineCharge: value });
              }}
              options={offlineChageOptions}
              type={offlineChargeFields}
            />
          </div>
        </div>
        <div className="action-inner">
          <FormNotice content={this.channel && this.channel.remark} />
          <div className="btn-wrap">
            <button
              onClick={this.changeOnScanSubmit}
              className="btn btn-orange"
            >
              提交表单
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="charge-quick-form-page page">
        <div className="inner">
          <Header {...this.props}>
            <Back />
            <h3>{this.state.title}</h3>
          </Header>
          <div className="page-body">
            {this.type == "online"
              ? this.onlineChargeForm()
              : this.offlineChargeForm()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userModule, app } = state;
  return {
    userModule,
    app,
    charge: userModule.charge
  };
}

export default connect(mapStateToProps)(withRouter(ChargeQuickFormContainer));
