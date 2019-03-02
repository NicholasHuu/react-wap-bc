export function password(password) {
  let r = /^[A-z0-9]{6,16}$/;
  return r.test(password);
}
  
export function mobileNum(mobile) {
  return mobile.length == 11;
}

export function withdrawalPwd(pwd) {
  let r = /[0-9]{4}/;
  return r.test(pwd);
}

export function name(name) {
  let r = /^[0-9A-z\_\-]{4,16}/;
  return r.test(name);
}

export function mail(text) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(text);
}