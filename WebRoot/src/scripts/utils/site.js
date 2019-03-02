import kizzy from 'kizzy';

const user = kizzy('user');

export function appFinishedStartup(finished = null) {
  if (finished == null) {
    return user.get('finished_startup')
  } else {
    user.set('finished_startup', finished);
    return finished;
  }
}

export function setSiteTitle(name) {
  window.document.title = name;
}

export function openGame(url) {
  window.location.href = url;
}