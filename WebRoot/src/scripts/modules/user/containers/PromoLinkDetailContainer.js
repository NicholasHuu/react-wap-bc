import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactDom from 'react-dom';
import {withRouter} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroller';
import moment from 'moment';

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import LoadingComponent from '../../../components/LoadingComponent';

import TabSwitcher from '../components/TabSwitcher';
import copy from 'copy-to-clipboard';
import QRCode from '../../../utils/qrcode.js';

import {loadPromoLinks, deletePromoLink} from '../actions/UserOrder';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert} from '../../../utils/popup';

class PromoLinkDetailContainer extends Component {
  
  constructor(props) {
    super(props);
    this.copyText = this.copyText.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.regQrcode = null;
    this.wxQrcode = null;
    this.regQrcodeInstance = null;
    this.wxQrcodeInstance = null;
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadPromoLinks());
  }

  componentDidMount() {
    this.renderQrCode();
  }

  componentDidUpdate(){
    this.renderQrCode();
  }

  onDelete() {
    let promoLink = this.getPromoLink();
    if (!promoLink) return ;
    
    const {history} = this.props;
    if (this.process) return ;
    this.process = true;
    if (confirm("确认删除?")) {
      deletePromoLink(promoLink.id, (data) => {
        this.process = false;
        if (data.errorCode == RES_OK_CODE) {
          history.goBack();
        } else {
          alert(data.msg);
        }
      });
    }

  }

  renderQrCode() {
    // 生成二维码
    let self = this;
    const promoLink = this.getPromoLink();
    if (!promoLink) return ;
    setTimeout(() => {

      if (self.regQrcodeInstance) {
        self.regQrcodeInstance.clear();
        self.regQrcodeInstance.makeCode({
          text: promoLink.registAddress,
          width: 271,
          height: 269
        });
      } else if (self.regQrcode) {
        self.regQrcodeInstance = new QRCode(self.regQrcode, {
          text: promoLink.registAddress,
          width: 271,
          height: 269
        });
      }
      if (self.wxQrcodeInstance) {
        self.wxQrcodeInstance.clear();
        self.regQrcodeInstance.makeCode({
          text: promoLink.wxAddress,
          width: 271,
          height: 269
        });
      } else if (self.wxQrcode) {
        self.wxQrcodeInstance = new QRCode(self.wxQrcode, {
          text: promoLink.wxAddress,
          width: 271,
          height: 269
        });
      }
    }, 1000);
  }

  copyText(text) {
    copy(text, {
      message: '点击 #{key} 复制到剪贴板',
    });
    alert('链接复制成功');
  }

  getPromoLink() {
    const {promoLinks, match} = this.props;
    let id = match.params.id;
    let promoLink = promoLinks.filter( item => item.id == id);
    if (!promoLink[0]) return null;
    return promoLink[0];
  }

  render() {
    const promoLink = this.getPromoLink();
    if (!promoLink) return null;

    return (
      <div className="page page-promolink-detail">
        <Header {...this.props}>
          <Back />
          <h3>推广链接</h3>
        </Header>
        
        <div className="page-body">
          
          <ul>
            <li>
              <label>彩票返点</label>
              <span>{promoLink.rebateRatio}</span>
            </li>
            <li>
              <label>真人返点</label>
              <span>{promoLink.liveRatio}</span>
            </li>
            <li>
              <label>电子返点</label>
              <span>{promoLink.electronicRatio}</span>
            </li>
            <li>
              <label>体育返点</label>
              <span>{promoLink.sportRatio}</span>
            </li>
            <li>
              <label>捕鱼返点</label>
              <span>{promoLink.fishRatio}</span>
            </li>
            <li>
              <label>类型</label>
              <span>{promoLink.userType}</span>
            </li>
            <li>
              <label>创建时间</label>
              <span>{promoLink.createTime}</span>
            </li>
            <li>
              <label>有效期</label>
              <span>{promoLink.validTime}</span>
            </li>
            <li>
              <label>注册次数</label>
              <span>{promoLink.registNum}</span>
            </li>
            <li>
              <label>推广渠道</label>
              <span>{promoLink.extAddress}</span>
            </li>
            <li>
              <label>QQ</label>
              <span>{promoLink.qq}</span>
            </li>
            <li>
              <label>Skype</label>
              <span>{promoLink.skype}</span>
            </li>
            <li>
              <label>微信号</label>
              <span>{promoLink.wx}</span>
            </li>
          </ul>

          <ul className="promolink-content">
            {!!promoLink.registAddress && <li>
              <label>链接地址</label>
              <span onClick={this.copyText.bind(this, promoLink.registAddress)}>复制链接</span>
              <textarea readOnly="readonly" rows="2">{promoLink.registAddress}</textarea>
            </li> } 
            {  ( !!promoLink.wxAddress && promoLink.wxFlag != "0" ) &&   <li>
              <label>微信注册地址</label>
              <span onClick={this.copyText.bind(this, promoLink.wxAddress)}>复制链接</span>
              <textarea rows="2">{promoLink.wxAddress}</textarea>
            </li> }
          </ul>

          <div className="promolink-qrcode">
            {!!promoLink.registAddress  &&  <div ref={ el => this.regQrcode = el }>
              <h3>浏览器注册二维码</h3>
            </div> } 
            {  ( !!promoLink.wxAddress && promoLink.wxFlag != "0" ) && <div ref={ el => this.wxQrcode = el }>
              <h3>微信注册二维码</h3>
            </div> }
          </div>

          <p className="help">长按二维码可保存到本地相册</p>

          <ul><button onClick={this.onDelete} className="btn btn-orange">删除此条推广链接</button></ul>

        </div>

      </div>
    );
  }

};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    promoLinks: userModule.order.get('promoLinks'),
    app
  };
}

export default withRouter(connect(mapStateToProps)(PromoLinkDetailContainer));
