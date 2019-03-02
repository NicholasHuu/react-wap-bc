import React, {Component, PropTypes} from 'react';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import SelectBox from '../../../components/SelectBox';

import FormNotice  from '../../../components/FormNotice';

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

class BankBindForm extends Component {
  
  constructor(props) {
    super(props);
    this.schema = null;
    const {realName} = this.props;
    let _this = this;
    const {bankName} = this.props;
    this.state = {
      values: {
        accountName: realName,
        bankName : bankName
      },
    };
    
    this.options = {
      fields: {
        bank: {
          label: '收款银行:',
          template: t.form.Form.templates.select.clone({
            renderSelect(locals) {
              let options = locals.options.splice(1);
              return <SelectBox onClick={_this.banklist} value={_this.state.values.bankName} onChange={locals.onChange} options={options}  />
            }
          }),
        },
        accountNumber: {
          label: '银行卡号:',
          type: "number",
        
          attrs: {
            placeholder: "请填写银行卡号",
          },
        },
        accountName: {
          label: '开户姓名:',

          attrs: {
            
          },
          template: t.form.Form.templates.textbox.clone({
            renderInput(locals) {
              return <input className="disabled" disabled type="text" value={locals.value} />
            }
          }),
        },
        bankAddress: {
          label: '开户行地址:',
          attrs: {
            placeholder: "请填写开户地址",
          },
        },
        withdrawpwd: {
          label: '资金密码:',
          type: 'password',
          attrs: {
            maxLength: 4,
            placeholder: "请填写资金密码",
          },        
        }
      }
    };

    this.values = {
      bank: this.state.values.bankName,
      accountNumber: '',
      accountName: '',
      bankAddress: '',
      withdrawpwd: '',
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
  }

  banklist(){
    let type = "add";
    window.location.href = "/#/user/banklist/" + type +"/"+ 0;
  }
  onFormSubmit() {
    const {onBindCard} = this.props;
    onBindCard(this.values);
  }
  
  onFormChange(value, path) {
    this.values = Object.assign(this.values, value);
  }
  componentWillMount(){
    this.values.accountNumber= '';
    this.values.bankAddress= '';
    this.values.withdrawpwd= '';
  }
  componentWillReceiveProps(nextProps) {
    const {realName} = nextProps;
    this.setState({
      values: {
        accountName: realName
      }
    });
  }

  render() {
    const {banks} = this.props;
    let bankList = {};
    for (let bank of banks) {
      bankList[bank.code] = bank.name;
    }
    this.schema = t.struct({
      bank: t.enums(bankList),
      accountNumber: t.String, 
      accountName: t.String, 
      bankAddress: t.String,
      withdrawpwd: t.String
    });

    if (banks.length <= 0) {
      return null;
    } else {
      this.values.bank = banks[0].code;
    }

    return (
      <div className="charge-form form-type2">
        <div className="inner">
          <Form options={this.options} onChange={this.onFormChange} value={this.state.values} ref="form" type={this.schema}></Form>
          <FormNotice msg="bank"></FormNotice>
          <div className="btn-wrap">
            <button onClick={this.onFormSubmit} className="btn btn-submit btn-light-blue">确认绑定</button>
          </div>
        </div>
      </div>
    );
  }
};

BankBindForm.propTypes = {
  onBindCard: PropTypes.func.isRequired,
  banks: PropTypes.array.isRequired
};

export default BankBindForm;