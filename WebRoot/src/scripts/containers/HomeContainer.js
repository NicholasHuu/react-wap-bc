import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Popup from "react-popup";

import StartupSlider from "../components/StartupSlider";
import { appFinishedStartup } from "../utils/site";

import HomeHeader from "../components/HomeHeader";
import Slider from "../components/Slider";
import Marquee from "../components/Marquee";
import MarqueeScroller from "../components/MarqueeScroller";
import QuickSection from "../components/QuickSection";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import FooterMenu from "../components/FooterMenu";
import AdBanner from "../components/AdBanner";
import BulletinNav from "../components/BulletinNav";
import HomeBrick, { handleClick } from "../components/ToyBrick";
import GonggaoPopup from "../components/GonggaoPopup";
import { confirm } from "../utils/popup";
import AppDownloadAd from "../components/AppDownloadAd";
import Card from "../components/Card";

import {
  loadSiteInfo,
  loadDynamicBrick,
  loadLiveSportElectGames,
  loadHome,
  gonggaoOpened
} from "../actions/AppAction";
import LoadingComponent from "../components/LoadingComponent";
import { countMessage } from "../modules/user/actions/Message";

import { LOTTERY_SELECTED_KEY } from "../constants/AppConstant";
import PTR from "../utils/pulltorefresh.js";
import cache from "../utils/cache";
import { loadPlatformItems } from "../modules/user/actions/PlatformTransfer";
const REGION_NAME = "home";

const GONGGAO_TYPE_IMAGE = 2;
const GONGGAO_TYPE_TEXT = 1;

import { staticURL } from "../utils/url";

class HomeContainer extends LoadingComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    //dispatch(loadDynamicBrick());
    //dispatch(loadLiveSportElectGames());
    dispatch(loadHome());
    dispatch(loadPlatformItems());
  }

  componentWillUnmount() {
    const { app, userModule, dispatch } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    this.closeLoading();
    const { app, userModule, dispatch } = this.props;
    let gonggao = app.get("gonggao");
    let hasOpened = app.get("gonggaoHasOpened");
    let _this = this;

    // 文字公告
    if (
      Object.keys(gonggao).length > 0 &&
      gonggao.gonggaoType == GONGGAO_TYPE_TEXT &&
      !hasOpened
    ) {
      if (this.gonggaoPopup) {
        return;
      }
      dispatch(gonggaoOpened());
      this.gonggaoPopup = confirm(
        gonggao.ganggaoContent,
        gonggao.gonggaoName,
        popup => {
          popup.close();
          if (gonggao.linkType == 0) {
            //
          } else {
            handleClick.apply(_this, [gonggao, gonggao.articleId, "gonggao"]);
          }
        },
        {
          ok: gonggao.linkName
        }
      );
    }
  }

  onLotteryClick(item) {
    const { history, isLogin } = this.props;
    // if (isLogin) {
    //   history.push(`/lotterytimes/play?lottery=${item.lotteryCode}`);
    // } else {
    //   history.push(`/login`);
    // }
    history.push(`/lotterytimes/play?lottery=${item.lotteryCode}`);
  }

  addMoreLottery() {
    const { history } = this.props;
    history.push(`/picklottery`);
  }

  renderLotterySection(data) {
    return (
      <div className="lottery-section">
        <div className="wrap">
          <div className="template-type-2 template-type-group">
            {data.map((item, index) => {
              return (
                <Card
                  key={index}
                  image={item.smallPicUrl}
                  title={item.lotteryName}
                  summary={item.remark}
                  onClick={this.onLotteryClick.bind(this, item)}
                  light={false}
                  bg={item.smallBackgroundUrl2}
                  className={""}
                />
              );
            })}
            <Card
              image={"/misc/images/userCenter/icon-circleplus.png"}
              title="添加/删除彩种"
              summary="设置您喜欢的彩种"
              onClick={this.addMoreLottery.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

  renderHomeContent() {
    const { app, dispatch, userModule } = this.props;
    const isLogin = userModule.user.get("auth").get("isLogin");
    let _this = this;
    let homeConfig = app.get("homeConfig");
    if (homeConfig.length <= 0) return null;

    let getTypeConfig = type => {
      let configs = [];
      for (let config of homeConfig) {
        if (config.regionType == type) {
          configs.push(config);
        }
      }

      // 彩票版本特殊处理
      if (type == 7) {
        let cached = cache.get(LOTTERY_SELECTED_KEY);

        if (cached) {
          let prevConfigs = cache.get("home_lottery_configs");
          if (!prevConfigs) {
            prevConfigs = configs;
          }
          // 用服务器最新数据更新本地缓存数据
          for (let conf of configs) {
            for (let item of conf["data"]) {
              let i = 0;
              for (let sitem of cached) {
                if (sitem.lotteryCode == item.lotteryCode) {
                  item.fromUser = sitem.fromUser;
                  cached[i] = item;
                }
                i++;
              }
            }
          }
          // 追加服务器新增配置项
          for (let conf of configs) {
            for (let item of conf["data"]) {
              let found = false;

              for (let sconf of prevConfigs) {
                for (let sitem of sconf["data"]) {
                  if (item.lotteryCode == sitem.lotteryCode) {
                    found = true;
                  }
                }
              }

              if (!found) {
                // 检查item是否已在缓存中
                let i = 0;
                let exist = false;
                for (let cacheItem of cached) {
                  // 若在，则用新数据
                  if (cacheItem.lotteryCode == item.lotteryCode) {
                    item.fromUser = cacheItem.fromUser;
                    cached[i] = item;
                    exist = true;
                    break;
                  }
                  i++;
                }
                // 如不存在，则添加到数组的头部
                if (!exist) {
                  cached.unshift(item);
                }
              }
            }
          }

          // 服务器对列表数据有删除 并且用户没有添加到列表，则从列表删掉
          for (let conf of prevConfigs) {
            for (let item of conf["data"]) {
              let found = false;

              for (let sconf of configs) {
                for (let sitem of sconf["data"]) {
                  if (sitem.lotteryCode == item.lotteryCode) {
                    found = true;
                  }
                }
              }

              // 尝试从缓存列表删除
              if (!found) {
                let i = 0,
                  exist = false;
                for (let cacheItem of cached) {
                  // 被服务器删除的项存在缓存中，并且不是用户手动添加进去 则删掉
                  if (
                    cacheItem.lotteryCode == item.lotteryCode &&
                    !cacheItem.fromUser
                  ) {
                    exist = true;
                  }
                  i++;
                }
                if (exist) {
                  cached.splice(i, 1);
                }
              }
            }
          }

          cache.set(LOTTERY_SELECTED_KEY, cached);
          cache.set("home_lottery_configs", configs);
          return [{ data: cached }];
        }
      }

      // 默认状态 selected=true
      if (type == 7) {
        for (let conf of configs) {
          for (let item of conf["data"]) {
            item.selected = true;
          }
        }
        cache.set("home_lottery_configs", configs);
      }

      return configs;
    };

    let moduleList = getTypeConfig(6);

    // 公告列表
    let messages =
      getTypeConfig(2).length > 0 ? getTypeConfig(2)[0]["data"] : [];
    let msgArray = [];
    for (let msg of messages) {
      msgArray.push(msg["ggName"]);
    }

    // 轮播图
    let sliderItems =
      getTypeConfig(1).length > 0 ? getTypeConfig(1)[0]["data"] : [];
    let sliderImages = [];

    for (let item of sliderItems) {
      sliderImages.push(item["imageUrl"]);
    }
    let components = {
      type_1: (
        <Slider
          region="home"
          key="type_1"
          {...this.props}
          sliders={sliderItems}
          items={sliderItems}
        />
      ),
      type_2: (
        <Link key="type_2" to={"/annoucement"}>
          <MarqueeScroller {...this.props} messages={msgArray} />
        </Link>
      ),
      type_3: (
        <QuickSection
          key="type_3"
          {...this.props}
          links={getTypeConfig(3).length > 0 ? getTypeConfig(3)[0]["data"] : []}
        />
      ),
      type_4: (
        <SiteNav
          key="type_4"
          {...this.props}
          electricMenuItems={
            getTypeConfig(4).length > 0 ? getTypeConfig(4)[0]["data"] : []
          }
        />
      ),
      type_5: (
        <Footer
          key="type_5"
          {...this.props}
          links={getTypeConfig(5).length > 0 ? getTypeConfig(5)[0]["data"] : []}
        />
      ),
      type_7: this.renderLotterySection(
        getTypeConfig(7).length > 0 ? getTypeConfig(7)[0]["data"] : []
      ),
      type_6: moduleList.map((config, index) => {
        if (!config["data"]) return null;
        return (
          <HomeBrick
            key={"type_6-" + index}
            region={"home"}
            dispatch={dispatch}
            history={this.props.history}
            isLogin={isLogin}
            brick={config["data"]}
          />
        );
      })
    };

    // 按照配置顺序排序
    let homeComs = [];
    let key = 0;

    let regionTypes = {};
    for (let config of homeConfig) {
      if (regionTypes[config["regionType"]]) {
        continue;
      } else {
        regionTypes[config["regionType"]] = true;
      }
      homeComs.push(
        <div key={"home:" + key}>
          {components["type_" + config["regionType"]]}
        </div>
      );
      key++;
    }

    return homeComs;
  }

  openGonggao() {
    const { dispatch, app, userModule } = this.props;
    let hasOpened = app.get("gonggaoHasOpened");
    let gonggao = app.get("gonggao");
    return gonggao.gonggaoType == GONGGAO_TYPE_IMAGE && !hasOpened ? (
      <GonggaoPopup {...this.props} info={gonggao} />
    ) : null;
  }

  scrollBodyAndViewHeader() {
    let pageEl = ReactDOM.findDOMNode(this.refs.page);
    let headerEl = pageEl.getElementsByClassName("top-bar-header")[0];
    this.sourceHeaderEl = headerEl.offsetHeight;
    let pageBodyEl = pageEl.getElementsByClassName("page-body")[0];
    let maxScrollToView = window.innerWidth * 0.618;
    if (!headerEl || !pageBodyEl) {
      return;
    }

    let scrollTop = 0;

    let cb = event => {
      scrollTop = window.scrollY;

      window.requestAnimationFrame(animate);
    };

    let animate = time => {
      let opacity =
        1 - ((maxScrollToView - scrollTop) / maxScrollToView).toFixed(2);
      if (window.document.body.offsetHeight - window.innerHeight <= scrollTop) {
        opacity = 1;
      }

      headerEl.style.opacity = opacity;
    };

    // 加事件绑定
    window.removeEventListener("scroll", cb);
    window.addEventListener("scroll", cb);
  }

  setupPullToRefresh(destroy = false) {
    const { dispatch } = this.props;

    PTR.destroyAll();
    if (destroy) {
      return;
    }

    PTR({
      refreshHandler({ close, handler }) {
        dispatch(
          loadHome(() => {
            close();
          })
        );
      }
    });
  }

  componentWillUnmount() {
    this.setupPullToRefresh(true);
  }

  componentDidUpdate() {
    this.scrollBodyAndViewHeader();
    this.setupPullToRefresh();
  }

  render() {
    const { app, userModule, dispatch } = this.props;
    // let appDownloadInfo = app.get('appDownloadInfo');

    return (
      <div className="page home" ref="page">
        <div className="inner">
          <HomeHeader {...this.props}>
            <img src={this.props.app.get("logo")} alt="" />
          </HomeHeader>
          <div className="page-body">
            {this.openGonggao()}
            {this.renderHomeContent()}
            {<AppDownloadAd dispatch={dispatch} app={app} />}
            <FooterMenu />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userModule, app, brick } = state;
  let isLogin = userModule.user.get("auth").get("isLogin");
  return {
    app,
    userModule,
    homeBrick: brick.get(REGION_NAME),
    isLogin
  };
}

export default connect(mapStateToProps)(withRouter(HomeContainer));
