
////////////////////////////
////// basemap
////////////////////////////

var mymap = L.map('mapid', {
    zoomSnap: 0.5,
	maxZoom: 10.5,
	minZoom: 6,
    zoomControl: false,
    renderer: L.canvas(),
  }).setView([46.5, 2.55], 6);


  // empecher zoom hors de la bounding box
var bounds = L.latLngBounds([[40, -6], [52, 11]]);
mymap.setMaxBounds(bounds);
mymap.on('drag', function() {
	mymap.panInsideBounds(bounds, { animate: false });
});

/* L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: 'Source : Plan Cadastral Informatisé, DGFiP, 2020 &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
maxZoom: 11,
minZoom: 8
}).addTo(mymap); */

// var positronLabels = L.TileLayer.boundaryCanvas('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
// 		attribution: 'Source : Plan Cadastral Informatisé, DGFiP, 2020 &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
// 		maxZoom: 11,
// 		minZoom: 6,
// 		boundary: grid_deps
// 	}).addTo(mymap);


// GeoJSON layer (lambert 93)
proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");


/* L.tileLayer('', {
maxZoom: 10,
minZoom: 6, 
}).addTo(mymap); */

/* L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
maxZoom: 11,
minZoom: 6,
apikey: 'choisirgeoportail',
format: 'image/png',
style: 'normal' 
}).addTo(mymap); */

// bouton zoom emprise max
mymap.addControl(new L.Control.ZoomMin({position:'topleft',
                                        zoomInText: "+",
                                        zoomInTitle: "Zoom +",
                                        zoomOutText: "-",
                                        zoomOutTitle: "Zoom -",
                                        zoomMinText: "Zoom France",
                                        zoomMinTitle: "Zoom France"}));



// bouton geoloc
L.control.locate({
    strings: {
        title: "Géolocalisation"
    }
}).addTo(mymap);

////////////////////////////
////// search
////////////////////////////
	 

L.control.search({
	url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
	jsonpParam: 'json_callback',
	propertyName: 'display_name',
	propertyLoc: ['lat','lon'],
	marker: L.circleMarker([0,0],{radius:3, 
		fillOpacity: 1, 
		color: '#ffffff', 
		fillColor: '#ffffff', 
		weight: 1,}),
	autoCollapse: true,
	autoType: false,
	minLength: 2,
	zoom: 11
})
.addTo(mymap);

////////////////////////////
////// info tooltip
////////////////////////////

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

function nombreFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


info.update = function (props) {
	this._div.innerHTML = '<h4>Informations sur le carreau :</h4>' +  (props ?
		"<p>" + "Commune principale : " + "<br>"  +  '<big> <b>' + props.LIBGEO + '</big></b><br />' + "<br>" +
		// "Population : " + nombreFormat(props.population) + ' habitants' + "<br>" +
		nombreFormat(props.nb_piscines) + ' piscines' + "<br>" + // "<br>" +
		// nombreFormat(props.nb_logts) + ' logements' + "<br>" 
		"<small><i>" + (props.pct_piscines_logts) + ' piscines pour 100 logements' + "</small></i>" + "<br>" +
		"<small><i>" + (props.densite_piscines) + ' piscines au km²' + "</small></i>" + "<br>" 
		: 'Cliquez sur un carreau');
};

info.addTo(mymap);


function highlightFeature(e) {
	var layer = e.target;

/* 	layer.setStyle({
		weight: 0.5,
		color: 'white',
		dashArray: '',
		fillOpacity: 0
	}); */

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

/* function clickFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 0.3,
		color: 'red',
		dashArray: '',
		fillOpacity: 1
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
} */


/* function resetHighlight(e) {
	grid.resetStyle(e.target);
	info.update();
} */

function zoomToFeature(e) {
	mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		// mouseout: resetHighlight,
		click: zoomToFeature
	});
}


////////////////////////////
////// ordre layers
////////////////////////////

mymap.createPane('labels');

// This pane is above markers but below popups
mymap.getPane('labels').style.zIndex = 400;

// Layers in this pane are non-interactive and do not obscure mouse/touch events
mymap.getPane('labels').style.pointerEvents = 'none';

// var zoneaffichage = turf.buffer(grid_deps, 15, {units: 'miles'});

var positronLabels = L.TileLayer.boundaryCanvas('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
		attribution: 'Source : Plan Cadastral Informatisé, DGFiP, 2020 &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		maxZoom: 11,
		minZoom: 8,
		pane: 'labels',
		boundary: grid_deps
		// boundary: zoneaffichage
	}).addTo(mymap);

////////////////////////////
////// appel data
////////////////////////////


/* grid = L.geoJSON([grid_piscines], {

	style: style_grid,
	onEachFeature: onEachFeature
}).addTo(mymap); */


/* var grid_r = L.geoJSON([grid_piscines], {

	style: style_grid_ratio,
	onEachFeature: onEachFeature
}).addTo(mymap);

var grid_d = L.geoJSON([grid_piscines], {

	style: style_grid_densite,
	onEachFeature: onEachFeature
}) */

var grid_r = L.Proj.geoJson([grid_piscines], {

	style: style_grid_ratio,
	onEachFeature: onEachFeature,
	// pane: 'grid'
}).addTo(mymap);

var grid_d = L.Proj.geoJson([grid_piscines], {

	style: style_grid_densite,
	onEachFeature: onEachFeature
})

////////////////////////////
////// contours départements
////////////////////////////

function style_deps(feature) {
    return {
        fillColor: "white",
        weight: 0.5,
        opacity: 0.6,
        color: '#7f7f7f',
        fillOpacity: 0
    };
}

/* var grid_deps = L.Proj.geoJson([grid_deps], {

	style: style_deps,
	pane: 'deps'
}).addTo(mymap); */

////////////////////////////
////// styles des points
////////////////////////////



function CouleurRatio(ratio) {
	return ratio > 0.35*100 ? "#023858"  :
	ratio > 0.3*100 ? "#045a8d"  :
	ratio > 0.25*100 ? "#0570b0"  :
	ratio > 0.2*100 ? "#3690c0" :
	ratio > 0.15*100 ? "#74a9cf"  :
	ratio > 0.1*100 ? "#a6bddb" :
	ratio > 0.05*100 ? "#d0d1e6"  :
	ratio > 0.03*100 ? "#ece7f2" :
	"#f7fcfd";
			}	
			
function CouleurDensite(ratio) {
	return ratio > 60 ? "#4d004b"  :
	ratio > 50 ? "#810f7c"  :
	ratio > 40 ? "#88419d"  :
	ratio > 30 ? "#8c6bb1" :
	ratio > 20 ? "#8c96c6"  :
	ratio > 10 ? "#9ebcda" :
	ratio > 5 ? "#bfd3e6"  :
	ratio > 2 ? "#e0ecf4" :
	"#f7fcfd";
			}	
		  
		

function style_grid_ratio(feature) {
return {
		fillColor: CouleurRatio(feature.properties.pct_piscines_logts),
		weight: 0.5,
		opacity: 0.5,
		color: "white",
		fillOpacity: 0.75,
};
}

function style_grid_densite(feature) {
	return {
			fillColor: CouleurDensite(feature.properties.densite_piscines),
			weight: 0.5,
			opacity: 0.5,
			color: "white",
			fillOpacity: 0.75,
	};
	}

////////////////////////////
////// légende
////////////////////////////

var ratiolegend = L.control({position: 'topright'});
ratiolegend.onAdd = function (map) {
		var div = L.DomUtil.create("div", "legend");
		// div.innerHTML += "<h4>Ratio piscines par logement</h4>";
		div.innerHTML += '<i style="background: #023858"></i><span>> 35 </span><br>';
		div.innerHTML += '<i style="background: #045a8d"></i><span>> 30 </span><br>';
		div.innerHTML += '<i style="background: #0570b0"></i><span>> 25 </span><br>';
		div.innerHTML += '<i style="background: #3690c0"></i><span>> 20 </span><br>';
		div.innerHTML += '<i style="background: #74a9cf"></i><span>> 15 </span><br>';
		div.innerHTML += '<i style="background: #a6bddb"></i><span>> 10 </span><br>';
		div.innerHTML += '<i style="background: #d0d1e6"></i><span>> 5 </span><br>';
		div.innerHTML += '<i style="background: #ece7f2"></i><span>> 3 </span><br>';
		div.innerHTML += '<i style="background: #fff7fb"></i><span>< 3 </span><br>';
	
		return div;
        };


var densitelegend = L.control({position: 'topright'});
densitelegend.onAdd = function (map) {
		var div = L.DomUtil.create("div", "legend");
		//div.innerHTML += "<h4>Nombre de piscines au km²</h4>";
		div.innerHTML += '<i style="background: #4d004b"></i><span>> 60 </span><br>';
		div.innerHTML += '<i style="background: #810f7c"></i><span>> 50 </span><br>';
		div.innerHTML += '<i style="background: #88419d"></i><span>> 40 </span><br>';
		div.innerHTML += '<i style="background: #8c6bb1"></i><span>> 30 </span><br>';
		div.innerHTML += '<i style="background: #8c96c6"></i><span>> 20 </span><br>';
		div.innerHTML += '<i style="background: #9ebcda"></i><span>> 10 </span><br>';
		div.innerHTML += '<i style="background: #bfd3e6"></i><span>> 5 </span><br>';
		div.innerHTML += '<i style="background: #e0ecf4"></i><span>> 2 </span><br>';
		div.innerHTML += '<i style="background: #f7fcfd"></i><span>< 2 </span><br>';

		return div;
        };

////////////////////////////
////// layers
////////////////////////////

var type_choro = {
	"Ratio piscines par logement": grid_r,
	"Densité de piscines au km²": grid_d
	};
	
var overlayMaps = {};
	
L.control.layers(type_choro, overlayMaps, {
collapsed:false,
position:'topright'
}).addTo(mymap);
	
	
ratiolegend.addTo(mymap);
currentLegend = ratiolegend;


mymap.on('baselayerchange', function (eventLayer) {
if (eventLayer.name === 'Ratio piscines par logement') {
mymap.removeControl(currentLegend );
currentLegend = ratiolegend;
ratiolegend.addTo(mymap);
} else if (eventLayer.name === 'Densité de piscines au km²') {
	mymap.removeControl(currentLegend);
	currentLegend = densitelegend;
	densitelegend.addTo(mymap);
	}
})