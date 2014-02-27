/**
 * Social widget
 *
 * Copyright (c) 2014 by Hsiaoming Yang.
 */

var SERVICES = {
  twitter: 'https://twitter.com/intent/tweet?text={title}&url={url}',
  facebook: 'http://www.facebook.com/sharer.php?t={title}&u={url}',
  weibo: 'http://service.weibo.com/share/share.php?title={title}&url={url}'
};
var WEIBO_KEY = 8003029170;

function social(el, prefix) {
  prefix = prefix || el.getAttribute('data-icon-prefix') || 'icon-';
  var title = el.getAttribute('data-text');
  var url = el.getAttribute('data-url') || location.href;
  var showCount = el.getAttribute('data-count');
  WEIBO_KEY = el.getAttribute('data-weibo-key') || WEIBO_KEY;

  var author = {
    twitter: el.getAttribute('data-twitter'),
    facebook: el.getAttribute('data-facebook'),
    weibo: el.getAttribute('data-weibo')
  };

  var counter = {
    twitter: twitterCount,
    facebook: facebookCount,
    weibo: weiboCount
  };

  function createElement(name) {
    if (!author[name]) return;

    var div = document.createElement('div');
    div.className = 'social-button-item social-button-' + name;

    // social icon
    var icon = document.createElement('a');
    icon.className = 'social-button-icon social-button-icon-' + name + ' ' + prefix + name;
    icon.target = '_blank';

    var link = SERVICES[name];

    if (name === 'twitter') {
      link += '&via=' + encodeURIComponent(author[name]);
    } else {
      title = title + ' @' + author[name];
    }

    link = link.replace('{title}', encodeURIComponent(title));
    link = link.replace('{url}', encodeURIComponent(url));
    icon.href = link;

    icon.onclick = function(e) {
      e.preventDefault && e.preventDefault();
      window.open(link, '_blank', 'width=615,height=505');
    };

    div.appendChild(icon);

    var fn = counter[name];
    if (fn && showCount) {
      var span = document.createElement('span');
      div.appendChild(span);
      span.className = 'hide';

      try {
        fn(url, function(c) {
          span.innerHTML = format(c);
          span.className = 'social-button-count';
          span.style.marginLeft = '-' + Math.floor(span.clientWidth / 2) + 'px';
        });
      } catch (e) {
        // query count failed
        div.removeChild(span);
      }
    }
    el.appendChild(div);
    return div;
  }

  createElement('twitter');
  createElement('facebook');
  createElement('weibo');
}

module.exports = social;

/**
 * Format count.
 */
function format(count) {
  var ret = count / 1000000;

  if (ret > 1) {
    return Math.round(ret * 100) / 100 + 'M';
  }

  ret = count / 1000;
  if (ret > 1) {
    return Math.round(ret * 100) / 100 + 'K';
  }

  return count;
}

/**
 * Query facebook share count.
 */
function facebookCount(url, cb) {
  var base = 'https://graph.facebook.com/fql?q=';
  var query = "SELECT share_count FROM link_stat WHERE url = '" + url + "'";
  jsonp(base + encodeURIComponent(query), function(resp) {
    cb(resp.data[0]['share_count']);
  });
}

/**
 * Query twitter tweets count.
 */
function twitterCount(url, cb) {
  var base = 'https://cdn.api.twitter.com/1/urls/count.json?url=';
  jsonp(base + encodeURIComponent(url), function(resp) {
    cb(resp.count);
  });
}

/**
 * Query weibo link count.
 */
function weiboCount(url, cb) {
  var link = 'https://api.weibo.com/2/short_url/shorten.json?source=';
  link += encodeURIComponent(WEIBO_KEY) + '&url_long=';
  link += encodeURIComponent(url);
  jsonp(link, function(resp) {
    var shorturl = resp.data.urls[0].url_short;
    link = 'https://api.weibo.com/2/short_url/share/counts.json?source=';
    link += encodeURIComponent(WEIBO_KEY) + '&url_short=';
    link += encodeURIComponent(shorturl);
    jsonp(link, function(resp) {
      cb(resp.data.urls[0].share_counts);
    });
  });
}

/**
 * Send a jsonp request.
 */
var _jsonpCache = {};
var _jsonpCount = 0;
function jsonp(url, callback) {
  if (_jsonpCache[url]) {
    return callback(_jsonpCache[url]);
  }

  var funcname = '_social_' + _jsonpCount;
  var src;
  if (~url.indexOf('?')) {
    src = url + '&';
  } else {
    src = url + '?';
  }

  var script = document.createElement('script');
  script.src = src + 'callback=' + funcname;
  script.async = true;
  script.defer = true;

  window[funcname] = function(response) {
    _jsonpCache[url] = response;
    callback(response);
  };

  script.onload = function() {
    delete window[funcname];
  };

  setTimeout(function() {
    document.body.removeChild(script);
  }, 1000);

  document.body.appendChild(script);
  _jsonpCount += 1;
}
