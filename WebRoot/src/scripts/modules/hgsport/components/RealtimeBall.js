import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {format} from '../../../utils/datetime';
import {withRouter} from 'react-router-dom';
import {parseQuery} from '../../../utils/url';

import FtSinglePattern from './football/SinglePattern';
import FtTotalScorePattern from './football/TotalScorePattern';
import FtHalfAllPattern from './football/HalfAllPattern';
import FtGuoguanPattern from './football/GuoguanPattern';
import FtBodanPattern from './football/BodanPattern';
import FtHBodanPattern from './football/HBodanPattern';
import FtRollballPattern from './football/RollballPattern';

import BkSinglePattern from './basketball/SinglePattern';
import BkRollballPattern from './basketball/RollballPattern';
import BkGuoguanPattern from './basketball/GuoguanPattern';

class RealtimeBall extends Component {

  constructor(props) {
    super(props);
    this.onBoardCardClick = this.onBoardCardClick.bind(this);
    this.state = {
      viewBoardScore: false,
      renderFinished: false,
    };
    this.query = {};
    this.initQueryParams(props);
  }

  initQueryParams(props) {
    const {location} = props;
    this.query = parseQuery(location.search);
    let timetype = this.timetype = location.pathname.replace('/hgsport', '').replace('/', '');
    if (!this.query.ball) {
      this.query.ball = 'ft';
    }
    if (this.query.ball == 'ft' && !this.query.rType) {
      // 滚球
      if (timetype == 'roll') {
        this.query.rType = 're';
      } else {
        this.query.rType = 'r';  
      }
    }
    if (this.query.ball == 'bk' && !this.query.rType) {
      // 滚球
      if (timetype == 'roll') {
        this.query.rType = 're_main';  
      } else {
        this.query.rType = 'bk_r_main';
      }
      
    }
  }

  componentWillReceiveProps(nextProps) {
    this.initQueryParams(nextProps);
    this.setState({
      viewBoardScore : false
    })
  }

  onBoardCardClick() {
    this.setState({
      viewBoardScore: !this.state.viewBoardScore
    });
    let {statusMemory,title}  = this.props;
    statusMemory(title);
  }
  
  onProductSelect(product) {
    this.props.onProductSelect(product);
  }

  // 渲染球类的比分赔率面板 
  // 不同的球赛 不同的 玩法 有不同的面板
  renderBallBoard(score) {
    let rType = this.query.rType;
    // 足球
    if (this.query.ball == 'ft') {
      if (rType == 'r') {
        return <FtSinglePattern {...this.props} score={score}/>;
      } else if (rType == 'hpd') {
        return <FtHBodanPattern {...this.props} score={score}/>;
      } else if (rType == 'pd') {
        return <FtBodanPattern {...this.props} score={score}/>;
      } else if (rType == 't') {
        return <FtTotalScorePattern {...this.props} score={score}/>;
      } else if (rType == 'f') {
        return <FtHalfAllPattern {...this.props} score={score}/>
      } else if (rType == 'p3') {
        return <FtGuoguanPattern {...this.props} score={score}/>;
      } else if (rType == 're') {
        return <FtRollballPattern {...this.props} score={score}/>;
      }
    } else if (this.query.ball == 'bk') {
      if (rType == 'bk_r_main') {
        return <BkSinglePattern {...this.props} score={score} />
      } else if (rType == 'bk_p3') {
        return <BkGuoguanPattern {...this.props} score={score} />
      } else if (rType == 're_main') {
        return <BkRollballPattern {...this.props} score={score} />
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {title, scoreBoard} = this.props;
    const {preTitle, preScoreBoard} = prevProps;
    if (scoreBoard.length > 0 && scoreBoard != preScoreBoard && !this.state.renderFinished) {
      // 设置高度
      this.setScoreBoardHeight();
      this.setState({
        renderFinished: true
      });
    }
  }

  setScoreBoardHeight() {
    let dom = ReactDom.findDOMNode(this.refs.scoreBoardItems);
    let height = dom.clientHeight;
    dom.style.height = height + 'px';
  }
  
  componentDidMount(){
    let { title } = this.props; 
    let activeName = this.props.hgsport.huangguan.get('activeName');
    if(title == activeName){
      this.setState({
        viewBoardScore: true  
      });
      document.body.scrollTop =  ReactDom.findDOMNode(this.refs.scoreItems).offsetTop;
    }else{
      this.setState({
        viewBoardScore: false  
      });
    }
  }
  render() {
    const state = this.state;
    const {title, scoreBoard} = this.props;
    let icon = 'football';
    if (this.query.ball == 'bk') icon = 'basketball';
    let rType = this.query.rType;
    return (
      <div ref="scoreItems" className={"realtime-wrap " + this.state.renderFinished ? '': 'rendering'}>
        <div className="title-wrap">
          <div className="title" onClick={this.onBoardCardClick}>
            <i className={"icon icon-"+icon}></i>
            <h3>{title}</h3>
            <i className={ "icon " + (state.viewBoardScore ? 'icon-arrow-down': 'icon-arrow-right') }></i>
          </div>
        </div>
        <div ref="scoreBoardItems" className={"score-board-items-wrapper " + ( state.viewBoardScore ? '': 'hideself' ) }>
          {scoreBoard.map((score, index) => {
            return (
              <div key={index} className={"board-card " }>
                <div className="realtime-ball">
                  <div className="title">
                    <div className="misc">
                      { this.query.ball == 'bk' && score.nowsession && <span className="date">{score.nowsession} {score.lasttime} 比分:{score.scoreH}:{score.scoreC}</span>  }
                      { this.query.ball == 'ft' && score.retimeset && <span className="date">{score.retimeset} 比分:{score.scoreH}:{score.scoreC}</span>  }
                      {!score.retimeset && <span className="date">{format(score.matchTime, 'm-d')}</span> }
                      {!score.retimeset && <span className="time">{score.matchTime.split(" ")[1]}</span>}
                      {score.roll == 1 && this.query.ball == 'ft' && <i className="icon-ft-roll"></i>}
                      {score.roll == 1 && this.query.ball == 'bk' && <i className="icon-bk-roll"></i>}
                    </div>
                    <h3>
                      <span className="icon-zhu">主</span>{rType == 're' && score.redcardH > 0 && <span className="sport-red-card">{score.redcardH}</span>} {score.teamH} VS <span className="icon-ke">客</span> {rType == 're'  && score.redcardC > 0 && <span className="sport-red-card">{score.redcardC}</span>} {score.teamC}
                    </h3>
                  </div>
                  <div className="score-board">
                    {this.renderBallBoard(score)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>);
  }
};

RealtimeBall.propTypes = {
  scoreBoard: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onProductSelect: PropTypes.func
};

export default (RealtimeBall);