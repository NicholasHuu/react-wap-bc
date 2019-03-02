import Popup from 'react-popup';

export function alert(msg, title = '提示', cb = null) {
  if (typeof title == 'function') {
    cb = title;
    title = '提示';
  }
  return Popup.create({
    title: title,
    content: msg,
    className: 'popup popup-alert',
    buttons: {
      right: [{
        text: '确定',
        className: 'alert-btn',
        action: (popup) => {
          if (cb) {
            cb(popup);
          } else {
            popup.close();
          }
        }
      }]
    },
    wildClasses: false,
    position(box) {
      const boxRect = box.getBoundingClientRect();
      box.style.marginTop = ( - boxRect.height / 2 ) + 'px';
      box.style.opacity = 1;
    }
  });
}

export function confirm(msg, title = '提示', cb = null, option = {}, cancelCb = (popup) => { popup.close();}) {
  if (typeof title == 'function') {
    option = cb;
    cb = title;
    title = '提示';
  }
    
  if (typeof cancelCb == 'object') {
    option = cancelCb;
    cancelCb = (popup) => { popup.close();};
  }

  if (!option) {
    option = {};
  }

  return Popup.create({
    title: title,
    content: msg,
    className: 'popup popup-confirm ' + option.className,
    closeOnOutsideClick: false,
    buttons: {
      left: [{
        text: '取消',
        className: 'cancel-btn',
        action: (popup) => {
          if (cancelCb) {
            cancelCb(popup);
          } else {
            popup.close();  
          }
        }
      }],
      right: [{
        text: option.ok ? option.ok : '确认',
        className: 'alert-btn',
        action: (popup) => {
          if (cb) {
            cb(popup);
          } else {
            popup.close();
          }
        }
      }],
    },
  });
}

export function message(msg) {
  Popup.create({
    content: msg,
    className: 'popup popup-alert popup-message',
    buttons: {
      right: [{
        action: (popup) => {
          setTimeout(function(){
            popup.close();
          },800)
        }
      }]
    },
    wildClasses: false,
  });
}

export function loading() {
  return Popup.register({
    title: null,
    content: '',
    className: 'popup popup-loading',
    buttons: [],
    wildClasses: false,
    position(box) {
      const bodyRect      = document.body.getBoundingClientRect();
      const scroll        = document.documentElement.scrollTop || document.body.scrollTop;
      const boxRect = box.getBoundingClientRect();
      const winHeight = window.innerHeight;
      
      let bodyHeight = window.innerHeight;

      let left = (bodyRect.width - boxRect.width) / 2;
      let top = (bodyHeight - boxRect.height) /2;
      box.style.position = 'fixed';
      box.style.top = ( winHeight / 2 - 100 ) + 'px';
      //box.style.top  = top + scroll + 'px';
      box.style.left = left + 'px';
      box.style.margin = 0;
      box.style.opacity = 1;
      
      box.className += " animate-loading";
      // console.log([top, box.style.top, bodyRect]);
    }
  });
}