var Browser = require("zombie");
var assert = require("assert");
var async = require("async");
var _ = require("underscore");

function debug(msg) {
  console.log(msg);
  debugger;
};

var base_url = "http://www.in.gov/apps/dlgftax/Assessment/AssessmentSearch.aspx";

var assesment_year_css = "html body form#form1 div table tbody tr td select#ddlAssesYear";
var assesment_years = ['2008', '2009', '2010', '2011', '2012']

var county_code_css = "html body form#form1 div table tbody tr td select#ddlCounty";
var county_codes = _.range(1,92).map(String);

var property_type_css = "html body form#form1 div table tbody tr td select#ddlPropType";
var property_types = ["1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%"];

var street_address_css = "html body form#form1 div table tbody tr td input#txtStreet"
var street_addresses = 'abcdefghijklmnopqrstuvwxyz'.split('');

var search_button_css = "html body form#form1 div table tbody tr td input#btnSearch";
var download_link_css= "html body form#form1 div a#btnDownLoad"
var pagnation_table_css = "html body form#form1 div div table#gvResults.datagrid tbody tr td table"

var detail_link_css = "html body form#form1 div div table#gvResults.datagrid tbody tr td a"

var letter = "a";
var export_js = "var theForm = document.forms[0]; theForm.__EVENTTARGET = 'btnDownLoad'; theForm.__EVENTARGUMENT = ''; theForm.submit()";

// Visit the search form
Browser.visit(base_url, { debug: true, waitFor: 5000}, function(e, browser, status) {
  console.log("errors:" + e);

  // Handle prompts
  browser.onprompt(function(msg) {
    console.log("prompted");
    console.log(msg);
  });

  // Execute a search given the defined parameters, for now, print the detail ID for the first page of results.
  var street_address = street_addresses[0]
  var assesment_year = assesment_years[0]
  var county_code = county_codes[0]
  console.log(property_types);
  var property_type = property_types[5]
  browser
    .select(assesment_year_css, assesment_year)
    .select(county_code_css, county_code)
    .select(property_type_css, property_type)
    .fill(street_address_css, street_address)
    .pressButton("Search", function() {
      console.log("waiting for search results to render");
      browser.wait(function() {
        console.log("search results rendered");
        var detail_links = browser.queryAll(detail_link_css);
        for(d in _.range(0,9)) {
          var id_number = detail_links[d]._attributes._nodes.href._childNodes[0].__nodeValue.split('?ID=')[1]
          console.log( [assesment_year, county_code, property_type, street_address, id_number].join(','));
        }
        debugger;
      });

  });

});
