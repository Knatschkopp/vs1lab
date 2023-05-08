// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    name;
    latitude;
    longitude;   
    hashtag;

    constructor(properties){
        this.name = properties[0];
        this.latitude = properties[1];
        this.longitude = properties[2];
        this.hashtag = properties[3];
    }
    
}

module.exports = GeoTag;
