// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const InMemoryGeoTagStore = require('../models/geotag-store');
store = new InMemoryGeoTagStore();
store.fillExamples();
setId = 0;

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: store.taglist , 
                        latitudeValue: undefined, 
                        longitudeValue: undefined,
                        taglist_json: JSON.stringify(store.taglist)});
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res, next) => {
  let array = [req.body.nametaginput, req.body.latitudetaginput, req.body.longitudetaginput, req.body.hashtagtaginput];
  tag = new GeoTag(array);
  store.addGeoTag(tag);
  let taglist = store.getNearbyGeoTags([req.body.latitudetaginput, req.body.longitudetaginput]);
  let jsonList = JSON.stringify(taglist);
  res.render('index', {taglist: taglist, 
                      latitudeValue: req.body.latitudetaginput, 
                      longitudeValue: req.body.longitudetaginput,
                      taglist_json: jsonList});
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
  let keyword = req.body.searchtermsearchinput;
  let taglist = store.searchNearbyGeoTags([req.body.latitudesearchinput, req.body.longitudesearchinput], keyword);
  let jsonList = JSON.stringify(taglist);
  res.render('index', { taglist: taglist, 
                        latitudeValue: req.body.latitudesearchinput, 
                        longitudeValue: req.body.longitudesearchinput, 
                        taglist_json: jsonList});
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
  let lat = req.query.lat;
  let long = req.query.long;
  let searchterm = req.query.searchterm;
  let taglist = [];
  if (searchterm != undefined && (lat != undefined && long != undefined)) {
    taglist = store.searchNearbyGeoTags([lat, long], searchterm);

  }
  else if (lat != undefined && long != undefined) {
    taglist = store.getNearbyGeoTags([lat, long]);
  }
  else {
    taglist = store.taglist;
  }
  console.log(taglist);
  res.append("URL", "api/geotags/");
  res.status(200).json(JSON.stringify(taglist));
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
    let name = req.body.name;
    let lat = req.body.lat;
    let long = req.body.long;
    let searchterm = req.body.searchterm;
    let geotag = new GeoTag([name, lat, long, searchterm, setId]);
    store.addGeoTag(geotag);
    res.append("URL", "api/geotags/" + name);
    res.append("Location", "api/geotags/" + setId);
    setId++;
    res.status(201).json(JSON.stringify(geotag));  
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
  let id = req.params.id;
  console.log(id);
  let geotag = store.searchGeotagByID(id);
  res.status(200).json(JSON.stringify(geotag));
})


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  let lat = req.body.lat;
  let long = req.body.long;
  let name = req.body.name;
  let searchterm = req.body.searchterm;
  let id = req.params.id;
  console.log(store.searchGeotagByID(id));
  let geotag = new GeoTag([lat, long, name, searchterm, id]);
  store.putGeotag(geotag, id);
  res.status(202).json(JSON.stringify(geotag));
})


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
  let id = req.params.id;
  let geotag = store.searchGeotagByID(id);
  if (geotag === undefined || store.taglist === undefined)
      res.status(400);
  else {
      store.removeGeoTag(id);
      console.log(store.searchGeotagByID(id))
      res.status(203).json(JSON.stringify(geotag));
  }
})

module.exports = router;
