async function getBusRoute6() {
    const query = `[out:json];
    rel(id:13295182,13295183);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = window.osmToGeoJSON(data); // Usa la funzione globale

        // Controlla se il layer esiste già e rimuovilo
        if (window.routeLayer6) {
            window.map.removeLayer(window.routeLayer6);
        }

        // Crea un nuovo layer e assegnalo a window.routeLayer6
        window.routeLayer6 = L.geoJSON(routesGeoJSON, {
            style: { color: "green", weight: 3 } // Usa un colore distintivo per la linea 6
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window.routeLayer6.on('click', function () {
            if (window.map.hasLayer(window.busStopsLayer6)) {
                window.map.removeLayer(window.busStopsLayer6);
            } else {
                getBusStops6();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 6:", error);
    }
}

// Funzione per ottenere le fermate della linea 6
async function getBusStops6() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    window.busStopsLayer6.clearLayers(); // Pulisce fermate precedenti

    const query = `[out:json];
    rel(id:13295182,13295183);  // Relazioni della linea 6
    node(r)->.stops;            // Trova i nodi (fermate) collegati alle relazioni
    .stops out body;            // Output delle fermate`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon])
                .bindPopup(node.tags.name || "Fermata 6");
            window.busStopsLayer6.addLayer(marker);
        });

        window.map.addLayer(window.busStopsLayer6); // Aggiunge fermate alla mappa

        // Imposta il layer attivo su questa linea
        window.activeBusStopsLayer = window.busStopsLayer6;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate:", error);
    }
}

// Crea il layer delle fermate all'inizio
window.busStopsLayer6 = L.layerGroup().addTo(window.map);

// Carica la linea 6
// COMMENTATO: Caricamento automatico disabilitato per migliorare le performance
// getBusRoute6();
