scraper
=======

Simple scraper using Zombie.js

This branch is a scraper for the in.gov property tax records page
http://www.in.gov/apps/dlgftax/Assessment/AssessmentSearch.aspx

### Search Form
The page presents a simple search form with the following parameters:
 * Assesment Year --          drop-down select
 * County --                  drop-down select
 * Property Type --           drop-down select
 * Property Owner's Name --   text input
 * Property Street Address -- text input
 * Neighborhood Identifier -- text input

There is a search button that will submit an async request to the server
for some response data -- items described by the search. The input is case
insensitive and validation on the search form is such that you can search for
single characters, thus allowing us to (theoreticaly) describe all possible
responses in 26 searches.

### Search Results
The search button fires inline javascript that sends out a well formed post
request with the query values from the form. Response data is rendered into
the page asynchronously as a pagnated table, with a each row containing a
link to more in depth per-item detail table.

The links to the detail table have an href attribure to the current page
with a single get parameter `ID`. This information is loaded as a new page
rather than asynchronously like the pagnated results. The URL looks like
`http://www.in.gov/apps/dlgftax/Assessment/AssessmentDetail.aspx?ID=[ID]`

The `ID` variable shows signs of just being a sequential index, however,
the search space is rather large, and seems to be filled in starting at
of 8 or 9 decimal digits. Of what we've seen, the botom most record has
been `99995977`, with other records stretching to `112552055`. The population
of Indiana is about 6.5 million. In that context, a 12 million wide stretch of 
sequential `ID` makes reasonable sense when accounting for commercial, industrial,
residential types of property. There are statistical tests that could more clearly
define our search space.

### CSV Export
The page allows for a download of all results, as a CSV file, with
complete rows containing the features in the pagnated results, and the
per item detail page. This download is triggered by inline javascript in
the `href` attribute of the link. This process occours asynchronously

## Crawling Searches

We can successfully generate the proper interactions to fill the search
form out in a minimal fashion (take the default Assesment Year, County,
and Property Type) using a single leter query on the Property Street Address.
There is also functionality to run the javascript needed to async render the
results. Zombie.js API functions fill and clickButton worked out of the box 
on this one.

Right now crawling around is non-existant. For development of the scraping logic,
we're just using the default search parameters and Property Street Address of `a`.

## Scraping Results

Given the rendered results and export link, there are issues with following the
export link. The link's href is inline javascript. `clickLink` will attempt to
execute the related javascript in a new window context, and the script will not 
find the vars it needs to operate on.

Through some exploration of the form object in the window namespace of the page
post-query, I was able to rig up some javascript to execute in the context of
a search results window with `evaluate`. This fires the proper post request for
the csv download.

The main issue at the moment is handling the download response event. At this point
I'm not sure what the event that needs to be handled registers as. I have a suspicion
that it's invoked in a separate window.

TODO
====
Handle the download stream response from the download CSV post request.
 * Look around the windows and other browser internals for the appropriate context
 * Look into events (interactions in the API) like `onalert`, `onconfirm`,
 etc.

Devise a storage mechanism for all the CSV info that will be pulled down.
 * Directory structure?
 * Map into each download, reduce to one big concatenated file?

Efficently crawl through the possible query parameters, calling the scraper to download
the CSV file into the define storage mechanism.
  * Assessment Year (all)
  * County (all)
  * Property Type (all)
  * Property Street Address (a-z)
