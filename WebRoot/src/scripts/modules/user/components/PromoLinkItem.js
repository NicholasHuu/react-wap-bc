import React, {Component, PropTypes} from 'react';

class PromoLinkItem extends Component {
  
  constructor(props) {
    super(props);

    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick() {
    const {item, history} = this.props;
    history.push('/user/promolinks/'+item.id);
  }

  render() {
    const {item} = this.props;
    return (
      <div onClick={this.onItemClick} className="promot-link-item" onClick={this.onItemClick}>
        <div className="wrap">
          <div className="inner">
            <div className="index">{item.id}</div>
            <div className="left">
              <h3>创建时间</h3>
              <h4>{item.createTime}</h4>
            </div>
            <div className="right">
              <h3>类型</h3>
              <h4 className="red">{item.userType}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }

};

PromoLinkItem.propTypes = {
  item: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default PromoLinkItem;