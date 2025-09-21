async function getBusRoute2() {
    const query = `[out:json];
    rel(id:13286981,13286982);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = window.osmToGeoJSON(data); // Usa la funzione globale

        // Controlla se il layer esiste già e rimuovilo
        if (window.routeLayer2) {
            window.map.removeLayer(window.routeLayer2);
        }

        // Crea un nuovo layer e assegnalo a window.routeLayer2
        window.routeLayer2 = L.geoJSON(routesGeoJSON, {
            style: { color: "#FF6B35", weight: 3 } // Arancione distintivo per la linea 2
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window.routeLayer2.on('click', function () {
            if (window.map.hasLayer(window.busStopsLayer2)) {
                window.map.removeLayer(window.busStopsLayer2);
            } else {
                getBusStops2();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 2:", error);
    }
}

// Funzione per ottenere le fermate della linea 2
async function getBusStops2() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    window.busStopsLayer2.clearLayers(); // Pulisce fermate precedenti

    const query = `[out:json];
rel(id:13286981,13286982);  // Relazioni della linea 2
node(r)->.stops;            // Trova i nodi (fermate) collegati alle relazioni
.stops out body;            // Output delle fermate`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon])
                .bindPopup(node.tags.name || "Fermata 2");
            window.busStopsLayer2.addLayer(marker);
        });

        window.map.addLayer(window.busStopsLayer2); // Aggiunge fermate alla mappa

        // Imposta il layer attivo su questa linea
        window.activeBusStopsLayer = window.busStopsLayer2;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate:", error);
    }
}

// Crea il layer delle fermate all'inizio
window.busStopsLayer2 = L.layerGroup().addTo(window.map);

// Carica la linea 2
getBusRoute2();
