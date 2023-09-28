// Victoria

let myLat = 48.4284;
let myLong = -123.3656;
let myLocation = new google.maps.LatLng(myLat, myLong);

let map;
let service;
let infoWindowPark; // for park info
let infoWIndowCurrentLocation; // for your Location 

let markers = []; // list of all markers on the map

// when the window loads, intialize the map

window.onload = initializeMap;

// initalize map 
function initializeMap () {

// center map in Vicotria by default 
    map = new google.maps.Map(document.getElementById("map"), {
        center: myLocation,
        zoom:13


    });



    
    searchForParks(myLocation);


    infoWIndowCurrentLocation = new google.maps.InfoWindow();
    infoWindowPark = new google.maps.InfoWindow();


    // Create "Pan to current Location" button 
    // https://developers.google.com/maps/documentation/javascript/geolocation
    const locationButton = document.createElement("button");
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");


    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            infoWindowCurrentLocation.setPosition(pos);
            infoWindowCurrentLocation.setContent("Location found.");
            infoWindowCurrentLocation.open(map);
            map.setCenter(pos);
            searchForParks(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          },
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });
  } // initializeMap
  

  // Error message of Geolocation fails
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }
  
  window.initMap = initMap;

// Search for parks within 5 km
// from 

function searchForParks(Location) {

    let request = {
        location: location,
        radius: "500",
        query: "park"


    };

    service = new google.maps.place.PlaceService(map);
    service.textSearch(request, processParks);

}

// Process Park
function processParks(results, status) {

    if (status ==  google.maps.places.PlacesServiceStatus.OK) {

        deleteMarkers();


        for (let i = 0; i < results.length; i++) {
            let place = results[i];
            console.log(place);
            //createMarker(place);
    
        }

    }


}

//https://developers.google.com/maps/documentation/javascript/examples/place-search#maps_place_search-javascript
function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;
  
    const scaledIcon = {

        url: place.icon,
        scaledSize: new google.maps.Size(30,30),
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)


    }




    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: scaledIcon,
      tittle: place.name
    });
  
    google.maps.event.addListener(marker, "click", () => {
        let contentString = "<h3>" + place.name + "</h3>" + "Rating: >b>" + place.rating + "</b> / 5 <p>" + place.formatted_address + "</p>";

      infowindowPark.setContent(contentString || "");
      infowindowPark.open(map, marker);

    });

    markers.push(marker);

} // createMaker
  

  // Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  
  // Removes the markers from the map, but keeps them in the array.
  function hideMarkers() {
    setMapOnAll(null);
  }
  
  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }
  
  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    hideMarkers();
    markers = [];
  }
  
  
  