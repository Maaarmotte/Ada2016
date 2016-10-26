var uniIcon = L.AwesomeMarkers.icon({
    icon: 'university',
    prefix: 'fa',
    markerColor: 'cadetblue'
});

var uniMarkers = L.layerGroup();
for (var uni in unis) {
	if (unis.hasOwnProperty(uni)) {
		var lat = unis[uni]['Latitude'];
		var lng = unis[uni]['Longitude'];
		
		uniMarkers.addLayer(L.marker([lat, lng], {icon: uniIcon}).bindPopup(uni));
	}
}

var background = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var names = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19,
	opacity: 0.6
});

var map = L.map('map', {
    center: [46.83, 8.29],
    zoom: 8,
    minZoom: 8,
    maxZoom: 10,
    /* maxBounds: L.latLngBounds(L.latLng(45.72152, 5.60852), L.latLng(47.91266, 10.98083)), */
    layers: [background, names, uniMarkers]
});

var baseMaps = {
    "Background": background
};

var overlayMaps = {
	"Names": names,
    "Universities": uniMarkers
};

L.control.layers({}, overlayMaps).addTo(map);

function getColor(d) {
	return d > 112710220 ? '#005a32' :
	 	   d > 37094911  ? '#238443' :
	 	   d > 11466776  ? '#41ab5d' :
	 	   d > 3441410   ? '#78c679' :
	 	   d > 1556147   ? '#addd8e' :
	 	   d > 548475    ? '#d9f0a3' :
	 	   		           '#ffffcc';
}

function style(feature) {
	var amount = feature.id in cantons ? cantons[feature.id]["Approved Amount"] : 0;
    return {
        fillColor: getColor(amount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        //weight: 5,
        //color: '#606060',
        dashArray: '',
        fillOpacity: 0.85
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}

var geojson = L.geoJson(geojsonCantons, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// Thanks StackOverflow! (https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript)
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

// method that we will use to update the control based on feature properties passed
info.update = function (feature) {
	if (feature) {
		var amount = feature.id in cantons ? cantons[feature.id]["Approved Amount"].formatMoney(2, '.', ' ') : 0;
	}
    this._div.innerHTML = '<h4>Research Funding</h4>' +  (feature ?
        '<b>' + feature.properties.name + '</b><br />' + amount + ' CHF'
        : 'Hover over a canton');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

function toMillions(number) {
	return Math.round(number/1e4) / 100 + 'M';
}

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 548475, 1556147, 3441410, 11466776, 37094911, 112710220],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            toMillions(grades[i]) + (grades[i + 1] ? ' &ndash; ' + toMillions(grades[i + 1]) + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);