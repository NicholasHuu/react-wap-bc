import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import GameItem from "./GameItem";
import ReactDom from "react-dom";
import { scrollAnimation } from "../utils/dom";
let list_l = [];
class GameItems extends Component {
  constructor(props) {
    super(props);
    this._handleScroll = this._handleScroll.bind(this);
    this.information = {
      card: {
        name: "棋牌游戏",
        id: "qpyx"
      },
      live: {
        name: "真人视讯",
        id: "zrsx"
      },
      cp: {
        name: "彩票游戏",
        id: "cpyx"
      },
      slot: {
        name: "电子游戏",
        id: "dzyx"
      },
      sport: {
        name: "体育赛事",
        id: "tyss"
      }
    };
    this.state = {
      activeIndex: 0,
      list_dom: [],
      scrollHei: 0
    };
  }
  navSwitch(index, groupCode) {
    console.log(index);
    this.setState({
      activeIndex: index
    });
    let anchorElement = document.getElementById(groupCode);
    //let navListHeight = ReactDom.findDOMNode(this.refs.navList).offsetHeight;
    scrollAnimation(0, anchorElement.offsetTop);
  }

  componentDidMount() {
    window.addEventListener("scroll", this._handleScroll);

    this.state.scrollHei = document.documentElement.clientHeight;
  }

  _handleScroll() {
    let arr = [];
    let a = ReactDom.findDOMNode(this.refs.navList).childNodes[0];
    console.log(a);
    for (let i = 0; i < a.childNodes.length; i++) {
      let dom = document.getElementById(
        a.childNodes[i].getAttribute("data-index")
      );
      arr.push(dom.offsetTop);
    }
    console.log(arr);
    let scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    for (let j = 0; j < arr.length; j++) {
      if (scrollTop < arr[j] + 5) {
        this.setState({
          activeIndex: j
        });
        return;
      }
    }
  }

  render() {
    const list = this.props.list;
    if (!list.length) {
      return false;
    }
    let _this = this;
    let gameBrands = {};
    let gameItems = {};
    list.map(item => {
      gameBrands[item.groupCode] = {
        name: item.groupCodeName,
        id: item.groupCode
        //icon: item.smallPic,
        //bg: item.smallBackgroundPic
      };
      gameItems[item.groupCode] = item.list;
    });
    let htmls = [];
    for (let flat in gameBrands) {
      if (!gameItems[flat]) {
        continue;
      }
      htmls.push(
        <div id={flat} key={flat}>
          <GameItem
            {...this.props}
            gameId={flat}
            flatCode={flat}
            gameTitle={gameBrands[flat]}
            gameSubList={gameItems[flat]}
          />
        </div>
      );
    }
    let styleCss = {
      marginBottom: this.state.scrollHei
    };
    return (
      <div>
        <div ref="navList" className="navList">
          <ul className="clearfix">
            {list.map(function(item, index) {
              return (
                <li
                  key={item.groupCode}
                  data-index={item.groupCode}
                  className={index == _this.state.activeIndex ? "active" : ""}
                  onClick={_this.navSwitch.bind(_this, index, item.groupCode)}
                >
                  {item.groupCodeName}
                </li>
              );
            })}
          </ul>
        </div>
        <div ref="itemList" className="itemList" style={styleCss}>
          {htmls}
        </div>
      </div>
    );
  }
}

export default GameItems;
