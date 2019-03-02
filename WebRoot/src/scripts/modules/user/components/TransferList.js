import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';

import LoadingComponent from '../../../components/LoadingComponent';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {getBalanceFromURL} from '../actions/PlatformTransfer';
import {buildQuery} from '../../../utils/url';
import {alert} from '../../../utils/popup';

class Transferlist extends LoadingComponent {

  constructor(props){
    super(props);
    this.state
  }

  componentDidMount() {
    //
  }

  componentWillReceiveProps(nextProps) {
    //
  }

  showBlance(item) {
    const {dispatch} = this.props;
    const _this = this;
    _this.openLoading();
    dispatch(getBalanceFromURL(item.flat, function(data){
      _this.closeLoading();
      if(data.errorCode != RES_OK_CODE) {
        alert(data.msg);
        return;
      }
    }));
  }

  render() {
    const {path} = this.props.match;
    const {items} = this.props;
    return (
     <div className="user-order-list transfer-List">
        <ul>
          {items.map((item) =>{
            return (
              <li key={item.flat}>
                <i style={ {backgroundImage: 'url('+item.smallPic+')' } }></i>
                <span>{item.flatName}</span>
                <span ref="balance_text" className="show-balance" onClick={this.showBlance.bind(this, item)}>{ typeof item.flatMoney  != 'undefined' ? '￥'+ item.flatMoney + '元': '显示余额' }</span>
                <Link to={path+ "/" + item.flat +"/in?" + buildQuery({name: item.flatName}) } className="transfer-in">转入</Link>
                <Link to={path+ "/" + item.flat+ "/out?" + buildQuery({name: item.flatName}) }>转出</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
};

Transferlist.defaultProps = {
  items: []
}

Transferlist.propTypes = {
  items: PropTypes.array,
  dispatch: PropTypes.func.isRequired
};

export default withRouter(Transferlist);