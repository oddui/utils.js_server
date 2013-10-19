$(document).ready(function() {

  var utils = window.utils();

  module('base');

  test('utils base object', function() {

    $('#test>span').each(function() {
      ok(_(utils('#test>span')).contains(this), 'selected correct elements');
    });

    utils('span', document.getElementById('test')).each(function() {
      ok(_(utils('#test>span')).contains(this), 'selected correct elements with context');
    });

    var el = document.getElementById('test');
    ok((utils(el)[0] === el), 'wrapped the element into utils.js dom object');

    $('#test>span').each(function() {
      ok(_(utils(utils.arrayify(el.children))).contains(this), 'turned elements array into utils.js dom object');
    });

    ok(utils('#id-not-exist').length === 0, 'selecting non exist elements returned 0 length array');

  });

});
