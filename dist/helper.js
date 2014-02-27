function queryclass(name) {
  if (document.querySelectorAll) {
    return document.querySelectorAll('.' + name);
  }
  if (document.getElementsByClassName) {
    return document.getElementsByClassName(name);
  }
  var els = document.getElementsByTagName('div');
  var ret = [];
  for (var i = 0; i < els.length; i++) {
    if (els[i].className.split(' ').indexOf(name)) {
      ret.push(els[i]);
    }
  }
  return ret;
}
var els = queryclass('social-button');
for (var i = 0; i < els.length; i++) {
  social(els[i]);
}
