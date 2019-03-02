import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Header from '../components/Header';
import Back from '../../../components/Back';
import {readMessage} from '../actions/Message';

class MessageContentContainer extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {match, dispatch} = this.props;
    dispatch(readMessage(match.params.id));
  }

  render() {
    const {match} = this.props;
    return (
	   	<div className="page message-content-page">
	      	<Header {...this.props}>
        	  	<Back />
	          	<h3>消息详情</h3>
	        </Header>
          <div className="page-body">
            <div className="message-content-item">
              <div className="lists">
                <h2><i></i><span>{decodeURIComponent(match.params.title)}</span></h2>
                <div>{ decodeURIComponent(match.params.content) }</div>
              </div>
            </div>
          </div>
	    </div>
    );
  }
};

MessageContentContainer.propTypes = {
	message: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	const {userModule, app} = state;
  const message = userModule.message;
	return {
	  userModule,
    message,
    app
	};
}

export default connect(mapStateToProps)(withRouter(MessageContentContainer));