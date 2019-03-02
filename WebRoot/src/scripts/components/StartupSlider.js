import React, {Component, PropTypes} from 'react';

import 'slick-carousel/slick/slick.scss';
import Slider from 'react-slick';

import {appFinishedStartup} from '../actions/AppAction';


class StartupSlider extends Component {

  construtor() {
    //
  }

  finishStartup(index) {
    const {sliderImages, dispatch} = this.props;

    if (index == sliderImages.size - 1 ) {
      dispatch(appFinishedStartup());
    }
  }

  render() {
    const {settings, sliderImages} = this.props;
    return (
      <div className="startup-sliders">
        <Slider {...settings}>
          {sliderImages.map( (url, index) => {
            return <div key={url} onClick={ this.finishStartup.bind(this, index) } className={'startup-slider-item ' + index == sliderImages.length - 1 ? 'last': ''}><img src={url} /></div>
          })}
        </Slider>
      </div>
    );
  }
};

StartupSlider.propTypes = {
  sliderImages: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};

StartupSlider.defaultProps = {
  settings: {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    nextArrow: false,
    prevArrow: false,
    autoplay: false,
    centerMode: false,
    adaptiveHeight: false,
    lazyLoad: false,
    swipe: true,
  }
};

export default StartupSlider;