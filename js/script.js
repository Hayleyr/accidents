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
			 	+ '<h4>accidents reported by precint</h4>' + (props ? 
				'<b><h1>' + props.pedestrians2_Crashes + '</h1></b><br />'
				+ props.pedestrians2_Borough + '    '
				+ props.pedestrians2_Date + ' '
				: ' ');
		};

		info.addTo(map);


		// get color depending on population density value

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
				weight: 1,
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

		geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		map.attributionControl.addAttribution('tutorials example');


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


//slider

$(function() {
    $( "#slider" ).slider({
      value:100,
      min: 2011,
      max: 2013,
      step: 1,
      slide: function( event, ui ) {
        $( "#amount" ).val( "" + ui.value );
        console.log(ui.value)
      }
    });
    $( "#amount" ).val( "" + $( "#slider" ).slider( "value" ) );
  });
