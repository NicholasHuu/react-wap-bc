import React, {Component, PropTypes} from 'react';

import Checkbox from './Checkbox';
import {formatPrice} from '../utils/Lottery';

class ChaseLrbsTable extends Component {

constructor(props) {
		super(props);

		this.onPlanBtnClick = this.onPlanBtnClick.bind(this);
		this.onSelectChange = this.onSelectChange.bind(this);

		this.state = {
			bsarr: {},
		};
	}

	onPlanBtnClick() {
		let count = this.refs.count.value * 1;
		let lrv = this.refs.lrv.value * 1;
		if (!!lrv <= 0 || !!count <= 0) {
			alert("请输入追号期数或利润率");
			return ;
		}
		this.props.onChaseClick({
			count,
			lrv,
			bs: lrv,
		});
	}
	
	onSelectChange(index) {
		let cbox = this.refs["checkbox_"+index];
		const {chaseItems} = this.props;
		chaseItems[index].checked = cbox.checked;

		this.props.onItemSelectChange(chaseItems);
	}

	onBsChange(index) {
		const {chaseItems} = this.props;
		let bs = this.refs['bs_'+index].value * 1;
		if (!!bs <= 0 ) {
			return ;
		}
		chaseItems[index].bs = bs;

		this.props.onItemSelectChange(chaseItems);
	}

	render() {

		const {chaseItems} = this.props;
		let self = this;

		return (
			<div className="chase-table chase-lrv-table">
				<div className="wrap">
					<div className="form">
						<div className="field-group">
							<label>最低收益率 </label>
							<input type="text" defaultValue={30} ref="lrv" className="input"/>
							<span> %</span>
						</div>
						<div className="field-group">
							<label>追号期数  </label>
							<input type="text" ref="count" defaultValue={10} className="input" />
						</div>
						<button className="btn btn-orange" onClick={this.onPlanBtnClick}>生成计划</button>
					</div>
					<table>
						<thead>
							<tr>
								<th>操作</th>
								<th>序号</th>
								<th>期号</th>
								<th>投注倍数</th>
								<th>累计投注</th>
								<th>中奖盈利</th>
								<th>总盈利率</th>
							</tr>
						</thead>
						<tbody>
							{chaseItems.map( (chaseItem, index) => {

								if (typeof chaseItem.checked == 'undefined') chaseItem.checked = true;

								return ( <tr key={index}>
									<td>
										<Checkbox ref={ "checkbox_"+index } defaultChecked={chaseItem.checked} onChange={ this.onSelectChange.bind(self, index) }/>
									</td>
									<td>{chaseItem.index}</td>
									<td>{chaseItem.qs}</td>
									<td><input ref={ "bs_" + index } 
										defaultValue={chaseItem.bs} 
										onChange={this.onBsChange.bind(self, index)} 
										value={ this.state.bsarr[index]} type="text"/></td>
									<td>{ formatPrice ( chaseItem.cost)}</td>
									<td>{ formatPrice( chaseItem.profit ) }</td>
									<td><span className={ chaseItem.ylv > 0 ? "color-red": "color-green"}>{chaseItem.ylv}%</span></td>
								</tr>)
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

}

ChaseLrbsTable.propTypes = {
	onChaseClick: PropTypes.func,
	chaseItems: PropTypes.array,
};

ChaseLrbsTable.defaultProps = {
	onChaseClick: () => {},
	chaseItems: [],
};


export default ChaseLrbsTable;