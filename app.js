var Browser = require("zombie");
var assert = require("assert");
var async = require("async");

var base_url = "http://www.glycemicindex.com/foodSearch.php?ak=list&food_name_search_type=cn&food_name=&gi_search_type=lte&gi=&gl_search_type=lte&gl=&country=&product_category=&lop=OR&find=Find+Records&page="

var css_selector = "html body.search div table#table1 tbody tr td table#table2 tbody tr td table#table39 tbody tr td table#table42 tbody tr td table#table43 tbody tr td table tbody tr";

var browser = new Browser()

/*
async.map([1, 2, 3], scrapePage, function(err, results) {
  console.log(results.join("\n"));
});
*/

scrapePage(1, function(error, results) {
  console.log(results);
});

function scrapePage(page_no, next) {
  browser.visit(base_url + page_no).
    then(function() {
      var rows = browser.queryAll(css_selector);
      rows.shift();
      async.map(rows, rowToStr, function(err, results) {
        next(null, results.join("\n"));
      });
    }).
    fail(function(error) {
      next(error, null);
    });
}

function rowToStr(row, next) {
  var fields = browser.queryAll("td", row);
  async.map(fields, fieldToStr, function(err, results) {
    next(null, results.join("|"));
  });
}

function fieldToStr(field, next) {
  next(null, browser.text("p", field));
}
