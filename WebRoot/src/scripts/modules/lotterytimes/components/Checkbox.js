import React, {Component} from 'react';
import {PropTypes} from 'prop-types';

class Checkbox extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			checked: true
		};
		this.checked = this.state.checked;

		this.onChangeHandle = this.onChangeHandle.bind(this);
	}

	onChangeHandle() {
		let checked = !this.state.checked;
		this.setState({
			checked: checked,
		});
		this.checked = checked;
		this.props.onChange(checked);
	}

	componentWillReceiveProps(newProps, prevProps) {
		if (newProps.defaultChecked != prevProps.defaultChecked) {
			this.checked = newProps.defaultChecked;
			this.setState({
				checked: newProps.defaultChecked,
			});
		}
	}

	render() {
		let id = this.props.id;
		if (!id) {
			id = 'checkbox-' + Math.random();
		}
		return <div className="checkbox">
		  <input checked={this.state.checked} onChange={this.onChangeHandle} ref="checkbox" type="checkbox" id={id}/>
		  <label htmlFor={id}>X</label>
		</div>
	}
};

Checkbox.propTypes = {
	id: PropTypes.string,
	defaultChecked: PropTypes.bool,
	onChange: PropTypes.func,
};

Checkbox.defaultProps = {
	onChange: () => {},
	defaultChecked: false,
};

export default Checkbox;