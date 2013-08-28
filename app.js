var Browser = require("zombie");
var assert = require("assert");

var browser = new Browser();

var url = "http://www.glycemicindex.com/foodSearch.php?ak=list&food_name_search_type=cn&food_name=&gi_search_type=lte&gi=&gl_search_type=lte&gl=&country=&product_category=&lop=OR&find=Find+Records&page=1"

var css_selector = "html body.search div table#table1 tbody tr td table#table2 tbody tr td table#table39 tbody tr td table#table42 tbody tr td table#table43 tbody tr td table tbody";

browser.visit(url).
  then(function() {
    var table = browser.query(css_selector);
    var rows = browser.queryAll("tr", table);

    for(var r in rows) {
      var fields = browser.queryAll("td", rows[r]);

      var text_array = []
      for(var f in fields) {
        var text = browser.text("p", fields[f]);
        text_array.push(text);
      }
      console.log(text_array.join("|"));

    }
    console.log(rows.length);

  }).
  fail(function(error) {
    console.log(error);
  });

