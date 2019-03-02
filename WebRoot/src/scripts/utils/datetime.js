import moment from 'moment';

export function format(date = null, format="Y.m.d HH:mm") {
  
  if (date == null) date = new Date();
  else if (typeof date != 'object') {
    date = moment(date).toDate();
  }
  let year = date.getFullYear();
  let month = ("0" + ( date.getMonth()  + 1 ) ).substr(-2);
  let day = ("0" + date.getDate()).substr(-2);
  let hour = ("0" + date.getHours()).substr(-2);
  let min = ("0" + date.getMinutes()).substr(-2);
  let second = date.getSeconds();
  let strOfDate = "";
  

  strOfDate = format;
  if (hour * 1 < 12) {
    strOfDate = format.replace('Time', 'A');
  } else{
    strOfDate = format.replace('Time', 'P');
  }
  strOfDate = strOfDate.replace("mm", min);
  strOfDate = strOfDate.replace("HH", hour);
  strOfDate = strOfDate.replace("ii", second);
  strOfDate = strOfDate.replace("Y", year);
  strOfDate = strOfDate.replace("m", month);
  strOfDate = strOfDate.replace("d", day);
  
  return strOfDate;
}

export function formatTimer(second) {
  if (second < 0) return 0;

  let day = ~~(second / ( 24 * 60 * 60) );
  second = second - day * 24 * 60 * 60 ;
  let hour = ~~ (second / ( 60 * 60 ) );
  second = second - hour * 60 * 60;
  let min = ~~ (second / 60);
  second = second - min * 60;
  
  // 天
  if (day > 0) day = day + '天';
  else day = '';
  
  // 小时
  if (hour > 0) hour = hour + '小时';
  else hour = '';
  
  // 分钟
  if (min < 10 && min > 0 ) {
    min = '0' + min + '分';
  }
  else if (min <= 0) {
    min = '00' + '分';
  }
  else {
    min += '分';
  }
  
  // 秒
  if (second < 10) second = '0' + second;
  return day + hour + '' + min  + second + '秒';
}

export function DateFromString(str) {
  return moment(str).toDate();
}

export function datePeriod(day) {
  
  if (day == 0) {
    let d = new Date();
    let f = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);

    return {
      to: moment().add(24 * 60 * 60 - 1 ,'seconds').format('YYYY-MM-DD HH:mm:ss'),
      from: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
  }

  return {
    to: moment().format('YYYY-MM-DD HH:mm:ss'),
    from: moment().subtract(day, 'days').format('YYYY-MM-DD HH:mm:ss')
  }
}

function _Timer() {
  
  let timer = null;

  let configer = []; // { interval: xx, cb: xx }  

  let getTimestamp = () => Math.round( new Date().getTime() );

  function _TimerClass() {
    this.startRunTimestap = null;
    this.maxid = 1;
  }

  _TimerClass.prototype.push = function (second, cb) {
    let id = this.maxid + 1;
    this.maxid = id
    configer.push({
      second,
      cb,
      id
    });

    return this;
  }

  _TimerClass.prototype.run = function () {
    if (timer) return ;
    this.startRunTimestap = getTimestamp();
    timer = setInterval(() => {
      for (let item of configer) {
        let shouldRun = ( getTimestamp() - this.startRunTimestap  ) % item.second == 0;

        if (shouldRun) {
          let context = {
            stop: () => {
              let index = 0;
              for (let s of configer) {
                if (s.id == item.id) {
                  configer.splice(index, 1);
                  break;
                }
                index ++;
              }
            },
          };
          item.cb.call(context);
        }
      }
    }, 1);

    return this;
  }

  _TimerClass.prototype.stop = function () {
    // 先停止
    clearInterval(timer);
    configer = [];
    timer = null;
    
    this.run();

    return this;
  };

  return new _TimerClass();

}

export default _Timer().run();