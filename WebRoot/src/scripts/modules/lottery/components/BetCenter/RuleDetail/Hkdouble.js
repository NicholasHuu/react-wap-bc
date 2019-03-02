import React , { Component, PropTypes } from "react";


class Hkdouble extends Component{
  
  render(){
    const {rule} = this.props;
    return(
      <div className="rule-page">
        <p dangerouslySetInnerHTML={{__html: rule.ruleContent}}></p>
      </div>
    )
  }
}

Hkdouble.defaultProps = {
  rule: {}
};

Hkdouble.propTypes = {
  rule: PropTypes.object
};

export default Hkdouble;