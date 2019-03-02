import React, {Component, PropTypes} from 'react';
import {connect} from 'react-router';


class BugerElectMenu extends Component {
  render() {
    let types = this.props.types;
    return (
    	<div className="menu">
  			<section className="head">
  				<div className="header"><img src="/misc/images/elect-mg/header.png" alt="" /></div>
  				<p className="name">MA81235357</p>
  				<p className="remainder"><span>Mg余额：</span><span>2324242</span></p>
  			</section>

  			<section className="list-type menu-list">
  				<ul>
              {types.map(function (flatName, index) {
                return <li key={flatName.flat}><div><i></i><span>{flatName.flatName}</span></div></li>;
              })}
  				</ul>
  			</section>

  			<section className="list-type operation-list">
  				<ul>
  					<li><div><i className="icon icon-money"></i><span>充值</span></div></li>
  					<li><div><i className="icon icon-withdraw"></i><span>提现</span></div></li>
  					<li><div><i className="icon icon-home"></i><span>转换</span></div></li>
  				</ul>
  			</section>
    	</div>
    )
  };
};

export default BugerElectMenu;