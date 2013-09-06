$(document).ready(function() {

  var utils = window.utils();

  module('base');

  test('utils base object', function() {

    var selector = '#test>span';

    $(selector).each(function() {
      ok(_.contains(utils(selector), this), 'selected correct elements');
    });

    var el = document.getElementById('test');
    ok(($(el)[0] === el), 'wrapped the element into elements array');

  });

});
