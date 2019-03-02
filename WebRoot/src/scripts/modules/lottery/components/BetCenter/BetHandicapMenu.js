import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {buildQuery, parseQuery} from '../../../../utils/url';


class BetHandicapMenu extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      crtpankou: {}
    };
  }

  // componentDidMount() {
  //   if (this.props.defaultPankou) {
  //     this.setState({
  //       crtpankou: this.props.defaultPankou
  //     });
  //   }
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.defaultPankou) {
  //     this.setState({
  //       crtpankou: nextProps.defaultPankou
  //     });
  //   }
  // }

  // switchPankou(pankou) {
  //   const {history, location} = this.props;
  //   let query = {
  //     pankou: pankou.itemCode
  //   };
  //   history.push(location.pathname + '?' + buildQuery(query));

  //   this.props.onChange(pankou);
  //   this.setState({
  //     crtpankou: pankou
  //   });
  // }

  render() {
   /* let pankouItems = this.props.pankouItems;
    console.log(pankouItems);*/
    // var list = pankouItems.map(function(item,index){
    //   console.log(item.itemCode);
    // })
    const {match} = this.props;
    let _this = this;
    return (
      <span>112</span>
     /* <div className="menu hg-buger-items">
        <section className="list-type menu-list">
          <ul>
            {pankouItems.map( (type, index) => {
              return <li className={ _this.state.crtpankou.itemCode == type.itemCode || (!_this.state.crtpankou.itemCode && index == 0) ? 'active': '' } onClick={this.switchPankou.bind(_this, type)} key={type.itemCode}><div><i></i><span>{type.itemName}</span></div></li>
            })}
          </ul>
        </section>
      </div>*/
    )
  };
}

BetHandicapMenu.defaultProps = {
  onChange: () => {},
};

BetHandicapMenu.propTypes = {
/*  pankouItems: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  defaultPankou: PropTypes.object*/
};

export default withRouter(BetHandicapMenu);