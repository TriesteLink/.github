async function getBusRoute9() {
    const query = `[out:json];
    rel(id:13297000,13297001);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = window.osmToGeoJSON(data); 

        // Rimuove il layer della linea precedente, se presente
        if (window.routeLayer9) {
            window.map.removeLayer(window.routeLayer9);
        }

        // Crea un nuovo layer e assegnalo a window.routeLayer9
        window.routeLayer9 = L.geoJSON(routesGeoJSON, {
            style: { color: "orange", weight: 3 }
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window.routeLayer9.on('click', function () {
            if (window.map.hasLayer(window.busStopsLayer9)) {
                window.map.removeLayer(window.busStopsLayer9);
            } else {
                getBusStops9();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 9:", error);
    }
}

async function getBusStops9() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    window.busStopsLayer9.clearLayers();

    const query = `[out:json];
    rel(id:13297000,13297001);  
    node(r)->.stops;            
    .stops out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon])
                .bindPopup(node.tags.name || "Fermata 9");
            window.busStopsLayer9.addLayer(marker);
        });

        window.map.addLayer(window.busStopsLayer9);

        // Imposta il layer attivo su questa linea
        window.activeBusStopsLayer = window.busStopsLayer9;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate:", error);
    }
}

// Crea il layer delle fermate all'inizio
window.busStopsLayer9 = L.layerGroup().addTo(window.map);

// Carica la linea 9
getBusRoute9();
