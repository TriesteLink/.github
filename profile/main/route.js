let stopsLayer = L.layerGroup(); // Layer per le fermate

async function getBusRoutes() {
    const query = `[out:json];
    rel(id:13300193,13300195);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        let routesGeoJSON = osmToGeoJSON(data);
        let stopsGeoJSON = getStopsGeoJSON(data);

        // Aggiunge i percorsi con colori distinti
        let routesLayer = L.geoJSON(routesGeoJSON, {
            style: function (feature) {
                return { color: feature.properties.route === "17" ? "blue" : "green", weight: 3 };
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`Linea ${feature.properties.route}`);

                layer.on("mouseover", function () {
                    map.removeLayer(stopsLayer); // Nasconde tutte le fermate
                    stopsLayer = L.geoJSON(stopsGeoJSON, {
                        filter: stop => stop.properties.route === feature.properties.route, // Mostra solo le fermate della linea attiva
                        pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                            color: feature.properties.route === "17" ? "blue" : "yellow",
                            radius: 6
                        })
                    }).addTo(map);
                });

                layer.on("mouseout", function () {
                    map.removeLayer(stopsLayer); // Nasconde le fermate quando esci
                });
            }
        }).addTo(map);

    } catch (error) {
        console.error("Errore nel caricamento delle linee bus:", error);
    }
}

// Funzione per convertire i dati delle strade in GeoJSON
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
                    "properties": {
                        "id": element.id,
                        "route": osmData.elements.find(rel => rel.members?.some(m => m.ref === element.id))?.tags.ref || "Sconosciuta"
                    }
                });
            }
        }
    });

    return geojson;
}

// Funzione per estrarre le fermate in GeoJSON
function getStopsGeoJSON(osmData) {
    let geojson = { "type": "FeatureCollection", "features": [] };

    osmData.elements.forEach(element => {
        if (element.type === "node" && element.tags && element.tags.public_transport === "stop_position") {
            geojson.features.push({
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [element.lon, element.lat] },
                "properties": {
                    "id": element.id,
                    "route": osmData.elements.find(rel => rel.members?.some(m => m.ref === element.id))?.tags.ref || "Sconosciuta",
                    "name": element.tags.name || "Fermata"
                }
            });
        }
    });

    return geojson;
}

getBusRoutes();
