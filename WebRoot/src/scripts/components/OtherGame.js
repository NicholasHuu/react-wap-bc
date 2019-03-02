import React , { Component, PropTypes } from "react"
import OtherGameL2 from '../components/OtherGameL2';

class OtherGame extends Component {

	constructor(props){
		super(props);
	}


	render () {
		const { list } = this.props; 
		return (
			<div className="otherGame" >
				{list.map(function(item,index){
					return(
						<div key={index}>
							<div className="title">{item.menuName}</div>
							<OtherGameL2 itemList={item.flatMenuList} />
						</div>
					)
				})}
			</div>

		)
	}
}

export default OtherGame;