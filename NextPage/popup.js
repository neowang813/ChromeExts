// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, tab);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}


var re1 = /(.*).html/;
var re2 = /(.*)_(\d+).html/;
var gurl;

function nextUrl(url) {
  if (re2.test(url)) {
    var n = Number(RegExp.$2)+1;
    return RegExp.$1 + "_" + n + ".html";
  } else if (re1.test(url)){
    return RegExp.$1 + "_2.html";
  } else {
    return url;
  }
}

function prevUrl(url) {
  if (re2.test(url)) {
    var n = Number(RegExp.$2);
    if (n != 2) {
      n=n-1;
      return RegExp.$1 + "_" + n + ".html";
    }
    else {
      return RegExp.$1 + ".html";
    }
  } 
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url, tab) {
   
   
    gurl=url;
    document.getElementById("prev-button").onclick=function(){
      gurl=prevUrl(gurl);
      chrome.tabs.update(tab.id, {url: gurl});
    };
    document.getElementById("next-button").onclick=function(){
      gurl=nextUrl(gurl);
      chrome.tabs.update(tab.id, {url: gurl});
    };
   
   
  });
});
