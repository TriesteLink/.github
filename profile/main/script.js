    async function getBusStops() {
        const query = `[out:json];
        area["name"="Trieste"]->.searchArea;
        node["highway"="bus_stop"](area.searchArea);
        out body;`;

        const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

        try {
            let response = await fetch(url);
            let data = await response.json();

            // Itera sulle fermate e le aggiunge alla mappa
            data.elements.forEach(stop => {
                if (stop.lat && stop.lon) {
                    L.marker([stop.lat, stop.lon])
                        .addTo(map)
                        .bindPopup("Fermata bus: " + (stop.tags.name || "Sconosciuta"));
                }
            });
        } catch (error) {
            console.error("Errore nel caricamento delle fermate:", error);
        }
    }

    getBusStops();
