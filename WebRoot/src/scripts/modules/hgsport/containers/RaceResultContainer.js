import React , {Component, PropsTypes} from "react";
import {connect} from "react-redux";
import {Link , withRouter} from "react-router";

import Header from '../../../components/Header';
import Back from '../../../components/Back';
import RaceResultGroup from '../components/RaceResultGroup';
import FilterBar from '../../../components/FilterBar';
import NavTabs from '../components/NavTabs';
import DateRange from '../../../components/DateRange';

import {parseQuery} from '../../../utils/url';
import LoadingComponent from '../../../components/LoadingComponent';
import {format} from '../../../utils/datetime';
import {loadRaceResult} from '../actions/RaceResult';
import {loadSportBallItems} from '../actions/HgActionPart';

const DEFAULT_BALL = 'ft';

class RaceResultContainer extends LoadingComponent {

  constructor(props) {
    super(props);

    this.items = [{
      title: '',
    }, {
      title: ''
    }, {
      title: ''
    }];

    let query = parseQuery(location.search);
    if (query.ball) {
      this.defaultBall = query.ball;
      this.ball = this.defaultBall;
    }
    this.onSearchDateChange = this.onSearchDateChange.bind(this);
    this.onBallChange = this.onBallChange.bind(this);
    this.searchDate = format(new Date(), 'Y-m-d');
  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(loadSportBallItems());
  }

  componentWillReceiveProps(nextProps) {
    const {hgsport} = nextProps;
    let raceResults = hgsport.raceresult.get('gameResults');
    this.closeLoading();
    const {location} = nextProps;
    let sportBalls = hgsport.huangguan.get('sportBalls');
    let query = parseQuery(location.search);
    if (query.ball && this.ball != query.ball) {
      this.ball = query.ball;
      this.searchRaceResult();
    } else if (!query.ball){
      if ( Object.keys(sportBalls).length > 0 ) {
        let defaultBall = DEFAULT_BALL;
        console.log(['ball', this.ball, defaultBall]);
        if (this.ball != defaultBall) {
          this.ball = defaultBall;
          this.searchRaceResult();
        }
      }
    }
  }
  searchRaceResult() {
    this.openLoading();
    const {dispatch} = this.props;
    dispatch(loadRaceResult(this.searchDate, this.ball));
  }
  onBallChange(ball) {
    this.openLoading();
    const {dispatch, match, history, location} = this.props;
    let path = match.path;
    let to = {
      pathname: path,
      search: `?ball=${ball}`,
    };
    history.push(to);
  }
  onSearchDateChange(value) {
    this.searchDate = value;
    this.searchRaceResult();
  }
  renderMaintain(msg) {
    return <p className="maintain">{msg}</p>
  }
  ruleLink(){
    const { history , match,location} = this.props;
    let query = parseQuery(location.search);
    if (!query.ball) {
      query.ball = 'ft';
    }
    history.push('/hgsport/rule/' + query.ball);
  }
  render(){
    const {huangguan, raceresult} = this.props.hgsport;
    let results = raceresult.get('gameResults');
    let hasResult = results && results.length > 0;
    let isMaintain = raceresult.get('isMaintain');
    let maintainMsg = raceresult.get('maintainMsg');
    let _this = this;
    return(
      <div className="page hg-page raceresult-page">
        <Header {...this.props}>
          <Back backTo={'/hgsport'} />
          <FilterBar defaultValue={this.ball} options={huangguan.get('sportBalls')} onChange={this.onBallChange} /> 
          <NavTabs />
        </Header>
        <div className="page-body">
          <div className="result-main">
            {isMaintain ? this.renderMaintain(maintainMsg): (
              <div className="data-choice"><DateRange onChange={this.onSearchDateChange}/></div>
            )}

            {  !isMaintain &&  ( hasResult  ? <RaceResultGroup  items={results} />: <p className="warning">当前时间段内暂无数据</p> ) }

          </div>
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
export default connect(mapStateToProps)(RaceResultContainer);