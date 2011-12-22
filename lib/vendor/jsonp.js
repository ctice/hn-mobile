/*
* Lightweight JSONP fetcher
* Copyright 2010 Erik Karlsson. All rights reserved.
* BSD licensed
*/


/*
 * Modified simple JSONP library from https://github.com/IntoMethod/Lightweight-JSONP
 */

var counter = 1, head, query, key;
var timeoutIds = {};
var requestTimeout = {};

function load(url) {
  var script = document.createElement('script');
  var done = false;
  script.src = url;
  script.async = true;

  script.onload = script.onreadystatechange = function() {
    if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
      done = true;
      script.onload = script.onreadystatechange = null;
      if ( script && script.parentNode ) {
        script.parentNode.removeChild( script );
      }
    }
  };
  if ( !head ) {
    head = document.getElementsByTagName('head')[0];
  }
  head.appendChild( script );
}

exports.get = function(url, params, callbackParam, callback, context, timeout,
                       timeoutCallback) {
  if (!callback) {
    return;
  }

  query = url.indexOf('?') > -1 ? '&' : '?';

  params = params || {};
  for ( key in params ) {
    if ( params.hasOwnProperty(key) ) {
      query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }
  }
  var functionName = "json" + (counter++);
  if (timeout > 0 ) {
    timeoutIds[functionName] = setTimeout(function() {
      requestTimeout[functionName] = true;
      timeoutCallback();
    }, timeout);
  }

  window[ functionName ] = function(data){
    if (requestTimeout[functionName]) {
      delete requestTimeout[functionName];
    } else {
      callback.call(context || this, data);
      clearTimeout(timeoutIds[functionName]);
    }

    try {
      delete window[ functionName ];
    } catch (e) {}
    window[ functionName ] = null;
  };

  load(url + query + callbackParam + "=" + functionName);
  return functionName;
}
