import React, {Component, PropTypes} from 'react';

import t from 'tcomb-form';
import NiceCheckbox from './NiceCheckbox';
import PlusNumber from '../../../components/PlusNumber';

import {createPromoLink} from '../actions/UserOrder';
import {alert} from '../../../utils/popup';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import * as validate from '../utils/validate';

const Form = t.form.Form;

const PromoType = t.enums({
  '0': '会员',
  '1': '代理',
});

const ValidDay = t.enums({
  'a1': '1天',
  'a3': '3天',
  'a7': '7天',
  'a15': '15天',
  'a30': '30天',
  'a0': '永久',
});

const schema = t.struct({
  type: PromoType,
  fd: t.Number,
  live: t.Number,
  electronic: t.Number,
  sport: t.Number,
  fish: t.Number,
  validDay: ValidDay,
  channel: t.String,
  //password: t.String,
  qq: t.maybe(t.String),
  skype: t.maybe(t.String),
  wx: t.maybe(t.String),
});

const options = {
  fields: {
    type: {
      label: '用户类型',
      template: t.form.Form.templates.select.clone({
        renderSelect(locals) {
          let options = locals.options.splice(1);
          return <NiceCheckbox placeholder={locals.attrs.placeholder} name={locals.path[0]} value={locals.value} initChange={true} onChange={locals.onChange} options={options}  />
        }
      }),
    },
    fd: {
      label: '彩票返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    live: {
      label: '真人返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    electronic: {
      label: '电子返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    sport: {
      label: '体育返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    fish: {
      label: '捕鱼返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    validDay: {
      label: '有效期',
      template: t.form.Form.templates.select.clone({
        renderSelect(locals) {
          let options = locals.options.splice(1);
          return <NiceCheckbox placeholder={locals.attrs.placeholder} name={locals.path[0]} value={locals.value} initChange={true} onChange={locals.onChange} options={options}  />
        }
      }),
    },
    channel: {
      label: '推广渠道',
      attrs: {
        placeholder: '如QQ、论坛等',
      },
    },
    password: {
      label: '用户密码',
      attrs: {
        placeholder: '请输入注册用户默认密码',
      },
    },
    qq: {
      label: 'QQ',
      attrs: {
        placeholder: '请输入常用QQ号码',
      },
    },
    skype: {
      label: 'Skype',
      attrs: {
        placeholder: '请输入常用skype号码',
      },
    },
    wx: {
      label: '微信号',
      attrs: {
        placeholder: '请输入常用微信账号',
        type: 'password',
      }
    }
  },
};


class PromoLinkForm extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      values: {
        fd: props.maxWaterBack,
        live: props.maxLiveBack,
        electronic: props.maxElectronicBack,
        sport: props.maxSportBack,
        fish: props.maxFishBack,
        type: '0',
        validDay: 'a1',
      },
    };
    
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.setMaxWaterBack(props);

  }

  setMaxWaterBack(props) {
    options.fields.fd.template = t.form.Form.templates.textbox.clone({
      renderInput(locals) {
        return <PlusNumber min={.1} max={props.maxWaterBack} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
      }
    });
    options.fields.live.template = t.form.Form.templates.textbox.clone({
      renderInput(locals) {
        return <PlusNumber min={.1} max={props.maxLiveBack} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
      }
    });
    options.fields.electronic.template = t.form.Form.templates.textbox.clone({
      renderInput(locals) {
        return <PlusNumber min={.1} max={props.maxElectronicBack} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
      }
    });
    options.fields.sport.template = t.form.Form.templates.textbox.clone({
      renderInput(locals) {
        return <PlusNumber min={.1} max={props.maxSportBack} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
      }
    });
    options.fields.fish.template = t.form.Form.templates.textbox.clone({
      renderInput(locals) {
        return <PlusNumber min={.1} max={props.maxFishBack} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
      }
    });/**/
    let values = this.state.values;
    values = Object.assign({}, values, {
      fd: props.maxWaterBack,
      live: props.maxLiveBack,
      electronic: props.maxElectronicBack,
      sport: props.maxSportBack,
      fish: props.maxFishBack,
    });
    this.setState({
      values
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setMaxWaterBack(nextProps);
  }

  onChange(values) {
    this.setState({
      values
    });
  }

  onSubmit() {
    const {history, onFinish} = this.props;
    let values = this.refs.form.getValue();
    let changedValues = this.state.values;

    let errorMessages = [
      {fd: '请正确设置返点'},
      {live: '请正确设置返点'},
      {electronic: '请正确设置返点'},
      {sport: '请正确设置返点'},
      {fish: '请正确设置返点'},
      {type: '请选择用户类型'},
      {validDay: '请选择有效期'},
      {channel: '请输入推广渠道'},
      //{password: '请输入6-16位数字/字母或组合的密码'}
      //{qq: '请输入正确的QQ号码'},
    ];
    for (let errorMessage of errorMessages) {
      let key = Object.keys(errorMessage)[0];
      if (key == 'qq' && changedValues[key] && ( changedValues[key].length < 4 || changedValues[key].length > 12  || isNaN(changedValues[key]*1 ) ) ) {
        alert(errorMessage[key]);
        return ;
      }
      // if (key == 'password' && ! validate.name(changedValues[key]) ) {
      //   alert(errorMessage[key]);
      //   return ;
      // }
      if (typeof changedValues[key] == 'undefined' || !changedValues[key]) {
        alert(errorMessage[key]);
        return ;
      }
    }

    let params = {
      qudao: values.channel,
      qq: values.qq || '',
      back: values.fd,
      liveBack: values.live,
      electronicBack: values.electronic,
      sportBack: values.sport,
      fishBack: values.fish,
      valadateTime: values.validDay.replace('a', ''),
      userType: values.type,
      skype: values.skype || '',
      wx: values.wx || '',
      //password: values.password,
    };
    if (this.process) return;
    this.process = true;
    createPromoLink(params, (data) => {
      this.process = false;
      if (data.errorCode == RES_OK_CODE) {
        alert('添加成功', (popup) => {
          popup.close();
          this.setState({
            values: {
              fd: 1
            }
          });
          onFinish();
        });
        
      } else {
        alert(data.msg);
      }
    });
  }

  render() {
    return <div className="form-type2 promo-link-form">
        <Form ref="form" value={this.state.values} type={schema} onChange={this.onChange} options={options}/>
        <button onClick={this.onSubmit} className="btn btn-orange">确认</button>
    </div>;
  }

}

PromoLinkForm.propTypes = {
  onFinish: PropTypes.func,
  maxWaterBack: PropTypes.number,
  maxLiveBack: PropTypes.number,
  maxElectronicBack: PropTypes.number,
  maxSportBack: PropTypes.number,
  maxFishBack: PropTypes.number,
};

PromoLinkForm.defaultProps = {
  onFinish: () => {},
  maxWaterBack: 20,
  maxLiveBack: 20,
  maxElectronicBack: 20,
  maxSportBack: 20,
  maxFishBack: 20,
};

export default PromoLinkForm;