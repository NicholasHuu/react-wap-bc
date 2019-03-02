export function getDocumentHeight() {
  var body = document.body,
  html = document.documentElement;

  var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  return height;
}

export function dimension(dom) {
    var elmHeight, elmMargin, elm = dom;
    if(document.all) {// IE
        elmHeight = elm.currentStyle.height;
        elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10) ;
    } else {// Mozilla
        elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height').replace('px', '');
        elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom')) ;
    }
    return (elmHeight*1+elmMargin*1);
}
 
export function windowResize(w = null, h = null) {
  if (w && h) {
    window.resizeTo(w, h);
  } else {
    let event = null;
    if (window.CustomEvent) {
      event = new CustomEvent('resize', {});
    } else {
      event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
    }
    window.dispatchEvent(event);
  }
}


export function scrollAnimation(currentY, targetY) {
 // 获取当前位置方法
 // const currentY = document.documentElement.scrollTop || document.body.scrollTop

 // 计算需要移动的距离
 let needScrollTop = targetY - currentY
 let _currentY = currentY
 setTimeout(() => {
   // 一次调用滑动帧数，每次调用会不一样
   const dist = Math.ceil(needScrollTop / 10)
   _currentY += dist
   window.scrollTo(_currentY, currentY)
   // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
   if (needScrollTop > 10 || needScrollTop < -10) {
     scrollAnimation(_currentY, targetY)
   } else {
     window.scrollTo(_currentY, targetY)
   }
 }, 1)
}

