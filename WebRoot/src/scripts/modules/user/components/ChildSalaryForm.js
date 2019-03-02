import React, {Component, PropTypes} from 'react';

import t from 'tcomb-form';
import NiceCheckbox from './NiceCheckbox';
import PlusNumber from '../../../components/PlusNumber';

import {createPromoLink} from '../actions/UserOrder';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {updateSalarySetting, addSalarySetting} from '../actions/UserOrder';
import * as validate from '../utils/validate';

import FormNotice from '../../../components/FormNotice';

function undefined2Empty(v, d = '') {
  return v == undefined ? d: v;
}

const Form = t.form.Form;

const PromoType = t.enums({
  '0': '会员',
  '1': '代理',
});

const ValidDay = t.enums({
  '0': '永久',
  '1': '1天',
  '3': '3天',
  '7': '7天',
  '15': '15天',
  '30': '30天'
});

const Mode = t.enums({
  '0': '阶梯模式',
});

const LostRequire = t.enums({
  '0': '不要求',
  '1': '要求',
});

const schema = t.struct({
  account: t.String,
  salaryMoney: t.Number,
  startMoney: t.Number,
  personCount: t.maybe(t.Number),
  maxMoney: t.maybe(t.Number),
  loss: LostRequire,
  fangshi: Mode,
});

const options = {
  fields: {
    account: {
      label: '用户名',
      attrs: {
        placeholder: '请输入下级账号',
      },
    },
    fangshi: {
      label: '发放模式',
      template: t.form.Form.templates.select.clone({
        renderSelect(locals) {
          let options = locals.options.splice(1);
          return <NiceCheckbox placeholder={locals.attrs.placeholder} name={locals.path[0]} value={locals.value} initChange={true} onChange={locals.onChange} options={options}  />
        }
      }),
    },
    salaryMoney: {
      label: '日薪金额',
      attrs: {
        placeholder: "请输入日薪金额",
      },
    },
    startMoney: {
      label: '起始金额',
      attrs: {
        placeholder: "请输入起始金额",
      },
    },
    personCount: {
      label: '投注人数',
      attrs: {
        placeholder: "如果不填写，则不限制投注人数",
      },
    },
    maxMoney: {
      label: '封顶金额',
      attrs: {
        placeholder: "如果不填写，则不限制封顶金额",
      },
    },
    loss: {
      label: '亏损要求',
      template: t.form.Form.templates.select.clone({
        renderSelect(locals) {
          let options = locals.options.splice(1);
          return <NiceCheckbox placeholder={locals.attrs.placeholder} name={locals.path[0]} value={locals.value} initChange={true} onChange={locals.onChange} options={options}  />
        }
      }),
    },
  },
};


class ChildSalaryForm extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      values: {
        loss: '0',
        fangshi: '0',
      },
    };
    
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    const {item} = props;
    if (item) {
      this.state.values = {
        account: undefined2Empty(item.userName),
        fangshi: undefined2Empty(item.privodeFangshiValue, '0'),
        salaryMoney: undefined2Empty(item.salaryMoney),
        startMoney: undefined2Empty(item.startMoney),
        personCount: undefined2Empty(item.personCountValue),
        maxMoney: isNaN(item.moneyCount)? '': item.moneyCount,
        loss: undefined2Empty(item.lossCountValue, '0'),
      };
      console.log(['values' ,this.state.values]);
      options.fields.account.attrs.readOnly = 'readOnly';
    } else {
      options.fields.account.attrs.readOnly = '';
    }

  }

  componentWillReceiveProps(nextProps) {
    const {item} = nextProps;
    if (item) {
      this.state.values = {
        account: undefined2Empty(item.userName),
        fangshi: undefined2Empty(item.privodeFangshiValue, '0'),
        salaryMoney: undefined2Empty(item.salaryMoney),
        startMoney: undefined2Empty(item.startMoney),
        personCount: undefined2Empty(item.personCountValue),
        maxMoney: isNaN(item.moneyCountValue)? '': item.moneyCountValue,
        loss: undefined2Empty(item.lossCountValue, '0'),
      };
      options.fields.account.attrs.readOnly = 'readOnly';
    } else {
      options.fields.account.attrs.readOnly = '';
    }
  }

  onChange(values) {
    this.setState({
      values
    });
  }

  onSubmit() {
    const {history} = this.props;
    let values = this.refs.form.getValue();
    let self = this;

    let changedValues = this.state.values;
    let errorMessages = [
      {account: '请输入4-16位数字/字母或组合的帐号'},
      {fangshi: '请选择发放模式'},
      {salaryMoney: '请输入日薪金额'},
      {startMoney: '请输入起始金额'},
      {personCount: '请正确输入投注人数'},
      {maxMoney: '请正确输入封顶金额'},
      {loss: '请选择亏损要求'},
    ];
    for (let errorMessage of errorMessages) {
      let key = Object.keys(errorMessage)[0];
      if (key == 'account' && !validate.name( changedValues[key] ) ) {
        alert(errorMessage[key]);
        return ;
      } else if ( ( key == 'personCount' || key == 'maxMoney' ) ) {
        if (changedValues[key] && isNaN(changedValues[key]*1)  ) {
          alert(errorMessage[key]);
          return ;  
        } else if ( changedValues[key]*1 < 0 ) {
         if (key == 'personCount') {
            alert("请输入有效投注人数");
          } else if (key == 'maxMoney') {
            alert("请输入有效封顶金额");
          }

          return ;
        }
      } else if ( key == 'salaryMoney' || key == 'startMoney') {
        let v = changedValues[key];
        if ( typeof v == 'undefined' || !v ) {
          alert(errorMessage[key]);
          return ;
        } else if (isNaN(v*1) || v <= 0) {
          if (key == 'salaryMoney') {
            alert("请输入有效日薪金额");
            return ;
          } else if (key == 'startMoney' && v < 0) {
            alert("请输入有效起始金额");
            return ;
          }
        }
      } else {
        if (typeof changedValues[key] == 'undefined' || !changedValues[key]) {
          alert(errorMessage[key]);
          return ;
        }
      }
    }

    const {item} = this.props;
    if (item && item.id) {
      let params = Object.assign({}, changedValues);
      params['id'] = item.id;
      Object.assign(item, changedValues);
      if (!params['personCount']) {
        params['personCount'] = 0;
      }
      if (!params['maxMoney']) {
        params['maxMoney'] = 0;
      }
      if (this.process) return;
      this.process = true;
      updateSalarySetting(params, (data) => {
        this.process = false;
        if (data.errorCode == RES_OK_CODE) {
          alert(data.msg, (popup) => {
            popup.close();
            self.props.onFinish(params);
          });
        } else {
          alert(data.msg);
        }
      });
    } else  {
      if (this.process) return;
      this.process = true;
      if (!changedValues['personCount']) {
        changedValues['personCount'] = 0;
      }
      if (!changedValues['maxMoney']) {
        changedValues['maxMoney'] = 0;
      }
      addSalarySetting(changedValues, data => {
        this.process = false;
        if (data.errorCode == RES_OK_CODE) {
          alert(data.msg, (popup) => {
            popup.close();
            history.push('/user/salary/child');
            self.props.onFinish();
            self.setState({
              values: {},
            });
          });
        } else {
          alert(data.msg);
        }
      });
    }
  }

  render() {
    return <div className="form-type2 child-salary-form">
        <Form ref="form" value={this.state.values} type={schema} onChange={this.onChange} options={options}/>
        <button onClick={this.onSubmit} className="btn btn-orange">确认</button>
        <FormNotice msg="xjrx"></FormNotice>
    </div>;
  }

}

ChildSalaryForm.propTypes = {
  
};

ChildSalaryForm.defaultProps = {
  onFinish: () => {},
};

export default ChildSalaryForm;