import React, {PropTypes, Component} from 'react';

class ChaseTabs extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			crtTab: null,
		};

		this.onTabClick = this.onTabClick.bind(this);
	}

	onTabClick(tab) {
		this.setState({
			crtTab: tab
		});
		let key = Object.keys(tab)[0];
		this.props.onClick(key, tab[key]);
	}

	render() {
		const {tabs} = this.props;
		if (!this.state.crtTab && tabs) {
			this.state.crtTab = tabs[0];
		}
		let crtTab = this.state.crtTab;
		let self = this;

		return (
			<div className="tabs chase-tabs">
				<div className="wrap">
					<ul className="clearfix">
						{tabs.map( (tab, index) => {
							let key = Object.keys(tab)[0];
							return <li className={ crtTab === tab ? 'active': ''} key={index} onClick={this.onTabClick.bind(self, tab)}>
								<span>{tab[key]}</span>
							</li>
						} )}
					</ul>
				</div>
			</div>
		);
	}
}

ChaseTabs.propTypes = {
	tabs: PropTypes.array,
	onClick: PropTypes.func,
};

ChaseTabs.defaultProps = {
	tabs: [],
	onClick: () => {},
};

export default ChaseTabs;