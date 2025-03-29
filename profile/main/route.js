
// Aggiunge la mappa di base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function getBusRoute17() {
    const query = `[out:json];
    rel(id:13300193,13300194); // Relazioni della linea 17
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        let routesGeoJSON = osmToGeoJSON(data);

        // Aggiunge il percorso della linea 17 in blu
        L.geoJSON(routesGeoJSON, {
            style: { color: "blue", weight: 3 }
        }).addTo(map);

    } catch (error) {
        console.error("Errore nel caricamento della linea 17:", error);
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

// Carica il percorso della linea 17 sulla mappa
getBusRoute17();
