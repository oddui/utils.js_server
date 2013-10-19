$(document).ready(function() {

  var utils = window.utils();

  module('common');

  test('toType', function() {
    var type;

    type = utils.toType(document.createElement('div'));
    ok(/^html[a-z]*element$/.test(type));

    type = utils.toType(document.createElement('unknowntag'));
    ok(/^html[a-z]*element$/.test(type));

    type = utils.toType([]);
    equal(type, 'array');

    type = utils.toType({});
    equal(type, 'object');

    type = utils.toType(utils.empty);
    equal(type, 'function');

    type = utils.toType(1.1);
    equal(type, 'number');

    type = utils.toType('Hello World');
    equal(type, 'string');

  });

  test('arrayify', function() {
    var obj = {
      0: 'value1',
      1: 'value2',
      length: 2
    };

    var ary = utils.arrayify(obj);

    equal(utils.toType(ary), 'array', 'turned an object into an array');
    equal(ary[0], 'value1', 'got right value');
    equal(ary[1], 'value2', 'got right value');
    equal(ary.length, 2, 'got right length');
  });

  test('each', function() {
    var currentIndex = 0,
    dom = utils('#test>span'),
    returned = dom.each(function(element, index) {
      equal(this, element, 'element is passed as thisArg');
      equal(index, currentIndex++, 'right index passed in');
    });
    equal(returned, dom, 'returned utils.js dom object');
  });

  test('map', function() {
    var el = document.createElement('dummy'),
    dom = utils('#test>span'),
    returned = dom.map(function(element) {
      equal(this, element, 'element is passed as thisArg');
      return el;
    });
    returned.each(function(element, index) {
      equal(el, element, 'elements are mapped');
    });
  });

});
