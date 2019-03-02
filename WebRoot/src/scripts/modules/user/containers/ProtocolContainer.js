import React ,{ Component , PropTypes } from "react";
import {connect} from 'react-redux';
import TopBar from '../../../components/TopBar';
import Back from '../../../components/Back';

import {loadProtocol} from '../actions/User';


class ProtocolContainer extends Component {

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadProtocol());
  }

  render(){
    const {protocol} = this.props;
    return (
      <div className="page protocol-page">
        <TopBar>
          <Back />
          <h3>开户协议</h3>
        </TopBar>
        <div className="page-body">
          <div className="content">
            <p dangerouslySetInnerHTML={ {__html: protocol}}></p>
          </div>
        </div>
        
      </div>

    )
  }
}

function mapStateToProps(state) {
  let protocol = state.userModule.user.get('protocol');
  return {
    protocol
  }
}


export default connect(mapStateToProps)(ProtocolContainer);