$(document).ready(function() {

  var utils = window.utils();

  module('ajax');

  var host = '/';
  //var host = 'http://localhost:4567/';
  //var host = 'http://localhost:5000/';
  //var host = 'http://utilsjs.herokuapp.com/';

  var jsonEqual = function (actual, expected, message) {
    equal(JSON.stringify(actual), JSON.stringify(expected), message);
  };

  test('serialize parameters', function() {
    var parameters = { key1: 'value1', key2: 'value2' };
    equal(utils.serializeParameters(parameters, '?'), '?key1=value1&key2=value2', 'paramerters serialized in URI');
    equal(utils.serializeParameters(parameters), 'key1=value1&key2=value2', 'paramerters serialized in URI');

    parameters = {};
    equal(utils.serializeParameters(parameters, '?'), '', 'empty paramerters serialized as emtpy string');
  });

  asyncTest('ajax default options', function() {
    utils.ajax({
      url: host + 'get',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        equal(this, window, 'default context is window');
        ok(true, 'default method is get');
        ok(true, 'request sent asynchronously by default');
        equal(settings.headers.Accept, 'application/json', 'request accept is json');
        equal(settings.headers['Content-Type'], 'application/x-www-form-urlencoded', 'request contentType is json');
        jsonEqual(response, { key: 'test' }, 'got right response');
        start();
      }
    });
  });

  asyncTest('ajax success callback', function() {
    utils.ajax({
      url: host + 'get',
      success: function (status, xhr) {
        ok(true, 'success callback called');
        start();
      }
    });
  });

  asyncTest('ajax error callback', function() {
    utils.ajax({
      url: host + 'path_do_not_exist',
      error: function (status, xhr) {
        ok(true, 'error callback called');
        equal(status, 'ajax: unsuccessful request', 'got status ajax: unsuccessful request');
        equal(xhr.status, 404, 'http 404 not found');
        start();
      }
    });
  });

  asyncTest('ajax method option', function() {
    utils.ajax({
      method: 'post',
      url: host + 'post',
      success: function (response, xhr, settings) {
        ok(true, 'method could be set');
        start();
      }
    });
  });

  test('ajax async option', function() {
    var response = utils.ajax({
      url: host + 'get',
      async: false,
      data: { data: 'test' }
    });
    jsonEqual(response, { key: 'test' }, 'async could be set');
  });

  asyncTest('ajax context option', function() {
    utils.ajax({
      url: host + 'get',
      context: document,
      success: function (response, xhr, settings) {
        equal(this, document, 'context could be set');
        start();
      }
    });
  });

  asyncTest('ajax accept option', function() {
    utils.ajax({
      url: host + 'get',
      accept: 'text',
      success: function (response, xhr, settings) {
        equal(settings.headers.Accept, 'text/plain', 'request dataType could be set');
        start();
      }
    });

    stop();
    utils.ajax({
      url: host + 'get',
      accept: 'text/plain',
      success: function (response, xhr, settings) {
        equal(settings.headers.Accept, 'text/plain', 'request dataType could be set with full name');
        start();
      }
    });
  });

  asyncTest('ajax contentType option', function() {
    utils.ajax({
      method: 'post',
      url: host + 'post',
      contentType: 'json',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        equal(settings.headers['Content-Type'], 'application/json', 'request contentType could be set');
        jsonEqual(response, { key: 'test' }, 'got right response');
        start();
      }
    });

    stop();
    utils.ajax({
      method: 'post',
      url: host + 'post',
      contentType: 'application/json',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        equal(settings.headers['Content-Type'], 'application/json', 'request contentType could be set with full name');
        jsonEqual(response, { key: 'test' }, 'got right response');
        start();
      }
    });
  });

  asyncTest('ajax timeout', function() {
    utils.ajax({
      url: host + 'get',
      timeout: 1,
      error: function (status) {
        equal(status, 'ajax: timeout exceeded', 'timed out, error callback called');
        start();
      }
    });
  });

  asyncTest('ajax get', function() {
    utils.ajax({
      url: host + 'get',
      data: { data: 'test' },
      success: function (response) {
        jsonEqual(response, { key: 'test' }, 'utils.ajax got right response');
        start();
      }
    });

    stop();
    utils.get(host + 'get', { data: 'test' }, function (response) {
      jsonEqual(response, { key: 'test' }, 'utils.get got right response');
      start();
    }, 'json');
  });

  asyncTest('ajax post', function() {
    utils.ajax({
      method: 'post',
      url: host + 'post',
      data: { data: 'test' },
      success: function (response) {
        jsonEqual(response, { key: 'test' }, 'utils.ajax got right response');
        start();
      }
    });

    stop();
    utils.post(host+'post', { data: 'test' }, function (response) {
      jsonEqual(response, { key: 'test' }, 'utils.post got right response');
      start();
    });

    stop();
    utils.post(host+'post', { data: 'test' }, function (response, xhr, settings) {
      jsonEqual(response, { key: 'test' }, 'utils.post got right response');
      equal(settings.context, document, 'utils.post sent with optional options');
      start();
    }, { context: document });
  });

  asyncTest('ajax put', function() {
    utils.ajax({
      method: 'put',
      url: host + 'put',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        jsonEqual(response, { key: 'test' }, 'utils.ajax got right response');
        start();
      }
    });

    stop();
    utils.put(host+'put', { data: 'test' }, function (response) {
      jsonEqual(response, { key: 'test' }, 'utils.put got right response');
      start();
    });
  });

  asyncTest('ajax delete', function() {
    utils.ajax({
      method: 'delete',
      url: host + 'delete',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        jsonEqual(response, { key: 'test' }, 'utils.ajax got right response');
        start();
      }
    });

    stop();
    utils['delete'](host+'delete', { data: 'test' }, function (response) {
      jsonEqual(response, { key: 'test' }, 'utils.delete got right response');
      start();
    });
  });

  asyncTest('jsonp', function() {
    var result = utils.ajax({
      url: 'http://api.douban.com/shuo/v2/statuses/user_timeline/57825390?alt=xd&count=1&callback=?',
      success: function (response, xhr, settings) {
        ok(true, 'jsonp callback made successful');
        ok(_(xhr).isNull(), 'xhr set to null');
        ok(_(window[result.callbackName]).isUndefined(), 'jsonp callback deleted');
        ok(!document.contains(result.scriptElement), 'jsonp script element removed');
        start();
      }
    });

    ok(_(window[result.callbackName]).isFunction(), 'jsonp callback defined');
    ok(document.contains(result.scriptElement), 'jsonp script element inserted');
  });

  asyncTest('jsonp timeout', function() {
    var result = utils.ajax({
      url: 'http://api.douban.com/shuo/v2/statuses/user_timeline/57825390?alt=xd&count=1&callback=?',
      timeout: 1,
      error: function (status, xhr) {
        equal(status, 'ajax: timeout exceeded', 'jsonp timed out, error callback called');
        ok(_(xhr).isNull(), 'xhr set to null');
        ok(!window[result.callbackName](), 'jsonp callback set to dummy function');
        ok(!document.contains(result.scriptElement), 'jsonp script element removed');
        start();
      }
    });

    ok(_(window[result.callbackName]).isFunction(), 'jsonp callback defined');
    ok(document.contains(result.scriptElement), 'jsonp script element inserted');
  });

});
