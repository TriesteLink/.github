async function getBusRoute17() {
    const query = `[out:json];
    rel(id:13300193,13300194);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = window.osmToGeoJSON(data); // Modificato

        // Controlla se esiste già un layer e rimuovilo
        if (window.routeLayer17) {
            window.map.removeLayer(window.routeLayer17);
        }

        // Crea un nuovo layer e assegnalo a window.routeLayer17
        window.routeLayer17 = L.geoJSON(routesGeoJSON, {
            style: { color: "blue", weight: 3 }
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window.routeLayer17.on('click', function () {
            if (window.map.hasLayer(window.busStopsLayer17)) {
                window.map.removeLayer(window.busStopsLayer17);
            } else {
                getBusStops17();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 17:", error);
    }
}

// Funzione per ottenere le fermate della linea 17
async function getBusStops17() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    window.busStopsLayer17.clearLayers(); // Pulisce fermate precedenti

    const query = `[out:json];
rel(id:13300193,13300194);  // Relazioni della linea 17
node(r)->.stops;            // Trova i nodi (fermate) collegati alle relazioni
.stops out body;            // Output delle fermate`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon])
                .bindPopup(node.tags.name || "Fermata 17");
            window.busStopsLayer17.addLayer(marker);
        });

        window.map.addLayer(window.busStopsLayer17); // Aggiunge fermate alla mappa

        // Imposta il layer attivo su questa linea
        window.activeBusStopsLayer = window.busStopsLayer17;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate:", error);
    }
}

// Crea il layer delle fermate all'inizio
window.busStopsLayer17 = L.layerGroup().addTo(window.map);

// COMMENTATO: Caricamento automatico disabilitato per migliorare le performance
// getBusRoute17();
