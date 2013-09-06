(function () {
  'use strict';

  var assert = (function () {
    var counter = 0,
    failed = 0;

    var assert = function (condition, message) {
      counter++;

      if (!condition) {
        failed++;
        console.error("Assertion failed: " + message || "no message given.");
      }
    };

    assert.summery = function () {
      console.log(counter-failed + " assertions of " + counter + " passed, " + failed + " failed.");
    };

    return assert;
  })();

  var $ = utils();

  $('#run')[0].addEventListener('click', function (e) {
    e.preventDefault();

    var name = $('form input[name=name]')[0].value;
    var password = $('form input[name=password]')[0].value;

    $('input').css({'transform': 'rotate(20deg)'});
    console.log($.environment());
  });

  //console.log($$('form'));
  //console.log($('form'));

  var test = function () {
    assert($.toType([]) === "array", "");
    assert($.toType({}) === "object", "");
    assert($.toType(function () { return false; }) === "function", "");
    assert($.toType(1.1) === "number", "");

    assert.summery();
  };

  test();
})();
