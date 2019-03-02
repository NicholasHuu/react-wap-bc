import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import Header from '../components/Header';
import Back from '../../../components/Back';
import {alert} from '../../../utils/popup';
import {postStationLetter} from '../actions/UserOrder';
import {RES_OK_CODE} from '../../../constants/AppConstant';

import t from 'tcomb-form';

const POST_TYPE_UP = 0;
const POST_TYPE_DOWN = 1;

const Form = t.form.Form;

const schema = t.struct({
  receiver: t.String,
  title: t.String,
  content: t.String,
});

const options = {
  fields: {
    receiver: {
      label: '接收人',
      attrs: {
        placeholder: '输入接收人',
        //readOnly: 'readonly',
      },
    },
    title: {
      label: '标题',
      attrs: {
        placeholder: '输入站内信标题',
      },
    },
    content: {
      label: '内容',
      type: 'textarea',
      attrs: {
        placeholder: '输入站内信内容最多80字',
      },
    },
  },
};

class PostStationLetter extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      values: {
        receiver: '',
      },
      item: null
    };
    
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

componentDidMount() {
    const {match, history, teamAgent, teamAccount} = this.props;
    let id = match.params.id;
    
    // 给上级发
    if (id == 'up') {
      this.setState({
        values: {
          receiver: '上级',
        },
      });
    } else if (id == 'down') {
      this.setState({
        values: {
          receiver: '',
        },
      });
    } else {
      // 给下级发
      let item = teamAgent.items.filter(item => item.id == id);
      if (item.length <= 0 ) {
        item = teamAccount.items.filter(item => item.id == id);
      }
      item = item[0];
      if (!item) {
        return history.goBack();
      }
      this.setState({
        item,
        values: {
          receiver: item.userName,
        },
      });
    }


  }

  onChange(value) {
    this.setState({
      values: value
    });
  }

  onSubmit() {
    let {item} = this.state;
    const {history, match} = this.props;
    if (match.params.id == 'up') {
      item = {
        userName: '',
      };
    } else if (match.params.id == 'down') {
      item = {
        userName: this.state.values.receiver,
      };
      if (( item.userName || '' ).trim().length <= 0 ) {
        alert('请输入接收人');
        return ;
      }
    }
    let values = this.refs.form.getValue();
    if ((this.state.values.title || "").trim().length <= 0) {
      alert('请输入站内信标题');
    } else if ((this.state.values.content || "").trim().length <= 0) {
      alert('请输入站内信内容');
    } else if ( (this.state.values.content || "").trim().length > 80  ) {
      alert('站内信长度超过限制');
    } else {
      postStationLetter(match.params.id == 'up' ? POST_TYPE_UP: POST_TYPE_DOWN, values.title, values.content, item.userName, (data) => {
        if (data.errorCode == RES_OK_CODE) {
          alert('发送成功', (popup) => {
            popup.close();
            history.goBack();
          });
        } else {
          alert(data.msg);
        }
      });
    }
  }

  render() {
    const {item} = this.state;
    const {match} = this.props;
    if (  match.params.id != 'up' && match.params.id != 'down' && !item) return null;

    return (
      <div className="page page-post-station-letter">
        
        <Header {...this.props}>
          <Back />
          <h3>站内信</h3>
        </Header>

        <div className="page-body">
          
          <div className="form-station-letter">
            <div className="wrap">
                <Form options={options} ref="form" type={schema} value={this.state.values} onChange={this.onChange}></Form>
                <button className="btn btn-orange" onClick={this.onSubmit}>确认发送</button>
            </div>
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
    teamAgent: userModule.order.get('teamMemberOfAgent'),
    teamAccount: userModule.order.get('teamMemberOfAccount'),
    app
  }
}

export default withRouter(connect(mapStateToProps)(PostStationLetter));