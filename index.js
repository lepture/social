/**
 * Social Button
 *
 * Copyright (c) 2014 by Hsiaoming Yang.
 */

var SERVICES = {
  twitter: 'https://twitter.com/intent/tweet?text={text}&url={url}',
  facebook: 'http://www.facebook.com/sharer.php?t={text}&u={url}',
  weibo: 'http://service.weibo.com/share/share.php?title={text}&url={url}'
};
var WEIBO_KEY = 8003029170;

function social(el, options) {
  options = options || {};
  var prefix = options.prefix || el.getAttribute('data-prefix') || 'icon-';
  var text = options.text || el.getAttribute('data-text');
  var url = options.url || el.getAttribute('data-url') || location.href;
  var image = options.image || el.getAttribute('data-image');
  var showCount = options.count || el.getAttribute('data-count');
  WEIBO_KEY = options.weiboKey || el.getAttribute('data-weibo-key') || WEIBO_KEY;

  var author = {
    twitter: options.twitter || el.getAttribute('data-twitter'),
    facebook: options.facebook || el.getAttribute('data-facebook'),
    weibo: options.weibo || el.getAttribute('data-weibo')
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
    icon.setAttribute('aria-label', 'Share to ' + name);
    icon.setAttribute('title', 'Share to ' + name);
    icon.target = '_blank';

    var link = SERVICES[name];
    var data = text;

    if (name === 'twitter') {
      link += '&via=' + encodeURIComponent(author[name]);
    } else {
      data = text + ' via @' + author[name];
    }

    link = link.replace('{text}', encodeURIComponent(data));
    link = link.replace('{url}', encodeURIComponent(url));

    if (name === 'weibo' && image) {
      link += '&pic=' + encodeURIComponent(image);
    }
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

      // count same urls
      var sameAs = el.getAttribute('data-sameas');
      sameAs = sameAs ? sameAs.split(/\s+/) : [];
      sameAs.push(url);

      try {
        mapCount(sameAs, fn, function(c) {
          span.innerHTML = format(c);
          span.className = 'social-button-count';
          setTimeout(function() {
            span.style.marginLeft = '-' + Math.floor(span.clientWidth / 2) + 'px';
          }, 300);
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
 * A simple async map count
 */
function mapCount(urls, fn, cb) {
  var len = urls.length;
  var completed = 0;
  var running = 0;
  var results = [];

  while (running < len && completed < len) {
    fn(urls[running], function(c) {
      completed += 1;
      results.push(c);
      if (completed === len) {
        var ret = 0;
        for (var i = 0; i < results.length; i++) {
          ret += results[i];
        }
        cb(ret);
      }
    });
    running += 1;
  }
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
  if (location.protocol === 'http:') {
    base = 'http://urls.api.twitter.com/1/urls/count.json?url=';
  }
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
