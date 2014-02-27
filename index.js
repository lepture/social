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

function social(el, prefix) {
  prefix = prefix || 'icon-';

  var title = el.getAttribute('data-text');
  var url = el.getAttribute('data-url') || location.href;

  var author = {
    twitter: el.getAttribute('data-twitter'),
    facebook: el.getAttribute('data-facebook'),
    weibo: el.getAttribute('data-weibo')
  };

  var counter = {
    twitter: twitterCount,
    facebook: facebookCount
  };

  function createElement(name) {
    if (!author[name]) return;

    var text = title + '@' + author[name];

    var div = document.createElement('div');
    div.className = 'social-button-item social-button-' + name;

    div.onclick = function(e) {
      e.preventDefault && e.preventDefault();
      share(SERVICES[name], text, url);
    };

    // social icon
    var span = document.createElement('span');
    span.className = 'social-button-icon ' + prefix + name;
    div.appendChild(span);

    var fn = counter[name];
    if (fn) {
      span = document.createElement('span');

      fn(url, function(c) {
        span.innerHTML = c;
      });

      span.className = 'social-button-count';
      div.appendChild(span);
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
 * Alert for sharing.
 */
function share(link, title, url) {
  link = link.replace('{title}', encodeURIComponent(title));
  link = link.replace('{url}', encodeURIComponent(url));
  window.open(link, '_blank', 'width=615,height=505');
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
  var base = 'http://urls.api.twitter.com/1/urls/count.json?url=';
  jsonp(base + encodeURIComponent(url), function(resp) {
    cb(resp.count);
  });
}

/**
 * Send a jsonp request.
 */
function jsonp(url, callback) {
  var funcname = '_social_' + new Date().valueOf();

  window[funcname] = function(response) {
    callback(response);
  };

  if (~url.indexOf('?')) {
    url += '&';
  } else {
    url += '?';
  }
  url += 'callback=' + funcname;

  var script = document.createElement('script');
  script.src = url;
  script.onload = function() {
    document.body.removeChild(script);
    delete window[funcname];
  };
  document.body.appendChild(script);
}
