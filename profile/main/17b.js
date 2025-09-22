async function getBusRoute17B() {
    const query = `[out:json];
    rel(id:13307218,13300195);
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = window.osmToGeoJSON(data); // Usa la funzione globale

        // Controlla se il layer esiste già e rimuovilo
        if (window.routeLayer17B) {
            window.map.removeLayer(window.routeLayer17B);
        }

        // Crea un nuovo layer e assegnalo a window.routeLayer17B
        window.routeLayer17B = L.geoJSON(routesGeoJSON, {
            style: { color: "red", weight: 3 } // Usa un colore diverso per la 17B
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window.routeLayer17B.on('click', function () {
            if (window.map.hasLayer(window.busStopsLayer17B)) {
                window.map.removeLayer(window.busStopsLayer17B);
            } else {
                getBusStops17B();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 17B:", error);
    }
}

// Funzione per ottenere le fermate della linea 17B
async function getBusStops17B() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    window.busStopsLayer17B.clearLayers(); // Pulisce fermate precedenti

    const query = `[out:json];
rel(id:13307218,13300195);  // Relazioni della linea 17b
node(r)->.stops;            // Trova i nodi (fermate) collegati alle relazioni
.stops out body;            // Output delle fermate`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon])
                .bindPopup(node.tags.name || "Fermata 17/");
            window.busStopsLayer17B.addLayer(marker);
        });

        window.map.addLayer(window.busStopsLayer17B); // Aggiunge fermate alla mappa

        // Imposta il layer attivo su questa linea
        window.activeBusStopsLayer = window.busStopsLayer17B;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate:", error);
    }
}

// Crea il layer delle fermate all'inizio
window.busStopsLayer17B = L.layerGroup().addTo(window.map);

// Carica la linea 17B
// COMMENTATO: Caricamento automatico disabilitato per migliorare le performance
// getBusRoute17B();
