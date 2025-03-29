// Aggiunge la mappa di base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let busStopsLayer = L.layerGroup().addTo(map); // Layer per le fermate
let routeLayer = null; // Layer per la linea 17

async function getBusRoute17() {
    const query = `[out:json];
    rel(id:13300193,13300194);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = osmToGeoJSON(data);

        // Disegna la linea 17
        routeLayer = L.geoJSON(routesGeoJSON, {
            style: { color: "blue", weight: 3 }
        }).addTo(map);

        // Aggiunge evento di click per mostrare/nascondere fermate
        routeLayer.on('click', function () {
            if (map.hasLayer(busStopsLayer)) {
                map.removeLayer(busStopsLayer);
            } else {
                getBusStops17(); // Mostra fermate
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 17:", error);
    }
}

// Funzione per ottenere le fermate della linea 17
async function getBusStops17() {
    busStopsLayer.clearLayers(); // Pulisce fermate precedenti

    const query = `[out:json];
        node["highway"="bus_stop"](id:268201214, 627851056, 627851058, 627851059,  627851062,  627851064,  273840241, 273840235, 273840233, 270561142, 4530646129, 281171668);
        out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon]).bindPopup(node.tags.name || "Fermata Bus");
            busStopsLayer.addLayer(marker);
        });

        map.addLayer(busStopsLayer); // Aggiunge fermate alla mappa

    } catch (error) {
        console.error("Errore nel caricamento delle fermate:", error);
    }
}

// Converte i dati OSM in GeoJSON
function osmToGeoJSON(osmData) {
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
}

// Carica la linea 17
getBusRoute17();
