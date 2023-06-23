// File origin: VS1LAB A3

const GeoTagExamples = require('../models/geotag-examples');
const GeoTag = require('../models/geotag');

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #geotags = [];

    fillExamples() {
        GeoTagExamples.tagList.forEach(geotag => {
            this.addGeoTag(new GeoTag(geotag));
        });     
    }

    get taglist() {
        return this.#geotags;
    }

    addGeoTag(tag) {
        this.#geotags.push(tag);
    }

    putGeotag(geotag, id) {
        for(let i = 0; i < this.taglist.length;i++) {
            if(this.#geotags[i].id == id)
                this.#geotags[i] = geotag;
        }
    }

    removeGeoTag(id) {
        this.#geotags = this.#geotags.filter(function(ele){ 
            return ele.id != id; 
        });
    }

    getNearbyGeoTags(location) {
        const radius = 5;
        return this.#geotags.filter(function(ele) {
            return (ele.latitude <= location[0] + radius || ele.latitude >= location[0] - radius)
            && (ele.longitude <= location[1] + radius || ele.longitude >= location[1] - radius)
        });
    }

    searchNearbyGeoTags(location, keyword) {
        const radius = 5;
        return this.#geotags.filter(function(ele) {
            return ((ele.latitude <= location[0] + radius || ele.latitude >= location[0] - radius)
                && (ele.longitude <= location[1] + radius || ele.longitude >= location[1] - radius)
                && (ele.name.includes(keyword) || ele.hashtag.includes(keyword)))
        });
    }

    searchGeotagByID(id) {
        let temp = [];
        for(let i = 0; i < this.taglist.length;i++) {
            if(this.#geotags[i].id == id){
                return(this.#geotags[i]);
            }
        }
        return temp;
   }

}

module.exports = InMemoryGeoTagStore
