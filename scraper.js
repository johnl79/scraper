var Browser = require("zombie");
var assert = require("assert");
var async = require("async");
var _ = require("underscore");

var base_url = "http://www.in.gov/dlgf/4931.htm";
var download_css_path = "html body form#form1 div a#btnDownLoad"

var browser = new Browser({ debug: true });
var letter = "a"
console.error("Search: " + letter);
browser.visit(base_url).
  then(function() {
    console.log("Visited!");

    /*
    browser
      .fill("Property Street Address", letter)
      .pressButton("Search", function() {
          console.log("Searched!");
          browser.clickLink("Download", function() {
          console.log("What the what?");
        })
      })
    */

  }).
  fail(function(error) {
    next(error, null);
  });
