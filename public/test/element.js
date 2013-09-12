$(document).ready(function() {

  var utils = window.utils();

  module('element');

  test('remove', function() {

    $('#test').append('<span class="appended-by-jquery">1</span>');
    $('#test').append('<span class="appended-by-jquery">2</span>');
    equal($('.appended-by-jquery').length, 2, 'element appended');

    utils('.appended-by-jquery').remove();
    equal($('.appended-by-jquery').length, 0, 'element removed');
  });

});
