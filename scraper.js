var Browser = require("zombie");
var assert = require("assert");
var async = require("async");
var _ = require("underscore");

var base_url = "http://www.glycemicindex.com/foodSearch.php?ak=list&food_name_search_type=cn&food_name=&gi_search_type=lte&gi=&gl_search_type=lte&gl=&country=&product_category=&lop=OR&find=Find+Records&page=";

var css_selector = "html body.search div table#table1 tbody tr td table#table2 tbody tr td table#table39 tbody tr td table#table42 tbody tr td table#table43 tbody tr td table tbody tr";

var browser = new Browser();

// For now, run the scrapePage function in series over all 2603 pages
var number_of_pages = 2603;
var page_numbers = _.range(number_of_pages);
async.eachSeries(page_numbers, scrapePage, function(error) {
  console.error("Done!");
});

// Take a particular page number, visit the url, use the css selector to get the rows,
// map those rows onto the rowToStr function, and return the results joined by \n
function scrapePage(page_no, next) {
  if(page_no % 100 == 0) {
    console.error("Page " + page_no + "/" + number_of_pages);
  }
  browser.visit(base_url + page_no).
    then(function() {
      var rows = browser.queryAll(css_selector);
      rows.shift();
      async.map(rows, rowToStr, function(err, results) {
        console.log(results.join("\n"));
        next(null);
      });
    }).
    fail(function(error) {
      next(error, null);
    });
}

// Take a particular row, break it down into fields, map those fields onto 
// fieldToStr, and return the results joined by |
function rowToStr(row, next) {
  var fields = browser.queryAll("td", row);
  async.map(fields, fieldToStr, function(err, results) {
    next(null, results.join("|"));
  });
}

// Extract the text in the p tags in a particular field and return it
function fieldToStr(field, next) {
  next(null, browser.text("p", field));
}
