$(document).ready(function() {

  var utils = window.utils();

  module('query');

  test('filter', function() {
    ok(utils('#test>span').filter('#span1').length === 1, 'filtered the right element');
    ok(utils('#test>span').filter('#span1')[0].id === 'span1', 'filtered the right element');
  });

  test('parent', function() {
    var parent = utils('#test')[0];
    utils('#test>span').parent().each(function(el) {
      equal(parent, el, 'got parent');
    });
  });

});
