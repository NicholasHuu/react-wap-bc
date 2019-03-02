import React, {Component, PropTypes} from 'react';


import RealtimeBall from './RealtimeBall';

class RealtimeBallGroup extends Component {
  
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let newItems = nextProps.items;
    let oldItems = this.props.items;
    if (JSON.stringify(newItems) != JSON.stringify(oldItems)) {
      return true;
    }

    return false;
  }

  renderBallTeam() {
    const {items} = this.props;
    let html = [];
    let key = 0;
    for (let item of items) {
      html.push(<li key={key}><RealtimeBall {...this.props} title={item.leagueName} scoreBoard={item.detailList} /></li>);
      key += 1;
    }

    return html;
  }

  render() {
    const {items} = this.props;
    let state = this.state;
    return <div className="realtile-ball-group">
        <div className="wrap">
          <ul className="clearfix">
            {this.renderBallTeam()}
          </ul>
        </div>
      </div>  
  }
};

RealtimeBallGroup.propTypes = {
  items: PropTypes.oneOf(PropTypes.object, PropTypes.array),
  onProductSelect: PropTypes.func
};

export default RealtimeBallGroup;