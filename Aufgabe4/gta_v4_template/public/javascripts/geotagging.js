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
        
        var map = new MapManager("2RQuVRrtZduvz97a2IaO3BhbKJL3OIMK");
        var url = map.getMapUrl(latitude, longitude, tag_array);
        document.getElementById("mapView").src = url;
    });

};

async function add(newGeotag){
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newGeotag),
    });
    return await response.json();
}

function getMap(geotags) {
    let map = new MapManager("2RQuVRrtZduvz97a2IaO3BhbKJL3OIMK");
    let latitude = document.getElementById("latitude-tag-input").value;
    let longitude = document.getElementById("longitude-tag-input").value;
    let url = map.getMapUrl(latitude, longitude, JSON.parse(geotags));
    document.getElementById("mapView").src = url;
    return geotags;
}

function updateList(geoliste) {
    let list = JSON.parse(geoliste); // parse input string to json
    let latitude = document.getElementById("latitude-tag-input").value;
    let longitude = document.getElementById("longitude-tag-input").value;
    let ul = document.getElementById("discoveryResults");
    ul.innerHTML = "";

    list.forEach(function (gtag){
        let li = document.createElement("li");
        li.innerHTML = gtag.name + "</br> (" + latitude + "," + longitude + ") </br>" + gtag.hashtag;
        li.classList.add("listElement");
        ul.appendChild(li);
    })
}

async function getTagList(searchterm){
    let latitude = document.getElementById("latitude-tag-input").value;
    let longitude = document.getElementById("longitude-tag-input").value;
    let geotags = await fetch("http://localhost:3000/api/geotags?lat=" + latitude +"&long=" + longitude + "&searchterm=" + searchterm, {
        method: "GET",
    });
    //keine Ahnung was da nicht geht
    return await geotags.json();
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    //alert("Please change the script 'geotagging.js'");
    updateLocation();

    document.getElementById("tag-form").addEventListener("submit", async function (event) {
        let geoTag = {
            latitude: parseFloat(this.getElementById("latitude-tag-input").value),
            longitude: parseFloat(document.getElementById("longitude-tag-input").value),
            name: document.getElementById("name-tag-input").value,
            searchterm: document.getElementById("Hashtag-tag-input").value
        }
        add(geoTag)
        .then(getMap)
        .then(updateList)
        .catch(error => console.error(error));
        event.preventDefault();
    });

    document.getElementById("discoveryFilterForm").addEventListener("submit", function (event) {
        let searchterm = document.getElementById("searchterm-search-input").value;
        getTagList(searchterm)
        .then(getMap)
        .then(updateList)
        .catch(error => console.error(error));
        event.preventDefault();
    });

});

//ConsumerKey
// 2RQuVRrtZduvz97a2IaO3BhbKJL3OIMK