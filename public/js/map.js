var map = L.map('map');
//for eventlisteners and location to use
var geojson, lng, lat;

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibXJpbmdlbCIsImEiOiJjaWd5bmljcm4wdmk2dmttNXg1ZGd3ODM5In0.GbAVcFSt6FWimnWc0XvsLw', {
//   maxZoom: 18,
//   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//     'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//   id: 'mapbox.emerald'
// }).addTo(map);

// Use this code for ugly map tiles straight from OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);


//finds and centers where current location is
function onLocationFound(e) {
  var radius = e.accuracy / 2;

  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters from here").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

//returns an alert if location was not found
function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 13});

function onMapClick(e) {
  lng = e.latlng.lng;
  lat = e.latlng.lat;
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked at " + e.latlng.toString() +
      "\n <button id='nearButton' type='button' data-lng='" +
      e.latlng.lng.toString() + "' data-lat='" + e.latlng.lat.toString() + "' >Nearby Routes</button>")
    .openOn(map);
}

map.on('click', onMapClick);



//able to make circle
L.circle([51.508, -0.11], 500, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5
}) // .addTo(map).bindPopup("I am a circle.");

//able to make polygon
L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
])// .addTo(map).bindPopup("I am a polygon.");

var popup = L.popup();

//popup shows location via where clicked

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var busColor = [
  '#FF0000', //red
  '#FF7B00', //orange
  '#F6C905', //yellow
  '#2FDE00', //lime green
  '#03A76E', //turquoise
  '#0498D8', //sky blue
  '#0000BF', //blue
  '#FF0057', //pink
  '#210026', //purple
  '#000000', //black
];

function style() {
  return {
    weight: 4,
    opacity: 1,
    fillOpacity: 0.7
  };
}

//to highlight hovered route
function highlightRoute(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 7,
    color: busColor[getRandom(0, busColor.length)],
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

//resets after finished hovering
function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

//zooms in or out depending on the selected route
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

//summarizes events on geoJson layer
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightRoute,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.ROUTE) {
      layer.bindPopup(feature.properties.ROUTE);
  }
}

// function getNearBusRoutes(radius) {
//   $.ajax ({
//     url: 'http://localhost:3000/api/nearbusroutes/',
//     type: 'GET',
//     data: {
//       lng: lng,
//       lat: lat,
//       radius: radius
//     }
//   })
//   .done(function(res) {
//     for (var i = 0; i < res.length; i++) {
//       mapDisplay(res[i]);
//     }
//   })
//   .fail(function(err) {
//     console.log(err);
//   });
// }

function mapDisplay(route) {
  L.geoJson(route, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
}


