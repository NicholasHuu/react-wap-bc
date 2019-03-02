import {appFinishedStartup as _afs, setSiteTitle} from '../utils/site';
import * as AppConstant from '../constants/AppConstant';
import {siteInfoAPI, 
  formInputHolderAPI,
  post, 
  get, 
  put, 
  pageTemplateAPI, 
  liveGameUrl, 
  liveGameLoginURL,
  electGameItemsURL,
  promotionListAPI,
  collectGame,
  dynamicBrickAPI,
  dynamicArticleListAPI,
  homeElectricMenuAPI,
  formNoticeAPI,
  mainHomeAPI,
  getCenterListAPI,
  getGonggaoInfoAPI,
  viewSlideArticleAPI,
  authPromoLinkAPI,
  systemCodeAPI,
  viewSlideArticleListAPI,
  lotteryGroupsAPI} from '../utils/url';

import store from 'store';

export function viewOnce(key) {
  return {
    type: AppConstant.COMPONENT_VIEW_ONCE,
    data: {
      key
    },
  };
}

export function gonggaoOpened(data){
  return {
    type: AppConstant.REQUEST_GONGGAO_OPEN,
    data
  };
}

export function authPromoLink(link, cb = () => {}) {
  post(authPromoLinkAPI(), {
    backUrl: link
  })
  .then(res => res.json())
  .then(data => {
    cb(data)
  });
}

export function getGonggaoInfo() {
  return (dispatch) => {
    post(getGonggaoInfoAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_MAIN_GETGONGGAOINFO,
        data
      })
    })
  }
}

export function appFinishedStartup() {
  _afs(true);
  return {
    type: AppConstant.APP_FINISHED_STARTUP,
    data: true
  };
}

export function loadFormInformation() {
  return (dispatch) => {
    post(formInputHolderAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_FORM_INFORMATION,
        data
      });
    });
  };
}

export function loadHome(cb = () => {}) {
  return (dispatch) => {
    post(mainHomeAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_MAIN_HOME,
        data
      });
      cb();
    });
  }
}

function createShortcut(siteInfo) {
  // <link rel="shortcut icon" href="http://yourdomain.com/path/icon57.png" />
  // <link rel="apple-touch-icon" href="http://yourdomain.com/path/icon57.png" />
  // <link rel="apple-touch-icon" sizes="72x72" href="http://yourdomain.com/path/icon72.png" />
  // <link rel="apple-touch-icon" sizes="114x114" href="http://yourdomain.com/path/icon114.png" />
  if (window.initDestopShortcut) {
    return ;
  }
  let links = [{
    href: siteInfo.deskTopUrl,
    ref: 'shortcut icon'
  },{
    href: siteInfo.deskTopUrl,
    ref: 'apple-touch-icon'
  }, {
    href: siteInfo.deskTopUrl,
    sizes: '72x72',
    ref: 'apple-touch-icon'
  }, {
    href: siteInfo.deskTopUrl,
    sizes: '114x114',
    ref: 'apple-touch-icon'
  }];

  for (let linkData of links) {
    let link = document.createElement('link');
    link.rel = linkData.ref;
    if (linkData.sizes) {
      link.sizes = linkData.sizes;
    }
    link.href = linkData.href;
    document.head.appendChild(link);
  }
  window.initDestopShortcut = true;
}

export function loadSiteInfo() {
  return (dispatch, getState) => {
    post(siteInfoAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_SITE_INFO,
        data
      });
      dispatch({
        type: AppConstant.REQUEST_FORM_NOTICE,
        data
      });
        
      createShortcut(data.datas);
      
    });
  };
}

export function loadPageTemplate(name) {
  return (dispatch, getState) => {
    post(pageTemplateAPI(), {
      pageCode: name
    })
    .then(res => res.json())
    .then(data => {
      data.name = name;
      dispatch({
        type: AppConstant.REQUEST_PAGE_TEMPLATE,
        data
      });
    });
  };
}

export function loadLiveSportElectGames(cb = () => {}) {
  return (dispatch, getState) => {
    const {userModule} = getState();
    let isLogin = userModule.user.get('auth').get('isLogin');
    let userName = userModule.user.get('auth').get('userName');
    let postData = {};
    if (isLogin) {
      postData['userName'] = userName
    }

    post(homeElectricMenuAPI(), postData)
    .then( res => res.json())
    .then(data => {

      dispatch({
        type: AppConstant.REQUEST_HOME_ELECTRIC_MENU,
        data
      });

      dispatch({
        type: AppConstant.GET_CENTER_GAME_LIST,
        data,
      });

      dispatch({
        type: AppConstant.REQUEST_LIVE_GAME_ITEMS,
        data
      });

      dispatch(_loadSportItems(data));
      dispatch(_loadElectTypes(data));

      dispatch({
        type: AppConstant.REQUEST_BBIN_ITEMS,
        data: data
      });

      dispatch({
        type: AppConstant.REQUEST_CARDS_ITEMS,
        data: data
      });

      cb();

    });
  };
}

function _loadSportItems(data) {
  return {
    type: AppConstant.REQUEST_SPORT_ITEMS,
    data
  };
}

function _loadElectTypes(data) {
  return {
    type: AppConstant.REQUEST_ELECT_TYPES,
    data
  };
}

export function _collectChange(flat,gameCode,status,callback=function(){},client = 1){
  return (dispatch , getState) => {
    const {userName, password} = getState().userModule.user.get('auth').toObject();
    post(collectGame(), {
      flat,
      userName,
      client,
      gameCode
    })
    .then(res => res.json()) 
    .then(data => {
      callback(data);
    })
  }
}

export function getLiveLoginData(flat, callback = () => {}, gameCode = null) {
  return (dispatch, getState) => {
    const {userName, password} = getState().userModule.user.get('auth').toObject();
    let body = {
      userName,
      flat
    };
    if (gameCode) {
      body = Object.assign(body, {gameCode});
    }
    post(liveGameLoginURL(), body)
    .then(res => res.json())
    .then(data => {
      callback(data);
    });
  }
}

export function getElectGameLoginData(flat, gameCode, callback = () => {}) {
  return (dispatch, getState) => {
    const {userName} = getState().userModule.user.get('auth').toObject();
    post(liveGameLoginURL(), {
      userName,
      flat,
      gameCode
    })
    .then(res => res.json())
    .then(data => {
      callback(data);
    });
  }
}

export function loadElectGameItems(flat, code = 'all', pageNo = 1, pageSize = 10, gameName = '', client = 1,callback = () => {}) {
  return (dispatch, getState) => {
    const {isLogin, userName} = getState().userModule.user.get('auth').toObject();
    let body = {
      flat,
      code,
      client,
      pageSize,
      pageNo
    };
    if(gameName != ""){
      body.gameName = gameName;
    }
    if (isLogin) {
      body.userName = userName;
    }
    post(electGameItemsURL(), body)
    .then(res => res.json())
    .then(data => {
      callback(data.datas.currentPage);
      data.flat = flat;
      data.pageNo = pageNo;
      dispatch({
        type: AppConstant.REQUEST_ELECT_GAME_ITEMS,
        data
      });

    });
  };
}

export function loadPromotionItems() {
  return (dispatch, getState) => {
    post(promotionListAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_PROMOTION_ITEMS,
        data
      });
    });
  };
}

export function setGameCenterViewType(viewType) {
  return {
    type: AppConstant.SET_GAME_CENTER_TYPE,
    viewType
  };

}

export function bodyClass(className) {
  document.body.className += ' ' +  className;
}

export function resetBodyClass(className = '') {
  if (!className || className == '') {
    document.body.className = '';
  } else {
    let exp = new RegExp(className, "g");
    document.body.className = document.body.className.replace(exp, ' ');  
  }
}

export function loadDynamicBrick(regionCode = 'home') {
  return (dispatch, getState) => {
    post(dynamicBrickAPI(), {
      regionCode
    })
    .then(res => res.json())
    .then(data => {
      data.regionCode = regionCode;
      dispatch({
        type: AppConstant.REQUEST_REGION_BRICK,
        data,
      });
    });
  };
}

export function loadDynamicArticleList(articleType, articleId) {
  return (dispatch, getState) => {
    post(dynamicArticleListAPI(), {
      articleType,
      articleId
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_DYNAMIC_ARTICLE_LIST,
        data
      });
    });
  };
}
export function loadSlideArticleList(articleType, linkGroupId) {
  return (dispatch, getState) => {
    dispatch({
      type: AppConstant.CLEAN_DYNAMIC_ARTICLE,
    });
    post(viewSlideArticleListAPI(), {
      articleType,
      linkGroupId
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_DYNAMIC_ARTICLE_LIST,
        data
      });
    });
  };
}
export function loadHomeElectricMenu() {
  return (dispatch, getState) => {
    post(homeElectricMenuAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_HOME_ELECTRIC_MENU,
        data
      });
    });
  };
}

export function viewArticle(article) {
  return {
    type: AppConstant.VIEW_ARTICLE,
    data: article
  };
}
export function viewSlideArticle(articleId) {
  return (dispatch, getState) => {
    post(viewSlideArticleAPI(),{
      articleId
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.VIEW_SLIDE_ARTICLE,
        data
      });
    });
  };
}
export function loadFormNotice(code = null) {
  let body = {};
  if (code) body['panelSn'] = code;
  return (dispatch, getState) => {
    post(formNoticeAPI(), body)
    .then(res => res.json())
    .then(data => {
      if (data.errorCode == AppConstant.RES_OK_CODE) {
        dispatch({
          type: AppConstant.REQUEST_FORM_NOTICE,
          data
        });
      }
    });
  };
}

export function loadSystemCode() {
  return (dispatch, getState) => {
    post(systemCodeAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.REQUEST_SYSTEM_CODE,
        data
      });
    });
  };
}

export function lotteryGroups() {
  return (dispatch, getState) => {
    post(lotteryGroupsAPI())
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: AppConstant.LOTTERY_GROUP,
        data
      });
    });
  };
}