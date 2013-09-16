var Browser = require("zombie");
var assert = require("assert");
var async = require("async");
var _ = require("underscore");

function debug(msg) {
  console.error(msg);
  debugger;
};

// Execute a search given the passed parameters, for now, print the detail ID for the first page of results.
function doSearch(options) {

  console.error("new search: " + JSON.stringify(options));
  var street_address = options['street_address'];
  var assesment_year = options['assesment_year'];
  var county_code = options['county_code'];
  var property_type = options['property_type'];
  delete browser;
  var browser = new Browser({debug: false, windowName: "Firefox", runScripts: false});
  browser.visit(base_url, function() {
    try {
      checks = [browser.query(assesment_year_css), browser.query(county_code_css), browser.query(property_type_css)].map(_.size)
      if(_.min(checks) == 0) {
        console.error("!!! NO SEARCH FORM FOUND !!!");
        return setTimeout(doSearch, 5000, options);
      }
    }
    catch(e) {
      console.error("error on page load: " + e);
      return setTimeout(doSearch, 5000, options);
    }
    browser
      .select(assesment_year_css, assesment_year)
      .select(county_code_css, county_code)
      .select(property_type_css, property_type)
      .fill(street_address_css, street_address)
      .pressButton("Search", function() {
        browser.wait(function() {
          try {
            var detail_links = browser.queryAll(detail_link_css);
            if(detail_links.length) {
              var upper = detail_links.length >= 10 ? 10 : detail_links.length
              for(d in _.range(0, upper)) {
                var id_number = detail_links[d]._attributes._nodes.href._childNodes[0].__nodeValue.split('?ID=')[1]
                console.log( [assesment_year, county_code, property_type, street_address, id_number].join(','));
              }
            }
          }
          catch(e) {
            console.error("error parsing results: " + e);
          }
        });
          return next();
      });
    });
};

var base_url = "http://www.in.gov/apps/dlgftax/Assessment/AssessmentSearch.aspx";

var assesment_year_css = "html body form#form1 div table tbody tr td select#ddlAssesYear";
var assesment_years = _.range(2008, 2013).map(String);

var county_code_css = "html body form#form1 div table tbody tr td select#ddlCounty";
var county_codes = _.range(1,93).map(String);

var property_type_css = "html body form#form1 div table tbody tr td select#ddlPropType";
var property_types = ["1%", "2%", "3%", "4%", "5%", "6%", "8%"];

var street_address_css = "html body form#form1 div table tbody tr td input#txtStreet"
var street_addresses = 'abcdefghijklmnopqrstuvwxyz'.split('');
street_addresses = ['e']

var search_button_css = "html body form#form1 div table tbody tr td input#btnSearch";
var download_link_css= "html body form#form1 div a#btnDownLoad"
var pagnation_table_css = "html body form#form1 div div table#gvResults.datagrid tbody tr td table"

var detail_link_css = "html body form#form1 div div table#gvResults.datagrid tbody tr td a"

var queries = []
for (var sa in street_addresses) {
  for (var ay in assesment_years) {
    for (var cc in county_codes) {
      for (var pt in property_types) {
        queries.push( { assesment_year: assesment_years[ay],
                        county_code: county_codes[cc],
                        property_type: property_types[pt],
                        street_address: street_addresses[sa] } );
      }
    }
  }
}

console.error("Scraping " + queries.length + " pages");
function next() {
  setTimeout(doSearch, 500, queries.pop());
}

next();
