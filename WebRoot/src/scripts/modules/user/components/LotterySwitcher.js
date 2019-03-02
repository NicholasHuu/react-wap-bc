import React, {Component, PropTypes} from 'react';


class LotterySwitcher extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      crtLottery: props.defaultLotteryCode
    };
  }

  switchLottery(code, name) {
    let crtLottery = code;
    if (this.state.crtLottery == code || this.props.defaultLotteryCode == code) {
      crtLottery = '';
      name = '';
    }

    this.setState({
      crtLottery
    });
    this.props.lotterySwitched(crtLottery, name);
  }

  render() {
    const {lotteryItems} = this.props;
    let self = this;
    return <div className="lottery-switcher">
        <ul>
          {lotteryItems.map( (item, index) => {
            return (<li key={index} className={ item.lotteryCode == self.state.crtLottery ? 'active':'' } 
              onClick={self.switchLottery.bind(self, item.lotteryCode, item.lotteryName)}>

              <span>{item.lotteryName}</span>

            </li>)
          })}
        </ul>
    </div>
  }

};

LotterySwitcher.propTypes = {
  lotterySwitched: PropTypes.func,
  lotteryItems: PropTypes.array,
  defaultLotteryCode: PropTypes.string,
};

LotterySwitcher.defaultProps = {
  lotterySwitched: () => {},
  lotteryItems: [],
  defaultLotteryCode: ''
};

export default LotterySwitcher;