import {Map, List} from 'immutable';
import {
  APP_FINISHED_STARTUP,
  REQUEST_PAGE_TEMPLATE,
  SET_GAME_CENTER_TYPE,
  REQUEST_SITE_INFO,
  REQUEST_HOME_ELECTRIC_MENU,
  VIEW_ARTICLE,
  REQUEST_FORM_INFORMATION,
  REQUEST_FORM_NOTICE,
  REQUEST_MAIN_HOME,
  GET_CENTER_GAME_LIST,
  REQUEST_MAIN_GETGONGGAOINFO,
  REQUEST_GONGGAO_OPEN,
  COMPONENT_VIEW_ONCE,
  CLEAN_DYNAMIC_ARTICLE,
  REQUEST_SYSTEM_CODE,
  VIEW_SLIDE_ARTICLE,
  LOTTERY_GROUP} from '../constants/AppConstant';
import {setSiteTitle} from '../utils/site';
import {staticURL} from '../utils/url';

const initState = Map({
  startupSlider: ['/misc/images/slider/slider-1.jpg', '/misc/images/slider/slider-2.jpg', '/misc/images/slider/slider-3.jpg'],
  finishedStartup: false,
  logo: '',
  homeSlider: [],
  lotterySlider: [],
  messages: [],
  onlineContacts:  [ 
    Map({title: '在线客服', icon: 'online-service', link: ''}),
    Map({title: 'QQ客服', icon: 'qq', link: ''}), 
    Map({title: '微信客服', icon: 'wechat', link: ''}), 
    Map({title: '联系我们', icon: 'contact', link: ''})],
  domains: Map({
    main: '615.cc',
    backup: []
  }),
  adBanner: '',
  ggList: [],
  promotionSlider: [],
  companyPromotionSlider: [],
  appDownloadInfo: {
    isOpen: 0
  },
  responsive: ``,
  rule: ``,
  fair: '',
  messengerLink: '',
  pageTemplates: {},
  siteName: '',
  siteFlag: '',
  siteQq: '',
  siteTel: '',
  siteWx: '',
  siteMail: '',
  siteMobile: '',
  gameCenterViewType: '',
  centerGameList : [],
  electricMenuItems: [],
  viewingArticle: {},
  formNotice: {},
  formInformation: [],
  homeConfig: [],
  gonggao: {},
  gonggaoHasOpened : false,
  componentViewOnce: {

  },
  lotteryGroupList: []
});

export default function (state = initState, action) {
  let data = action.data;
  switch (action.type) {
    case COMPONENT_VIEW_ONCE: 
      let viewOnce = state.get('componentViewOnce');
      state = state.set('componentViewOnce', Object.assign({}, viewOnce, {
        [action.data.key]: true
      }));
      return state;
    case REQUEST_GONGGAO_OPEN:
      state = state.set('gonggaoHasOpened', true);
      break;
    case REQUEST_MAIN_GETGONGGAOINFO:
      state = state.set('ggList',data.datas);
      break;
    case APP_FINISHED_STARTUP: 
      state = state.set('finishedStartup', action.data);
      break;

    case REQUEST_MAIN_HOME: 
      state = state.set('homeConfig', action.data.datas);
      break;

    case REQUEST_SITE_INFO:
      let siteInfo = data.datas.siteInfo;
      state = state.set('logo', staticURL(data.datas.logoUrl));
      state = state.set('messengerLink', data.datas.messengerLink);
      state = state.set('siteName', siteInfo.siteName);
      state = state.set('gonggao',data.datas.gonggao);
      setSiteTitle(state.get('siteName'));

      let messages = [];
      data.datas.ggList = data.datas.ggList || [];
      data.datas.ggList.map((gg) => {
        messages.push(gg.ggContent);
      });

      state = state.set('messages', (messages));
      state = state.set('ggList', data.datas.ggList);
      let homeSlider = [];
      data.datas.bannerList = data.datas.bannerList || [];
      for (let banner of data.datas.bannerList) {
        homeSlider.push(staticURL(banner.url));
      }
      state = state.set('homeSlider', (homeSlider));

      let promotionList = [];
      data.datas.promsList = data.datas.promsList || [];
      for (let banner of data.datas.promsList) {
        promotionList.push(staticURL(banner.url));
      }
      state = state.set('promotionSlider', promotionList);

      let lotterySlider = [];
      data.datas.lotteryList = data.datas.lotteryList || [];
      for (let banner of data.datas.lotteryList) {
        lotterySlider.push(staticURL(banner.url));
      }
      state = state.set('lotterySlider', lotterySlider);
      let domains = state.get('domains');
      domains = domains.set('backup', (data.datas.linkList));
      state = state.set('domains', domains);
      state = state.set('siteFlag', data.datas.siteInfo.siteFlag);
      state = state.set('siteQq', data.datas.siteInfo.siteQq);
      state = state.set('siteWx', data.datas.siteInfo.siteWeixin);
      state = state.set('siteMobile', data.datas.siteInfo.siteMobile);
      state = state.set('siteTel', data.datas.siteInfo.siteTel);
      state = state.set('siteMail', data.datas.siteInfo.siteMail);
      state = state.set('adBanner', data.datas.siteInfo.homeAdvertUrl);
      state = state.set('appDownloadInfo', data.datas.appDownloadInfo);

      break;

    case REQUEST_PAGE_TEMPLATE:
      let pageTemplates = state.get('pageTemplates');
      pageTemplates[data.name] = data.datas;
      state = state.set('pageTemplates', Object.assign({}, pageTemplates));
      break;

    case SET_GAME_CENTER_TYPE:
      state = state.set('gameCenterViewType', action.viewType);
      break;

    case GET_CENTER_GAME_LIST:
      state = state.set('centerGameList',action.data.datas);
      break;

    case REQUEST_HOME_ELECTRIC_MENU:
      state = state.set('electricMenuItems', action.data.datas);

      break;

    case VIEW_ARTICLE:
      state = state.set('viewingArticle', action.data);

      break;

    case VIEW_SLIDE_ARTICLE:
      state = state.set('viewingArticle',  action.data.datas);
      break;

    case REQUEST_FORM_NOTICE:
      let resdata = action.data.datas;
      state = state.set('formNotice', resdata.information);
      break;

    case REQUEST_FORM_INFORMATION:
      state = state.set('formInformation', data.datas);    
      break;

    case REQUEST_SYSTEM_CODE:
      state = state.set('systemCode', data.datas.restMap);
    break;

    case LOTTERY_GROUP:
      state = state.set('lotteryGroupList', data.datas);
    break;
  }

  return state;
}