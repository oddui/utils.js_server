$(document).ready(function() {

  var utils = window.utils();

  module('ajax');

  //var host = '/';
  var host = 'http://localhost:4567/';
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

  asyncTest('ajax defaults', function() {
    utils.ajax({
      url: host + 'get',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        //console.log(xhr.readyState);
        //console.log(xhr.status);
        //console.log(xhr.statusText);
        equal(this, window, 'default context is window');
        ok(true, 'default type is get');
        ok(true, 'request sent asynchronously by default');
        equal(settings.headers.Accept, 'application/json', 'request dataType is json');
        jsonEqual(response, { key: 'test' }, 'got right response');
        start();
      }
    });
  });

  asyncTest('ajax error callback', function() {
    utils.ajax({
      url: host + 'path_do_not_exist',
      error: function (status, xhr) {
        ok(true, 'error callback triggered');
        equal(status, 'ajax: Unsuccessful request', 'got status ajax: Unsuccessful request');
        equal(xhr.status, 404, 'http 404 not found');
        start();
      }
    });
  });

  asyncTest('ajax timeout', function() {
    utils.ajax({
      url: host + 'get',
      timeout: 1,
      error: function (status) {
        equal(status, 'ajax: Timeout exceeded', 'timed out error callback triggered');
        start();
      }
    });
  });

  test('ajax synchronous get', function() {
    var response = utils.ajax({
      async: false,
      url: host + 'get',
      data: { data: 'test' }
    });
    jsonEqual(response, { key: 'test' }, 'got right response');
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
      type: 'post',
      url: host + 'post',
      data: { data: 'test' },
      success: function (response) {
        jsonEqual(response, { key: 'test' }, 'utils.ajax got right response');
        start();
      },
      contentType: "application/x-www-form-urlencoded"
    });

    stop();
    utils.post(host+'post', { data: 'test' }, function (response) {
        jsonEqual(response, { key: 'test' }, 'utils.post got right response');
        start();
      }, 'json');
  });

  asyncTest('ajax put', function() {
    utils.ajax({
      type: 'put',
      url: host + 'put',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        jsonEqual(response, { key: 'test' }, 'utils.ajax got right response');
        start();
      },
      contentType: "application/x-www-form-urlencoded"
    });

    stop();
    utils.put(host+'put', { data: 'test' }, function (response) {
        jsonEqual(response, { key: 'test' }, 'utils.put got right response');
        start();
      }, 'json');
  });

  asyncTest('ajax delete', function() {
    utils.ajax({
      type: 'delete',
      url: host + 'delete',
      data: { data: 'test' },
      success: function (response, xhr, settings) {
        jsonEqual(response, { key: 'test' }, 'utils.ajax got right response');
        start();
      },
      contentType: "application/x-www-form-urlencoded"
    });

    stop();
    utils['delete'](host+'delete', { data: 'test' }, function (response) {
        jsonEqual(response, { key: 'test' }, 'utils.delete got right response');
        start();
      }, 'json');
  });

  asyncTest('jsonp', function() {
    utils.ajax({
      url: 'http://api.douban.com/shuo/v2/statuses/user_timeline/57825390?alt=xd&count=1&callback=?',
      success: function (response, xhr, settings) {
        ok(true, 'jsonp callback made successful');
        ok(_(xhr.status).isUndefined(), 'is fake xhr object');
        ok(_(window[xhr.callbackName]).isUndefined(), 'callbackName json callback is removed from window');
        start();
      }
    });
  });

});
