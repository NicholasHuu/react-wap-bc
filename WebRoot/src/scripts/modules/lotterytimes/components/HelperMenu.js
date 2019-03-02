import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import {hideViewYl} from '../actions/LotteryAction';
import {buildQuery} from '../../../utils/url';

class HelperMenu extends Component {

  linkClick(link) {
    const {dispatch, history, lottery} = this.props;
    if (link.code == 'ycylz') {
      dispatch(hideViewYl());
    } else if (link.code == 'zhjl') {
      let query = {
        from: 'play',
      };
      history.push(`/user/tracehistory?` + buildQuery(query));
    } else if (link.code == 'tzjl') {
      let query = {
        from: 'play',
      };
      history.push(`/user/lotteryorder?` + buildQuery(query));
    } else if (link.code == 'zbjl') {
      history.push(`/user/lotteryfunds`);
    } else if (link.code == 'czxx') {
      history.push(`/user/lotteryhowto/${lottery}`);
    } else {
      console.log(['link code', link.code]);
    }

    this.props.onClick();
  }
  
  render() {
    const {lottery, pankou, match, links} = this.props;
    if (links.length <=0 ) return null;
    return (
      <div className="helpermenu">
        <ul className="clearfix">
          {links.map( (link, index) => {
            return  <li key={index}><a onClick={this.linkClick.bind(this, link)}>{link.value}</a></li> ;
          } )}
        </ul>
      </div>
    );
  }
};

HelperMenu.propTypes = {
  lottery: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired,
  pankou: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

HelperMenu.defaultProps = {
  onClick: () => {},
};

export default HelperMenu;