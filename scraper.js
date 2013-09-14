var Browser = require("zombie");
var assert = require("assert");
var async = require("async");
var _ = require("underscore");

var base_url = "http://www.in.gov/apps/dlgftax/Assessment/AssessmentSearch.aspx";
var search_button_css = "html body form#form1 div table tbody tr td input#txtStreet";
var letter = "a";
var export_js = "var theForm = document.forms[0]; theForm.__EVENTTARGET = 'btnDownLoad'; theForm.__EVENTARGUMENT = ''; theForm.submit()";

// Visit the search form
Browser.visit(base_url, { debug: true }, function(e, browser, status) {
  console.log("errors:" + e);

  // Execute a search given the defined parameters
  console.log("search: " + letter);
  browser.fill(search_button_css, letter).pressButton("Search", function() {
    console.log("search results rendered");

    // Request download by running the code in export_js
    console.log("requesting download");
    // This is a synchronous function that returns the result. We have to
    // wait on the response.
    browser.evaluate(export_js);
    // The wait should be predicated on some function to look for the response,
    // however, I currently have no idea where to look for it. Just calling the
    // debugger for now.
    browser.wait(function() {
      console.log("download response");
      debugger;
    });

  });

});
