import React, {Component, PropTypes} from 'react';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import SelectBox from '../../../components/SelectBox';
import FormNotice from '../../../components/FormNotice';

import {alert} from '../../../utils/popup';

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

class WithdrawForm extends Component {
  
  constructor(props) {
    super(props);
    this.schema = null;
    this.bankItem = props.bankItem;
    this.options = {
      fields: {
        count: {
          label: '提款金额:',
          type: 'number',
          attrs: {
              placeholder: this.bankItem.minMaxDes
          },
        },
        withdrawpwd: {
          label: '资金密码:',
          type: 'password',
            attrs: {
              maxLength: 4,
              placeholder: '请输入资金密码',
            },
        },
      }
    };
    this.values = {
      count: 0,
      withdrawpwd: '',
    };

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
  }

  componentWillMount() {
    this.schema = t.struct({
      count: t.Number, 
      withdrawpwd: t.String
    });
  }

  onSubmitHandler() {
    const {onWithdraw} = this.props;
    onWithdraw(this.values);
  }

  onFormChange(value, path) {
    this.values = Object.assign(this.values, value);
  }

  render() {
    return (
      <div className="withdraw-form form-type2">
        <div className="inner">
          <Form onChange={this.onFormChange} ref="form" options={this.options} type={this.schema}></Form>
          <p className="tip"><FormNotice msg="withdraw"></FormNotice></p>
        </div>
        <div className="btn-wrap">
          <button onClick={this.onSubmitHandler} className="btn btn-submit btn-light-blue">确认提款</button>
        </div>
      </div>
    );
  }
};

WithdrawForm.defaultProps = {
  onWithdraw: () => {},
  bankItem: {},
};

WithdrawForm.propTypes = {
  onWithdraw: PropTypes.func,
  bankItem: PropTypes.object
};

export default WithdrawForm;