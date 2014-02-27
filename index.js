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
    if (fn) {
      var span = document.createElement('span');
      div.appendChild(span);

      fn(url, function(c) {
        span.innerHTML = format(c);
        span.className = 'social-button-count';
        span.style.marginLeft = '-' + Math.floor(span.clientWidth / 2) + 'px';
      });
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
