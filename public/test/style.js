$(document).ready(function() {

  var utils = window.utils();

  module('style');

  test('css', function() {
    var utilsObject = utils('#test span');
    utilsObject.css({fontSize: '200%', fontWeight: 'bold'});

    utilsObject.each(function(el, index) {
      equal('200%', el.style.fontSize, 'style applied');
      equal('bold', el.style.fontWeight, 'style applied');
    });
  });

  test('hasClass', function() {
    var utilsObject = utils('#test'),
    el = utilsObject[0];

    ok(!utils.hasClass(el, 'test-class'), 'has class returns right value');
    utilsObject.addClass('test-class');
    ok(utils.hasClass(el, 'test-class'), 'has class returns right value');
  });

  test('addClass', function() {
    var utilsObject = utils('#test'),
    el = utilsObject[0],
    oriClassName = el.className;

    utilsObject.addClass('added-class');
    equal(oriClassName+' added-class', el.className, 'class added');

    oriClassName = el.className;
    utilsObject.addClass('added-class');
    equal(oriClassName, el.className, 'will not add duplicated class');
  });

  test('removeClass', function() {
    var utilsObject = utils('#test'),
    el = utilsObject[0];

    utilsObject.addClass('added-class1 added-class2');
    utilsObject.removeClass('added-class1');
    equal('added-class2', el.className, 'class removed');

    utilsObject.removeClass();
    equal('', el.className, 'will remove all calss when no augument passed');
  });
});
