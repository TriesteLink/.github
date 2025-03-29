async function getBusRoute17b() {
    const query = `[out:json];
    rel(id:13307218,13300195);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = osmToGeoJSON(data);

        // Disegna la linea 17/ (gialla)
        let routeLayer17Slash = L.geoJSON(routesGeoJSON, {
            style: { color: "green", weight: 3 }
        }).addTo(map);

    } catch (error) {
        console.error("Errore nel caricamento della linea 17/:", error);
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
                    "properties": { "id": element.id, "route": "17/" }
                });
            }
        }
    });

    return geojson;
}

// Carica la linea 17/
getBusRoute17b();
