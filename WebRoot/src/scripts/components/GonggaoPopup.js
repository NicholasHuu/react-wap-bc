
import React ,{Component , PropTypes}  from 'react';
import {Link} from 'react-router-dom';
import {getLiveLoginData, getElectGameLoginData, viewSlideArticle} from '../actions/AppAction';
import {buildQuery} from '../utils/url';
import {openGame} from '../utils/site';
import SliderSlick from 'react-slick';
import LoadingComponent from './LoadingComponent';
import {RES_OK_CODE} from '../constants/AppConstant';

import {handleClick} from './ToyBrick';

const EXTERN_LINK = 1;
const INTERN_LINK = 2;
const GROUP_LINK = 3;
const DETAIL_LINK = 4;
const PROMO_LINK = 5; // 推广页面
class GonggaoPopup extends LoadingComponent {

	constructor(props){
		super(props);
		this.closeGonggao = this.closeGonggao.bind(this);
		this.state = {
			status : 1
		};
    this.isGonggaoComponent = true;
    this.enableBtnTypes = [EXTERN_LINK, INTERN_LINK, GROUP_LINK, DETAIL_LINK, PROMO_LINK];
	}

	closeGonggao(){
		this.setState({
			status : 0
		})
	}

  disableBtn(item) {
    if (this.enableBtnTypes.indexOf(item.linkType) == -1 ) {
      return true;
    }
    return false;
  }

  render() {

  	let list = this.props.info;
   	if(list.gonggaoType == 1){
  		return(
  			<div className={this.state.status ? "" : "gonggao_none"}>
	  			<div className="gonggao"></div>
		  		<div className="message-wrap text-wrap">
		  			<h3>{list.gonggaoName}</h3>
	  				<p>{list.ganggaoContent}</p>
	  				{this.disableBtn(list) ? "": <a className="gonggao-btn" onClick={handleClick.bind(this,list,list.articleId, 'gonggao')}>{list.linkName}</a>}
	  				<div className="closeBtn" onClick={this.closeGonggao}></div>
	  			</div>
  			</div>
			)
  	}else{
  		return(
				<div className={this.state.status ? "" : "gonggao_none"}>
					<div className="gonggao"></div>
		  		<div className="message-wrap img-wrap">
						<a onClick={handleClick.bind(this,list,list.articleId, 'gonggao')}><img src={list.imagesUrl} alt="" /></a>
						<div className="closeBtn" onClick={this.closeGonggao}></div>
					</div>
				</div>
			)
  	}

  }
};


export default GonggaoPopup;















