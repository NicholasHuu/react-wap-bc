import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';

import {payWithOnlineQuick} from '../actions/Charge';
import {RES_OK_CODE} from '../../../constants/AppConstant';
import {alert, confirm} from '../../../utils/popup';
import LoadingComponent from '../../../components/LoadingComponent';
import StickLayout from '../../../components/StickLayout';
import {buildQuery} from '../../../utils/url';
import FormNotice from '../../../components/FormNotice';

class ChargeQuick extends Component {

	constructor(props) {
		super(props);
		this.state = {
			channel: null,
		};
		this.onProcess = false;
		this.onSubmitHandler = this.onSubmitHandler.bind(this);
		this.openElectOnlinePopup = this.openElectOnlinePopup.bind(this);
	}

	onSubmitHandler() {
		if (this.onProcess) {
			return ;
		}
		let {channel} = this.state;
		const {dispatch, charge} = this.props;
		let money = 1*(this.refs.count.value);
		if (money <= 0) {
			alert('请输入金额');
			return ;
		}
		if (!channel) {
			return null;
		}
		let bankCode = channel.match(/\'m\'\:\'(\w+)\'/i)[1];
  	let payments = charge.get('onlineQuickPayments');
  	let payment = payments.filter(item => item.payValue == channel)[0];
  	if (payment) {
  		let _this = this;
			// money, bankCode, payId, payValue, payType
			this.openLoading();
			this.onProcess = true;
			dispatch(payWithOnlineQuick(money, bankCode.toUpperCase(), payment.thirdPayId, payment.payValue,  payment.userPayType, (data) => {
				_this.closeLoading();
				_this.onProcess = false;
				windowReference = window.open();
			
				if (data.errorCode == RES_OK_CODE) {
					let href = '/user/goPayCenter';
					href = href + '?pay_url='+data.datas.pay_url + '&sendParams=' + data.datas.sendParams;
					windowReference.location = href;
				} else {
					alert(data.msg);
				}

			}));
  	}
	}

	componentWillReceiveProps(nextProps) {
  	const {charge} = nextProps;
	}

	openElectOnlinePopup(channel) {
		let countRef = null;
		let msgRef = null;
		const {dispatch} = this.props;
		let html = ( <div className="online-quick-charge-popup">
			<div className="wrap">
					<div className="fieldgroup"><input ref={ ref => countRef = ref } type="number" placeholder={channel.minMaxDes} /></div>
					<FormNotice content={channel.remark}></FormNotice>
					<p className="error-msg" ref={ ref => msgRef = ref }></p>
			</div>
		</div>);
		confirm(html, '输入充值金额', (popup) => {
			let amount = countRef.value * 1;
			let min = channel.payMinEdu;
			let max = channel.payMaxEdu;
			if (isNaN(amount)) {
				ReactDOM.findDOMNode(msgRef).textContent = "请输入金额";
			} else if (amount > max || amount <= min ) {
				ReactDOM.findDOMNode(msgRef).textContent = channel.minMaxDes;
			} else {
        dispatch(payWithOnlineQuick(amount, channel.payType, channel.module, (data) => {
          if (data.errorCode == RES_OK_CODE) {
            // let windowReference = window.open();
            let href = '/user/goPayCenter';
            href = href + '?pay_url='+data.datas.pay_url + '&sendParams=' + data.datas.sendParams;
            // windowReference.location = href;
            window.location.href = href;
          } else {
            alert(data.msg);
          }
        }));
			}
		});
	}

	setChargeChannel(channel, type = 'online') {
		const {history} = this.props;
		if (type == 'online') {
			history.push(history.location.pathname + '/'+type+'?' + buildQuery({payType: channel.payType ,thirdPayId: channel.thirdPayId}));
		} else if (type == 'elect-online') {	
			this.openElectOnlinePopup(channel);
		}
		 else {
			history.push(history.location.pathname + '/'+type+'?' + buildQuery({payNo: channel.payNo}));
		}
	}


  render() {
  	const {charge} = this.props;
  	let channels = charge.get('onlineQuickPayments');
  	let offlineChannels = charge.get('offlineQuickPayments');
  	let mobileOnlinePayments = charge.get('mobileOnlinePayments');
    return (
    	<div className="common-style charge-quick">
	    	<div className="style-charge">
	    		<ul className="clearfix">
	    			<li className='active'><Link to={'/user/charge/quick'}>快捷支付</Link></li>
	    			<li><Link to={'/user/charge/company'}>公司入款</Link></li>
	    		</ul>
	    	</div>

	    	{mobileOnlinePayments.length > 0 && <h3 className="mod-title">{charge.get('mobileOnlinePaymentsTitle')}</h3>}
				<div className="operation-charge">
	    		<div className="auto-pay">
						<ul className="operation-choice clearfix">
							{mobileOnlinePayments.map( (channel, index) => {
								return (
									<li key={'mobile-online-'+ index} onClick={ this.setChargeChannel.bind(this, channel, 'online') }>
										<StickLayout 
											image={ <img src={channel.smallPicUrl} alt=""  /> } 
											content={ <p>{channel.payName}</p> } />
									</li>
								);
							})}
						</ul>
	    		</div>
	    	</div>
				
				{channels.length > 0 && <h3 className="mod-title">{charge.get('onlineQuickPaymentsTitle')}</h3>}
	    	<div className="operation-charge">
	    		<div className="auto-pay">
						<ul className="operation-choice clearfix">
							{channels.map(channel => {
								return (
									<li key={channel.payName} onClick={ this.setChargeChannel.bind(this, channel, 'online') }>
										<StickLayout 
											image={ <img src={channel.smallPicUrl} alt=""  /> } 
											content={ <p>{channel.payName}</p> } />
									</li>
								);
							})}
						</ul>
	    		</div>
	    	</div>
				
				{offlineChannels.length > 0 && <h3 className="mod-title">{charge.get('offlineQuickPaymentsTitle')}</h3>}
	    	<div className="operation-charge">
	    		<div className="auto-pay">
						<ul className="operation-choice clearfix">
							{offlineChannels.map(channel => {
								return (
									<li key={channel.payRname} onClick={ this.setChargeChannel.bind(this, channel, 'offline') }>
										<StickLayout 
											image={ <img src={channel.smallPicUrl} alt=""  /> } 
											content={ <p>{channel.payName}</p> } />
									</li>
								);
							})}
						</ul>
	    		</div>
	    	</div>
			

	    	<h3 className="mod-title mod-warning">
	    		<FormNotice msg="fastpay"></FormNotice>
	    	</h3>
		</div>
	);
  };
};

export default ChargeQuick;