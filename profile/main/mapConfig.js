// Inizializza la mappa e la rende globale
var map = L.map('map').setView([45.6495, 13.7768], 13); // Coordinate di Trieste

// Aggiunge il layer di OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Layer globale per le fermate degli autobus
var busStopsLayer = L.layerGroup().addTo(map);

// Layer globale per il percorso degli autobus
var routeLayer = null;

// Converte i dati OSM in GeoJSON
window.osmToGeoJSON = function (osmData) {
    let geojson = { "type": "FeatureCollection", "features": [] };

    osmData.elements.forEach(element => {
        if (element.type === "way" && element.nodes) {
            let coordinates = element.nodes.map(nodeId => {
                let node = osmData.elements.find(n => n.id === nodeId);
                return node ? [node.lon, node.lat] : null;
            }).filter(coord => coord !== null);

            if (coordinates.length > 1) {
                geojson.features.push({
                    "type": "Feature",
                    "geometry": { "type": "LineString", "coordinates": coordinates },
                    "properties": { "id": element.id, "route": "17" }
                });
            }
        }
    });

    return geojson;
};
