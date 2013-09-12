$(document).ready(function() {

  var utils = window.utils();

  module('base');

  test('utils base object', function() {

    var selector = '#test>span';

    $(selector).each(function() {
      ok(_(utils(selector)).contains(this), 'selected correct elements');
    });

    var el = document.getElementById('test');
    ok((utils(el)[0] === el), 'wrapped the element into utils.js dom object');

    $(selector).each(function() {
      ok(_(utils(utils.arrayify(el.children))).contains(this), 'turned elements array into utils.js dom object');
    });

    ok(utils('#id-not-exist').length === 0, 'selecting non exist elements returned 0 length array');

  });

});
