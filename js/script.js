//loads the tile map

var map = L.map('map').setView([40.722864, -73.901081], 12);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	maxZoom: 18,

}).addTo(map);


// control that shows state info on hover

var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h6>(roll over the map)</h6>'
	 	+ '<h4>Accidents reported by precinct</h4>' + (props ? 
		'<b><h1>' + props.pedestrians2_Crashes + '</h1></b><br />'
		+ props.pedestrians2_Borough + '    '
		+ props.pedestrians2_Date + ' '
		: ' ');
};

info.addTo(map);


// get color depending on charses value

function getColor(d) {
	return d > 180 ? '#8c2d04' :
	       d > 150  ? '#d94801' :
	       d > 120  ? '#f16913' :
	       d > 90  ? '#fd8d3c' :
	       d > 60  ? '#fdae6b' :
	       d > 30  ? '#fdd0a2' :
	       d > 0   ? '#feedde' :
	                  '#ffffb2';
}

function style(feature) {
	return {
		weight: 0.5,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.pedestrians2_Crashes)
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 2,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

//map zoom in

var geojson;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// loading the data

geojson = L.geoJson(bikeData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

// map attributions

map.attributionControl.addAttribution('Chroplet tutorial example');

//legend box

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 30, 60, 90, 120, 150, 180],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);

//d3 based from the Mike Bostock's Bar Chart example

var margin = {top: 8, right: 20, bottom: 30, left: 90},
    width = 870 - margin.left - margin.right,
    height = 80 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(2, "%");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.pct; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(" ");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.pct); })
      .attr("height", function(d) { return height - y(d.pct); });

});

function type(d) {
  d.pct = +d.pct;
  return d;
}