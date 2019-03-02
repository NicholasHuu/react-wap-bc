import React, {PropTypes, Component} from 'react';

import {alert} from '../../../utils/popup';
import {formatPrice} from '../utils/Lottery';

import Checkbox from './Checkbox';

class ChaseSameBsTable extends Component {
	
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
		let bs = this.refs.bs.value * 1;
		if (!!bs <= 0 || !!count <= 0 ) {
			alert("请输入期数或倍数");
			return ;
		}
		this.setState({
			bsarr: {},
		});
		this.props.onChaseClick({
			count,
			bs
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
		if (bs < 1 || isNaN(bs)) {
			return ;
		}
		chaseItems[index].bs = bs;

		this.props.onItemSelectChange(chaseItems);
	}

	render() {
		
		const {chaseItems} = this.props;
		let self = this;
		console.log(['bsarr', this.state.bsarr, chaseItems]);

		return (
			<div className="chase-table">
				<div className="wrap">
					<div className="form">
						<div className="field-group">
							<label>期数: </label>
							<input type="text" defaultValue={10} ref="count" className="input"/>
						</div>
						<div className="field-group">
							<label>倍数: </label>
							<input type="text" defaultValue={this.props.defaultBs} ref="bs" className="input" />
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
										onChange={this.onBsChange.bind(self, index)} 
										value={ this.state.bsarr[index] || chaseItem.bs} type="text"/></td>
									<td>{ formatPrice ( chaseItem.cost ) }</td>
									<td>{ formatPrice ( chaseItem.profit ) }</td>
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

ChaseSameBsTable.propTypes = {
	onChaseClick: PropTypes.func,
	onItemSelectChange: PropTypes.func,
	chaseItems: PropTypes.array,
	defaultBs: PropTypes.string,
};

ChaseSameBsTable.defaultProps = {
	onChaseClick: () => {},
	chaseItems: [],
	defaultBs: "1",
	onItemSelectChange: () => {},
};

export default ChaseSameBsTable;