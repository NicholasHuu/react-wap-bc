
import React , {Component , PropTypes} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from 'react-router';
import {parseQuery} from '../../../utils/url';
import FilterBar from '../../../components/FilterBar';
import Header from '../../../components/Header';
import Back from '../../../components/Back';
import NavTabs from '../components/NavTabs';
import {getSportRule} from '../actions/HgActionPart';
import LoadingComponent from '../../../components/LoadingComponent';
import {loadSportBallItems} from '../actions/HgActionPart';

class RuleContainer extends LoadingComponent{
  constructor(props){
    super(props);
    const {location,match} = this.props;
    this.defaultBall = match.params.type;
    if (!this.defaultBall) {
      this.defaultBall = 'bk';
    }
    this.ball = this.defaultBall;
    this.onBallChange = this.onBallChange.bind(this);
  }
  onBallChange(ball) {
    let {history} = this.props;
    history.push("/hgsport/rule/" + ball);
  }
  componentWillMount(){
    const {dispatch,match} = this.props;
    dispatch(loadSportBallItems());
    let ball = match.params.type;
    this.renderRule(ball);
  }

  renderRule(ball){
    const {dispatch,match} = this.props;
    let ruleCode;
    if(ball == "bk"){
      ruleCode = "basketball";
    }else if(ball == "ft"){
      ruleCode = "football";
    }else{
      return false;
    }
    let _this = this, ruleType = undefined;
    this.openLoading();
    dispatch(getSportRule(ruleCode));
  }

  componentWillReceiveProps(nextProps) {
    const {huangguan} = nextProps.hgsport;
    const {location} = nextProps;
    let ball = nextProps.match.params.type;
    let apiRes = huangguan.get('apiRes');

    if (this.ball != ball) {
      this.renderRule(ball);
    } else {
      this.closeLoading();
    }
    
    this.defaultBall = ball;
    this.ball = this.defaultBall;

  }

  render(){
    const {huangguan} = this.props.hgsport;
    let rule = huangguan.get('sportRule');
    return(
      <div className="hg-page rule-page">
        <Header {...this.props} className="hgsport-header">
          <Back />
          <FilterBar defaultValue={this.ball} options={huangguan.get('sportBalls')} onChange={this.onBallChange} />
        </Header>
        
        <div className="page-body">
          <div dangerouslySetInnerHTML={{__html: rule}}></div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state){
  const {app, userModule, hgsport} = state;
  return {
    app, userModule, hgsport
  };
}

export default connect(mapStateToProps)(withRouter(RuleContainer));


