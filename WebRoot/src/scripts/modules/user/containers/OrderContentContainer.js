import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Header from '../components/Header';
import Back from '../../../components/Back';
import InfoOrder from '../components/InfoOrder';
import FooterMenu from '../../../components/FooterMenu';
import {loadUserOrderItems} from '../actions/UserOrder';


class OrderContentContainer extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      navStatus: false,
      flat: '',
      curText: ''
    }
  }

  componentWillMount(){
    const {dispatch,userModule} = this.props;
    this.state.flat = userModule.platform.get('platformItems')[0].flat;
    this.setState({
      curText: userModule.platform.get('platformItems')[0].flatName
    })
  }
  changeFlat(item){
    const {history} = this.props;
    if(item.flat != this.state.flat){
      this.setState({
        curText: item.flatName,
        navStatus: false,
        flat: item.flat
      });
    }
  }
  showNavList(){
    this.setState({
      navStatus: !this.state.navStatus,
    });
  }
  render() {
    const {platform, match} = this.props.userModule;
    var platformList = platform.get('platformItems');
    let _this = this;
    return (
 		<div className="page oredr-page">
      <div className="inner">
        <Header {...this.props}>
          <Back to={'/user'} />
          <h3>游戏记录</h3>
          <div className="flatNav">
            <h4 onClick={this.showNavList.bind(this)}><p>{this.state.curText}<i className={"icon-triangle " +(this.state.navStatus ? 'trans': '') }></i></p></h4>
            <div className={"flatNavItem "+ (this.state.navStatus ? 'show' : '')}>
            {platformList.map(function(item,index){
              return <div key={index} className={"items " + (item.flat == _this.state.flat ? 'active': '') } onClick={_this.changeFlat.bind(_this,item)}>{item.flatName}</div>
            })}
            </div>
          </div>
        </Header>
        <div className="page-body">
          <InfoOrder curFlat={this.state.flat} {...this.props} />
        </div>
        
        <div className="detail-wrap">
          {this.props.children}
        </div>

      </div>
    </div>);
  }
};

function mapStateToProps(state) {
  const {userModule, app} = state;
  return {
    userModule,
    app
  };
}

export default connect(mapStateToProps)(OrderContentContainer);