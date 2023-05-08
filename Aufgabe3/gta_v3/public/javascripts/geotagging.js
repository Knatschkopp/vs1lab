// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {

    LocationHelper.findLocation((helper) => {
        
        if (document.getElementById("latitude-tag-input").value == "" && document.getElementById("longitude-tag-input").value == "") {

            /*var latitude = helper.latitude;
            var longitude = helper.longitude;*/
            var {latitude, longitude} = helper;

            document.getElementById("latitude-tag-input").value = latitude;
            document.getElementById("longitude-tag-input").value = longitude;
            document.getElementById("latitude-search-input").value = latitude;
            document.getElementById("longitude-search-input").value = longitude;
            var tag_array = [];
        }

        else {
            var latitude = document.getElementById("latitude-tag-input").value;
            var longitude = document.getElementById("longitude-tag-input").value;
            let taglist_json = document.getElementById("mapView").dataset.tags;
            var tag_array = JSON.parse(taglist_json);       
        }

        console.log(tag_array);

        
        
        var map = new MapManager("2RQuVRrtZduvz97a2IaO3BhbKJL3OIMK");
        var url = map.getMapUrl(latitude, longitude, tag_array);
        document.getElementById("mapView").src = url;
    });

};


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    //alert("Please change the script 'geotagging.js'");
    updateLocation();
});

//ConsumerKey
// 2RQuVRrtZduvz97a2IaO3BhbKJL3OIMK