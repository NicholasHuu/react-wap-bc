import React, {Component, PropTypes} from 'react';

import Card from './Card';
import PosterImg from './PosterImg';
import PosterMsg from './PosterMsg';
import Avatar from './Avatar';
import {alert} from '../utils/popup';
import {RES_OK_CODE} from '../constants/AppConstant';
import {buildQuery} from '../utils/url';
import {openGame} from '../utils/site';
import {loading} from '../utils/popup';
import Popup from 'react-popup';
import {getLiveLoginData, getElectGameLoginData, viewArticle, viewSlideArticle, authPromoLink} from '../actions/AppAction';

const EXTERN_LINK = 1;
const INTERN_LINK = 2;
const GROUP_LINK = 3;
const DETAIL_LINK = 4;
const PROMO_LINK = 5; // 活动页面
const OPEN_NEW_BLANK = 2; // 新窗口打开
const OPEN_TOP_BLANK = 1; // 本级窗口打开

export function renderTemplateType1(items, article, handleClick = () => {}, context = null) {
  if (!context) {
    context = this;
  }
  return (
    <div className="template-type-1 template-type-group">
      {items.map( (item, index) => {
        return <Card key={index} 
          onClick={handleClick.bind(context, item, article)}
          bg={item.smallBackgroundUrl2}
          title={item.articleTitle}
          image={item.articleSmallImages || '../misc/images/placeholder/95x40.jpg'}
          summary={item.articleSubTitle} />
      })}
    </div>
  );
}

export function renderTemplateType2(items, article, handleClick = () => {}, context = null) {
  if (!context) {
    context = this;
  }
  return <div className="template-type-2 template-type-group">
    { items.map( (item, index) => {
      return <Card key={index} 
        light={true}
        bg={item.smallBackgroundUrl2}
        onClick={handleClick.bind(context, item, article)}
        title={item.articleTitle}
        image={item.articleSmallImages || '../misc/images/placeholder/43x33.jpg'}
        summary={item.articleSubTitle} />
    })}
  </div> 
}

export function renderTemplateType3(items, article, handleClick = () => {}, context = null) {
  if (!context) {
    context = this;
  }
  return <div className="template-type-3 template-type-group">
    { items.map( (item, index) => {
        return <Card key={index} 
          light={true}
          bg={item.smallBackgroundUrl2}
          onClick={handleClick.bind(context, item, article)}
          title={item.articleTitle}
          image={item.articleSmallImages || '../misc/images/placeholder/43x33.jpg'} />
      })
    }
  </div>
}

export function renderTemplateType4(items, article, handleClick = () => {}, context = null) {
  if (!context) {
    context = this;
  }
  return <div className="template-type-4 template-type-group">
    { items.map( (item, index) => {
        return <PosterMsg key={index} 
          bg={item.smallBackgroundUrl2}
          title={item.articleTitle}
          onClick={handleClick.bind(context, item, article)}
          image={item.articleSmallImages} />
      })
    }
  </div>
}

export function renderTemplateType5(items, article, handleClick = () => {}, context = null) {
  if (!context) {
    context = this;
  }
  return <div className="template-type-5 template-type-group">
    { items.map( (item, index) => {
        return <PosterImg key={index} 
          bg={item.smallBackgroundUrl2}
          onClick={handleClick.bind(context, item, article)}
          image={item.articleSmallImages} />
      })
    }
  </div>
}

export function renderTemplateType6(items, article, handleClick = () => {}, context = null) {
  if (!context) {
    context = this;
  }
  return <div className="template-type-6 template-type-group">
  { items.map( (item, index) => {
      return <Avatar key={index} 
        bg={item.smallBackgroundUrl2}      
        name={item.articleTitle}
        onClick={handleClick.bind(context, item, article)}
        avatar={item.articleSmallImages || '../misc/images/placeholder/3x1.jpg'} />
    })
  }
  </div>
}

export function getRenderMethod(moduleType) {
  switch (moduleType) {
    case 1:
      return renderTemplateType1;
    case 2: 
      return renderTemplateType2;
    case 3: 
      return renderTemplateType3;
    case 4: 
      return renderTemplateType4;
    case 5: 
      return renderTemplateType5;
    case 6: 
      return renderTemplateType6;
  }
}

export function handleClick(item, module, clickFrom = '') {
  const {isLogin, dispatch, history, region} = this.props;
  let _this = this;
  if (item.linkType == EXTERN_LINK) {
    window.location.href = item.linkUrl;
  } else if (item.linkType == INTERN_LINK) {

    //let innerLink = item.innerLink; -- 老版本数据结构
    let innerLink = {
      typeCode: item.typeCode,
      gameCode: item.gameCode,
      cateCode: item.cateCode
    };

    let cateCode = innerLink.cateCode;
    let gameCode = innerLink.gameCode;
    let typeCode = innerLink.typeCode;
    let windowReference;

    if (innerLink.typeCode == 'live') {
      // 真人
      if (cateCode == "") {
        history.push("/live");
      }
      else if (!isLogin) {
        alert('请先登录');
      } else {
        _this.openLoading();
        dispatch(getLiveLoginData(cateCode, (data) => {
          _this.closeLoading();
          if (data.errorCode != RES_OK_CODE) {
            alert(data.msg);
          } else {
            windowReference = window.open();
            if (item.cateCode == 'sa') {
              openGame(`/user/saLogin?url=${data.datas}`);
            } else {
              openGame(data.datas);
            }
          }
        }, gameCode));
      }
    } else if (innerLink.typeCode == 'electronic') {
      // 电子游戏
      if (cateCode == "") {
        history.push('/elect');
      } else if (gameCode == "") {
        history.push('/elect/game/'+cateCode+'/all');
      } else if (!isLogin) {
        alert('请先登录');
      } else {
        _this.openLoading();
        dispatch(getElectGameLoginData(cateCode, gameCode, (data) => {
          _this.closeLoading();
          if (data.errorCode != RES_OK_CODE) {
            alert(data.msg);
          } else {
            openGame(data.datas);
          }
        }));
      }
    } else if (innerLink.typeCode == 'sport') {
      if (cateCode == "") {
        history.push("/sport");
      }
      else if (cateCode == 'sb' || cateCode == 'sbt') {
        // 沙巴体育
        if (!isLogin) {
          alert('请先登录');
        } else {
          _this.openLoading();
          dispatch(getLiveLoginData(cateCode, (data) => {
            _this.closeLoading();
            if (data.errorCode == RES_OK_CODE) {
              openGame(data.datas);
            } else {
              alert(data.msg);
            }
          }));
        }
      } else if (cateCode == 'huangguan') {
        // 皇冠体育
        history.push('/hgsport');
      }
    } else if (innerLink.typeCode == 'lottery') {
      // 彩票
      if (!isLogin) {
        alert('请先登陆');
      } else {
        if (cateCode == '') {
          //history.push(`/lotterytimes/play?lottery=${cateCode}`);
        } else {
          history.push(`/lotterytimes/play?lottery=${cateCode}`);  
        }
        
      }
    } else if (innerLink.typeCode == 'beitou') {

      if (!isLogin) {
        //alert('请先登陆');
        history.push('/login');
      } else {
        if (cateCode == '') {
          history.push(`/game`);
        } else {
          history.push(`/lotterytimes/play?lottery=${cateCode}`);
        }
      }

    } else if (innerLink.typeCode == 'card' || innerLink.typeCode == 'fish') {
      // 棋牌游戏
      if (cateCode == "") {
        history.push(`/cards`);
      } else {
        if (!isLogin) {
          alert('请先登录');
        } else {
          _this.openLoading();
          dispatch(getLiveLoginData(cateCode, (data) => {
            _this.closeLoading();
            if (data.errorCode == RES_OK_CODE) {
              openGame(data.datas);
            } else {
              alert(data.msg);
            }
          }, gameCode));
        } 
      }
    } else if (innerLink.typeCode == 'bbin') {
      // 波音游戏
      if (cateCode == "") {
        history.push(`/bbin`);
      } else {
        if (!isLogin) {
          alert('请先登录');
        } else {
          _this.openLoading();
          dispatch(getLiveLoginData(cateCode, data => {
            _this.closeLoading();
            if (data.errorCode == RES_OK_CODE) {
              openGame(data.datas);
            } else {
              alert(data.msg);
            }
          }, gameCode));
        }
      }
    } 
  } else if (item.linkType == GROUP_LINK) {
    // 显示文章列表
    let url = `/dynamic/module/${region}`;
    
    let query = buildQuery({articleType: item.articleType, title: item.articleTitle, articleId: item.articleId, moduleId: module.moduleId});

    if (item.linkGroupId) {
      // 公告弹窗
      query = buildQuery({articleType: item.articleType, title: item.articleTitle, linkGroupId: item.linkGroupId, moduleId: module.moduleId});
    }
    history.push(url+'?' + query);
  } else if (item.linkType == DETAIL_LINK) {
    // 显示文章详情
    let url = `/dynamic/detail/${region}`;
    // 公告弹窗
    if ( clickFrom == 'gonggao') {
      let url = `/dynamic/detail/${region}`;
      dispatch(viewSlideArticle(item.articleId));
      let query = buildQuery({module: 36, article: item.articleId});
      history.push(url+'?' + query);
    } else {
      dispatch(viewArticle(item));
      let query = buildQuery({module: module.moduleId, article: item.articleId});
      history.push(url+'?' + query);
    }

  } else if (item.linkType == PROMO_LINK) {
    // 推广链接
    authPromoLink(item.linkUrl, (data) => {
      if (data.errorCode == RES_OK_CODE ) {
        let url = data.datas.backUrl;
        window.location.href = url;
      } else {
        alert(data.msg);
      }
    });
  }
}

class HomeBrick extends Component {

  constructor(props) {
    super(props);
    this.loadingUI = null;
  }

  closeLoading() {
    Popup.close(this.loadingUI);
  }

  openLoading() {
    this.loadingUI = loading();
    Popup.queue(this.loadingUI);
  }

  render() {
    const {brick} = this.props;
    let _this = this;

    return ( <div className="dynamic-templates">
      <div className="wrap">
        {brick.map( (article, index) => {
          if (article.article.length <= 0) return null;
          let renderMethod = getRenderMethod(article.moduleType);
          return <div className="dynamic-group" key={index}>
            {renderMethod(article.article, article, handleClick, _this)}
          </div>
        })}
    </div></div> );
  }
}

HomeBrick.propTypes = {
  brick: PropTypes.array,
  isLogin: PropTypes.bool,
  dispatch: PropTypes.func,
  history: PropTypes.object,
  region: PropTypes.string.isRequired
};

export default HomeBrick;