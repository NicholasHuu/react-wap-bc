import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {buildQuery, parseQuery} from '../../../../utils/url';

class PankouSwitchBoard extends Component {

  onPankouClick(pankou, subpankou) {
    // 多级盘口 只有在选择子盘口才做动作
    if (pankou.xzlxList && !subpankou) {
      return ;
    } else {
      this.props.onChange(pankou, subpankou);
    }
  }

  render() {
    const {pankouItems, defaultPankou, defaultSubpankou, location} = this.props;
    let query = parseQuery(location.search);
   
    let _this = this;
    return (
      <div className="switch-board-content" style={this.props.style}>
        <div className="wrap">
            <ul className="clearfix">
              {pankouItems.map( (item, index) => {
                let subPankouItems = item.xzlxList;
                return (
                  <li key={index}>
                    <span className={"pankou"} onClick={_this.onPankouClick.bind(_this, item)}>{item.itemName}</span>
                    
                    {subPankouItems ? 
                      <div className="sub-pankou">
                        {subPankouItems.map( (subPankou, index2) => {
                          return <div className={ "sb-item " + ( ( item.itemCode == query.pankou  || item.itemCode == defaultPankou.itemCode )
                          && ( subPankou.xzlxCode == query.subpankou || subPankou.xzlxCode == defaultSubpankou.xzlxCode) ? 'active': '' ) } 
                          key={index + '-' + index2 }>
                            <span className="pankou" onClick={_this.onPankouClick.bind(_this, item, subPankou)}>{subPankou.xzlxName}</span>
                          </div>
                        } ) }
                      </div> :
                      <div className="sub-pankou">
                        <div className={ "sb-item " + ( ( query.pankou == item.itemCode || item.itemCode == defaultPankou.itemCode) ? 'active': '' ) } key={index}>
                          <span className="pankou" onClick={_this.onPankouClick.bind(_this, item)}>{item.itemName}</span>
                        </div>
                      </div> 
                    }

                  </li>
                );
              })}
            </ul>
        </div>
      </div>
    ); 
  }
};

PankouSwitchBoard.defaultProps = {
  onChange: () => {},
};

PankouSwitchBoard.propTypes = {
  pankouItems: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  defaultPankou: PropTypes.object,
  defaultSubpankou: PropTypes.object
};

export default withRouter(PankouSwitchBoard);