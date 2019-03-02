import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import NiceCheckbox from '../components/NiceCheckbox';
import PlusNumber from '../../../components/PlusNumber';
import {alert} from '../../../utils/popup';
import {addTeamMember} from '../actions/User';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import LoadingComponent from '../../../components/LoadingComponent';
import * as validate from '../utils/validate';

import FormNotice from '../../../components/FormNotice';

import t from 'tcomb-form';

const Form = t.form.Form;

const UserType = t.enums({
  '0': '会员',
  '1': '代理',
});

const schema = t.struct({
  userType: UserType,
  account: t.String,
  password: t.String,
  back: t.Number,
  liveBack: t.Number,
  electronicBack: t.Number,
  sportBack: t.Number,
  fishBack: t.Number,
});

const options = {
  fields: {
    userType: {
      label: '用户类型',
      template: t.form.Form.templates.select.clone({
        renderSelect(locals) {
          let options = locals.options.splice(1);
          return <NiceCheckbox placeholder={locals.attrs.placeholder} name={locals.path[0]} value={locals.value} initChange={true} onChange={locals.onChange} options={options}  />
        }
      }),
    },
    back: {
      label: '彩票返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          //console.log(locals);
          return <PlusNumber min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    liveBack: {
      label: '真人返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[1]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    electronicBack: {
      label: '电子返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[2]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    sportBack: {
      label: '体育返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[3]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    fishBack: {
      label: '捕鱼返点',
      template: t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber min={.1} name={locals.path[4]} value={locals.value} onChange={locals.onChange}/>
        }
      }),
    },
    account: {
      label: '用户名',
      attrs: {
        placeholder: '4-16位数字/字母或组合',
      },
    },
    password: {
      label: '密码',
      type: 'password',
      attrs: {
        placeholder: '6-16位数字/字母或组合',
      },
    },
  },
};


class AddTeamMemberContainer extends LoadingComponent {
  
  constructor(props) {
    super(props);

    this.state = {
      values: {
        back: .1,
        liveBack: .1,
        electronicBack: .1,
        sportBack: .1,
        fishBack: .1,
        userType: '0',
      }
    };
    this.maxWaterBack = 0;
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.setMaxWaterBackOption(props);
  }

  setMaxWaterBackOption(props) {

    let info = props.userModule.user.get('info');
    if (info.backWater) {
      this.maxWaterBack = info.backWater.lottery;
      this.maxLiveBack = info.backWater.live;
      this.maxElectronicBack = info.backWater.electronic;
      this.maxSportBack = info.backWater.sport;
      this.maxFishBack = info.backWater.fish;
      this.state.values.back = this.maxWaterBack;
      this.state.values.liveBack = this.maxLiveBack;
      this.state.values.electronicBack = this.maxElectronicBack;
      this.state.values.sportBack = this.maxSportBack;
      this.state.values.fishBack = this.maxFishBack;
      options.fields.back.template = t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          console.log(locals);
          return <PlusNumber max={info.backWater.lottery} min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      });
      options.fields.liveBack.template = t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber max={info.backWater.live} min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      });
      options.fields.electronicBack.template = t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber max={info.backWater.electronic} min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      });
      options.fields.sportBack.template = t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber max={info.backWater.sport} min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      });
      options.fields.fishBack.template = t.form.Form.templates.textbox.clone({
        renderInput(locals) {
          return <PlusNumber max={info.backWater.fish} min={.1} name={locals.path[0]} value={locals.value} onChange={locals.onChange}/>
        }
      });
      let values = this.state.values;
      values = Object.assign({}, values, {
        back: info.backWater.lottery,
        liveBack: info.backWater.live,
        electronicBack: info.backWater.electronic,
        sportBack: info.backWater.sport,
        fishBack: info.backWater.fish,
      });
      this.setState({
        values: values,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setMaxWaterBackOption(nextProps);
  }

  onFormChange(values) {
    this.setState({
      values
    });
  }

  componentDidMount() {
    //
  }

  onFormSubmit() {
    const {history} = this.props;
    let values = this.refs.form.getValue();
    let self = this;

    let info = this.props.userModule.user.get('info');
    let changedValues = this.state.values;
    let errorMessages = [
      {userType: '请选择用户类型'},
      {account: '请输入4-16位数字/字母或组合作为帐号'},
      {password: '请输入6-16位数字/字母或组合作为密码'},
      {back: '请输入正确的返点'},
    ];
    for (let errorMessage of errorMessages) {
      let key = Object.keys(errorMessage)[0];
      if (key == 'account' && !validate.name(changedValues[key])) {
        alert(errorMessage[key]);
        return ;
      }
      if ( key == 'password' && !validate.password(changedValues[key]) ) {
        alert(errorMessage[key]);
        return ''
      }
      if (key == 'back' && changedValues[key] < .1 ) {
        alert(errorMessage[key]);
        return ;
      }
      if (typeof changedValues[key] == 'undefined' || !changedValues[key]) {
        alert(errorMessage[key]);
        return ;
      }
    }

    const {dispatch} = this.props;
    if (this.process) return ;
    this.process = true;
    this.openLoading();
    addTeamMember(values, data => {
      this.process = false;
      this.closeLoading();
      if (data.errorCode == RES_OK_CODE) {
        alert(data.msg, popup => {
          popup.close();
          this.setState({
            values: {}
          });
          history.goBack();
        });
      } else {
        alert(data.msg);
      }
    });
  }

  render() {
    return (
      <div className="page page-add-team-member">
        
        <Header {...this.props}>
          <Back />
          <h3>注册下级</h3>
        </Header>

        <div className="page-body">
          <div className="form-type2 team-member-add-form">
            <Form ref="form" value={this.state.values} type={schema} onChange={this.onFormChange} options={options}/>
            <FormNotice msg="zcxj"></FormNotice>
            <button onClick={this.onFormSubmit} className="btn btn-orange">确认</button>
          </div>
        </div>

      </div>
      
    );
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  };
}

export default withRouter(connect(mapStateToProps)(AddTeamMemberContainer));