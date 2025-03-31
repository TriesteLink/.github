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
        if (window.routeLayer) {
            window.map.removeLayer(window.routeLayer);
        }

        // Crea un nuovo layer e assegnalo a window.routeLayer
        window.routeLayer = L.geoJSON(routesGeoJSON, {
            style: { color: "blue", weight: 3 }
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window.routeLayer17.on('click', function () {
            if (window.map.hasLayer(window.busStopsLayer)) {
                window.map.removeLayer(window.busStopsLayer);
            } else {
                getBusStops17();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 17:", error);
    }
}

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
        if (window.routeLayer) {
            window.map.removeLayer(window.routeLayer);
        }

        // Crea un nuovo layer e assegnalo a window.routeLayer
        window.routeLayer = L.geoJSON(routesGeoJSON, {
            style: { color: "blue", weight: 3 }
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window.routeLayer.on('click', function () {  // 🔴 Fixato qui!
            if (window.map.hasLayer(window.busStopsLayer)) {
                window.map.removeLayer(window.busStopsLayer);
            } else {
                getBusStops17();
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento della linea 17:", error);
    }
}


getBusRoute17();
