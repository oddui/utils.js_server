$(document).ready(function() {

  var utils = window.utils();

  module('output');

  test('append string', function() {
    utils('#test').append('<span class="appended"></span><span class="appended"></span>');
    equal($('#test>span.appended').length, 2, 'string appended');

    $('.appended').remove();
  });

  test('append one element', function() {
    $('#test').append('<span class="appended"></span><span class="appended"></span>');

    utils('#qunit-fixture').append(utils('#test>.appended')[0]);
    equal($('#qunit-fixture>.appended').length, 1, 'element appended');

    $('.appended').remove();
  });

  test('append an array of elements', function() {
    $('#test').append('<span class="appended"></span><span class="appended"></span>');

    utils('#qunit-fixture').append(utils('#test>.appended'));
    equal($('#qunit-fixture>.appended').length, 2, 'elements appended');

    $('.appended').remove();
  });

});
