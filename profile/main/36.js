async function getBusRoute36() {
    const query = `[out:json];
    rel(id:13365168,13365169);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = window.osmToGeoJSON(data); // Usa la funzione globale per convertire in GeoJSON

        // Rimuove il vecchio layer se esiste
        if (window.routeLayer36) {
            window.map.removeLayer(window.routeLayer36);
        }

        // Crea e aggiunge il nuovo layer
        window.routeLayer36 = L.geoJSON(routesGeoJSON, {
            style: { color: "orange", weight: 3 } // Usa un colore distintivo per la linea 36
        }).addTo(window.map);

        // Mostra/nasconde fermate con un click sulla linea
        window.routeLayer36.on('click', function () {
            if (window.map.hasLayer(window.busStopsLayer36)) {
                window.map.removeLayer(window.busStopsLayer36);
            } else {
                getBusStops36();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 36:", error);
    }
}

// Funzione per ottenere le fermate della linea 36
async function getBusStops36() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    window.busStopsLayer36.clearLayers(); // Pulisce fermate precedenti

    const query = `[out:json];
rel(id:13365168,13365169);  // Relazioni della linea 36
node(r)->.stops;            // Trova i nodi (fermate) collegati alle relazioni
.stops out body;            // Output delle fermate`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon])
                .bindPopup(node.tags.name || "Fermata 36");
            window.busStopsLayer36.addLayer(marker);
        });

        window.map.addLayer(window.busStopsLayer36); // Aggiunge fermate alla mappa

        // Imposta il layer attivo su questa linea
        window.activeBusStopsLayer = window.busStopsLayer36;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate:", error);
    }
}


// Crea il layer delle fermate all'inizio
window.busStopsLayer36 = L.layerGroup().addTo(window.map);

// Carica la linea 36
getBusRoute36();
