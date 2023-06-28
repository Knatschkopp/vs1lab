const MAX_LENGTH = 5;
var pageNumber = 1;
var lowerBound = (pageNumber - 1) * MAX_LENGTH;
var upperBound = pageNumber * MAX_LENGTH - 1;

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

document.addEventListener("DOMContentLoaded", async () => {

    let taglist_json = document.getElementById("mapView").dataset.tags;
    let geoliste = JSON.parse(taglist_json)
    var maxPages = Math.ceil(JSON.parse(taglist_json).length / MAX_LENGTH);

    let response = await fetch("http://localhost:3000/api/pagination/" + pageNumber, {
        method: "GET"
    });

    updateList(await response.json());

    document.getElementById("pagLabel").innerHTML = `${pageNumber}/${maxPages} (${JSON.parse(taglist_json).length})`;

    document.getElementById("pagBack").addEventListener("click", async function (event) {

        pageNumber--;

        document.getElementById("pagNext").disabled = false;

        taglist_json = document.getElementById("mapView").dataset.tags;
        console.log(taglist_json);
        console.log(pageNumber);
        geoliste = JSON.parse(taglist_json);
        document.getElementById("pagLabel").innerHTML = `${pageNumber}/${maxPages} (${geoliste.length})`;

        lowerBound = (pageNumber - 1) * MAX_LENGTH;
        upperBound = pageNumber * MAX_LENGTH - 1;

        let response = await fetch("http://localhost:3000/api/pagination/" + pageNumber, {
            method: "GET"
        });

        updateList(await response.json());
        
        if(pageNumber <= 1) {
            document.getElementById("pagBack").disabled = true;
            return;
        }       
    })

    document.getElementById("pagNext").addEventListener("click", async function (event) {

        pageNumber++;

        document.getElementById("pagBack").disabled = false;

        taglist_json = document.getElementById("mapView").dataset.tags;
        console.log(taglist_json);
        console.log(pageNumber);
        geoliste = JSON.parse(taglist_json);
        document.getElementById("pagLabel").innerHTML = `${pageNumber}/${maxPages} (${geoliste.length})`;

        lowerBound = (pageNumber - 1) * MAX_LENGTH;
        upperBound = pageNumber * MAX_LENGTH - 1;

        let response = await fetch("http://localhost:3000/api/pagination/" + pageNumber, {
            method: "GET"
        });

        updateList(await response.json());

        if(pageNumber >= maxPages) {
            document.getElementById("pagNext").disabled = true;
            return;
        }
    })

})