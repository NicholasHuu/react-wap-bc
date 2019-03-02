import React, {Component, PropTypes} from 'react';
import {getLiveLoginData, getElectGameLoginData, viewSlideArticle} from '../actions/AppAction';
import {buildQuery} from '../utils/url';
import {openGame} from '../utils/site';
import SliderSlick from 'react-slick';
import LoadingComponent from './LoadingComponent';
import {RES_OK_CODE} from '../constants/AppConstant';

const EXTERN_LINK = 1;
const INTERN_LINK = 2;
const GROUP_LINK = 3;
const DETAIL_LINK = 4;
const PROMO_LINK = 5; // 推广页面
class Slider extends LoadingComponent {
  
  constructor(props) {
    super(props);
    this.slider = null;
    this.timer = null;
  }

  componentDidMount() {
    this.autoPlay();
  }

  autoPlay() {
    // if (this.timer) {
    //   clearInterval(this.timer);
    // }
    // let slider = this.slider;
    // this.timer = setInterval(() =>  {
    //   slider.slickNext();
    //   console.log('slide again ');
    // }, 6000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  goDetail(item,module){
    const {app, dispatch, userModule,history,region} = this.props;
    let isLogin = userModule.user.get('auth').get('isLogin');
    console.log(['module', region, isLogin, item, this.props, module]);
    let _this = this;
    if (item.linkType == EXTERN_LINK || item.linkType == PROMO_LINK) {
      let referenwindow = window.open();
      referenwindow.location = item.linkUrl;
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
              console.log(item);
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
          history.push("/elect");
        }
        else if (!isLogin) {
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
          history.push('/sport/hgsport');
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

      } else if (innerLink.typeCode == 'lottery') {
        // 彩票
        if (cateCode == '') {
          history.push('/lottery');
        } else {
          history.push(`/lottery/betcenter/${cateCode}/home`);  
        }
      } else if (innerLink.typeCode == 'card' || innerLink.typeCode == 'fish') {
        // 棋牌游戏
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
    } else if (item.linkType == GROUP_LINK) {
      // 显示文章列表
      let url = `/dynamic/module/${region}`;
      let query = buildQuery({articleType: item.articleType, title: item.bannerName, linkGroupId: item.linkGroupId, moduleId: module.moduleId});
      history.push(url+'?' + query);
    } else if (item.linkType == DETAIL_LINK) {
      // 显示文章详情
      let url = `/dynamic/detail/${region}`;
      dispatch(viewSlideArticle(item.articleId));
      let query = buildQuery({module: 36, article: item.articleId});
      history.push(url+'?' + query);
    } else if (item.linkType == PROMO_LINK) {
      // 推广链接
    }
  }


  render() {
    const {sliders} = this.props;
    if (sliders.length <= 0) return null;
    let _this = this;

    return (
      <div className="slider-con">
        <div className="inner">
          <SliderSlick ref={c => this.slider = c} {...this.props.settings}>
            {sliders && sliders.map( (slider, index) => {
              return <div key={index} onClick={_this.goDetail.bind(_this,slider,slider.articleId)}><img src={slider.imageUrl} /></div>
            })}
          </SliderSlick>
        </div>
      </div>
    );
  }
};

Slider.propTypes = {
  settings: PropTypes.object.isRequired,
  sliders: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired]) 
};
Slider.defaultProps = {
  settings: {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    nextArrow: false,
    prevArrow: false,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
    adaptiveHeight: false,
    lazyLoad: false,
    swipe: true,
    dots : true,
    dotsClass : "banner_dots"
  },
};

export default Slider;