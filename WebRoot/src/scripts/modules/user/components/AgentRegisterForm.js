import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';

const Form = t.form.Form;
import ImageCode from './ImageCode';

const schema = t.struct({
  account: t.String,
  password: t.String,
  cfmPassword: t.String,
  code: t.String,
  yzm: t.String,
});

const options = {
  fields: {
    code: {
      type: 'hidden',
    },
    account: {
      label: '账户',
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
    cfmPassword: {
      label: '确认密码',
      type: 'password',
      attrs: {
        placeholder: '再次输入密码',
      },
    },
    yzm: {
      label: '验证码',
      attrs: {
        placeholder: '请输入验证码',
      },
    },
  },
};

class AgentRegisterForm extends Component {

  constructor(props) {
    super(props);

    this.onFormChange = this.onFormChange.bind(this);

    this.state = {
      value: {
        // 
      },
    };

  }

  onFormChange(values) {
    this.setState({
      value: values
    });
  }
  
  render() {
    return <div className='form form-type2'>
      <div className="inner">

        <Form ref='form' value={this.state.value} onChange={this.onFormChange} type={schema} options={options} />
        <ImageCode {...this.props} />
        
        <div className="btn-wrap">
          <button className='btn btn-submit btn-light-blue' onClick={ () => { this.props.onSubmit(this.state.value) } }>确认注册</button>
        </div>

      </div></div>;
  }

}

AgentRegisterForm.propTypes = {
  onSubmit: PropTypes.func,
};

AgentRegisterForm.defaultProps = {
  onSubmit: () => {},
};

export default AgentRegisterForm;