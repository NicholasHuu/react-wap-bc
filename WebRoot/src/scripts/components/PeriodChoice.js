import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SelectBox from "../components/SelectBox";
class PeriodChoice extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      status : false,
      actIndex : 0,
    }
    
    this.choice = [{
      text : '今天',
      num : 'today'
    },{
      text : '一周内',
      num : 'oneweek'
    },{
      text : '一个月内',
      num : 'onemonth'
    },{
      text : '三个月内',
      num : 'threemonth'
    }];
  }

  periodChange(i,num){
    this.setState({
      actIndex : i
    });
    let {event} = this.props;
    event && event(num);
  }


  render() {
    let choice = this.choice;
    let _this = this;
    let list = this.props.list;
    // 只能传数组
    if (Object.prototype.toString.apply(list) != '[object Array]') {
      list = [];
    }
    let name = this.props.special;
    let selectStatus = this.props.noSelect;
    let typeName = name==1 ? "所有平台" : "所有类型";
    if(list && list.length > 0){
      list.unshift({"value" : "" , "text" : typeName });
    }
    let {onChange} = this.props;
    let value = this.props.type;
    return <div className="period-choice">
      <div className="inner">
        <ul>
          {choice.map((item,index) => {
            let num = item.num;
            return <li key={index + " choice"} onClick={_this.periodChange.bind(_this,index,num)} className={_this.state.actIndex == index ? "active" : ""}>{item.text}</li>
          })}
        </ul>
      </div>

      {selectStatus ? "" : <div className="selectType">
          <div className="selectTypeInner">
             <SelectBox options={list} value={value} onChange={onChange} />
          </div>
        </div>
      }
    </div>;
  }
};

PeriodChoice.defaultProps = {
  event: () => {},
  noSelect: true, // 是否包含 Selectbox 
  list: [], // selectbox 选项
  name: 0, // 
  type: '',
};

PeriodChoice.propTypes = {
  event: PropTypes.func,
  noSelect: PropTypes.bool,
  list: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  name: PropTypes.number,
  type: PropTypes.string
};



export default PeriodChoice