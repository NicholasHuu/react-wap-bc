import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import FormNotice from '../../../components/FormNotice';

import {PAY_TYPE_WEIXIN, 
	PAY_TYPE_ALIPAY, 
	PAY_TYPE_BANK, 
	PAY_TYPE_CAIFUTONG, 
	PAY_TYPE_WEBSITE,
	PAY_TYPE_NORMAL} from '../constants/ChargeConstant';


class ChargeCompany extends Component {

	constructor(props) {
		super(props);
		this.state = {
			companyChannel: [],
			channelType: 'bank'
		};
		this.state.crtChannel = {};
	}

	charChannelSelected(channel) {
		const {history} = this.props;
		history.push('/user/charge/' + this.accountType(channel) + '/form/' + channel.payNo);
		// if (channel.payType == PAY_TYPE_WEBSITE) {
		// 	window.open(channel.payLink);
		// } else {
		// 	//
		// }
	}

	accountLabel(channel) {
		if (channel.payType == PAY_TYPE_WEBSITE) {
			return '';
		} else if (channel.payType == PAY_TYPE_CAIFUTONG 
				|| channel.payType == PAY_TYPE_ALIPAY 
				|| channel.payType == PAY_TYPE_WEIXIN) {
			return <span><i>{channel.bankUser}</i></span>;
		} else  {
			return <span><i>{channel.bankUser}</i></span>;
		}
	}

	accountType(channel) {
		if (channel.payType == PAY_TYPE_WEBSITE) {
			return 'website';
		} else if (channel.payType == PAY_TYPE_CAIFUTONG 
				|| channel.payType == PAY_TYPE_ALIPAY 
				|| channel.payType == PAY_TYPE_WEIXIN
				|| channel.payType == PAY_TYPE_NORMAL) {
			return 'third';
		} else  {
			return 'bank';
		}
	}

  render() {
  	const {charge} = this.props;
  	const companyBankChannel = charge.get('companyBankPayments');
  	if ( Object.keys(this.state.crtChannel).length <= 0 ) {
  		this.state.crtChannel = companyBankChannel.length <= 0 ? {}: companyBankChannel[0];
  	}
	
    return (
    	<div className="common-style charge-company">
	    	<div className="style-charge">
	    		<ul className="clearfix">
	    			<li><Link to={'/user/charge/quick'}>快捷支付</Link></li>
	    			<li className='active'><Link to={'/user/charge/company'}>公司入款</Link></li>
	    		</ul>
	    	</div>

	    	<div className="operation-charge">
	    		<ul>
	    			{companyBankChannel.map( (channel) => {
	    				return (
		    			<li key={channel.payNo} onClick={this.charChannelSelected.bind(this, channel)}>
		    				<div>
			    				<span className={"icon"} style={ {backgroundImage: "url("+channel.smallPic+")"} }></span>
									<div className="bank-info">
										<p className="way-name"><span>{channel.bankType}</span>{this.accountLabel(channel)}</p>
										<p>{channel.bankCard}</p>
									</div>
									<i className={"icon-arrow-right " }></i>
							</div>
		    			</li>);
	    			})}
	    		</ul>
	    		
	    	</div>
	    	<FormNotice msg="compay" />
		</div> 
		);
  };
};

ChargeCompany.propTypes = {
	userModule: PropTypes.object.isRequired
};

export default ChargeCompany;