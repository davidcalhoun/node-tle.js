tle.js
------------
Simple service for retriving updated TLEs from an endpoint list of TLEs.  Currently hard-coded to a single Celestrak text file.

Sample request (all GET)
------------
http://localhost:3001/?sat=39418&cb=foo

Sample response
------------
foo({tle:"SKYSAT-1 1 39418U 13066C 14077.46176743 .00002235 00000-0 20655-3 0 3568 2 39418 97.7954 154.5633 0021968 300.1396 59.7626 14.95442366 17493"});

Notes
------------
*	returned tle has new line characters embedded in it, though it’s not obvious here
*	satellite id can be passed in as “sat” or “id”
*	callback can be specified as “cb” or “callback”
*	if no callback is specified, tle_callback will be returned