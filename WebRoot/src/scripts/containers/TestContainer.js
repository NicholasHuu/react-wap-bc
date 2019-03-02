import React, {Component, PropTypes} from 'react';

import Card from '../components/Card';
import PosterMsg from '../components/PosterMsg';
import PosterImg from '../components/PosterImg';
import Avatar from '../components/Avatar';

class TestContainer extends Component {
  render() {
    return <div className="test">
      <Card image={'/misc/images/card-sample.png'} 
        title="首存额外赠送25%" 
        summary="涉及和调整任何特定的赛事,游戏软件,涉及和调整任何特定的赛事,游戏软件,涉及和调整任何特定的赛事,游戏软件" />
      <Card image={'/misc/images/card-sample.png'} 
        title="首存额外赠送25%" 
        summary="涉及和调整任何特定的赛事,游戏软件,涉及和调整任何特定的赛事,游戏软件,涉及和调整任何特定的赛事,游戏软件" />

      <Card image={'/misc/images/card-sample.png'} 
        title="首存额外赠送25%" 
        light={true}
        summary="涉及和调整任何特定的赛事,游戏软件" />
      
      <PosterMsg image={'/misc/images/poster.png'}
        title="首存额外赠送25%"/>

      <PosterMsg image={'/misc/images/poster.png'}
        title="首存额外赠送25%"/>

      <PosterImg image={'/misc/images/poster-sample.png'}
        title="首存额外赠送25%"/>

      <PosterImg image={'/misc/images/poster-sample.png'}
        title="首存额外赠送25%"/>

      <Avatar avatar={'/misc/images/avatar-sample.png'} name="电子游戏" />

    </div>
  }
};

export default TestContainer;