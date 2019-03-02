import React, {Component, PropTypes} from 'react';

import {Link} from 'react-router-dom';

class BankItems extends Component {

  render() {
    const {bankLists} = this.props;
    const type = this.props.type;
    const event = this.props.onClick;
    if(!bankLists.length){
    return null;  
    }
    return (
      <div className="bank-items">
        <div className="inner">
          {bankLists.map( (bankItem, index) => {
            return (
            <div key={index} onClick={ () =>{ event(bankItem)} } >
              <div className="bank-item">
                  <i className="icon icon-bank" style={ {backgroundImage: 'url('+bankItem.bigPicUrl+')' } }></i>
                  <div className="bank-detail">
                    <div className="bd-top">
                      <span className="name">{bankItem.bankCnName}</span>
                    </div>
                    <span className="number">{bankItem.bankCard}</span>
                  </div>
                  <i className="icon icon-arrow-right"></i>
                
              </div>
            </div>
            );
          })}
        </div>
      </div>
    );
  }
};

BankItems.defaultProps = {
  onClick: (bankItem) =>　{
    //
  }
};

BankItems.propTypes = {
  bankLists: PropTypes.array.isRequired,
  onClick: PropTypes.func
};

export default BankItems;