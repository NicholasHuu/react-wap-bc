import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

class FormNotice extends Component {

  render() {
    let {formNotice, msg, content} = this.props;
    msg = formNotice[msg];
    if (!msg) msg = content;
    if (!msg) return null;
    return <div className={"form-notice " + this.props.className}>
      <div dangerouslySetInnerHTML={{__html: msg}}></div>
    </div>
  }
}

FormNotice.propTypes = {
  msg: PropTypes.string,
  content: PropTypes.string
};

FormNotice.defaultProps = {
  className: ''
};

function mapStateToProps(state) {
  const {app} = state;
  return {
    formNotice: app.get('formNotice')
  }
}

export default connect(mapStateToProps)(FormNotice);