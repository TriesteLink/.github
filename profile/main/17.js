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

// Funzione per ottenere le fermate della linea 17 ANDATA in ordine corretto
async function getBusStopsA17() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Pulisce il layer andata precedente
    if (window.busStopsLayer17_A) {
        window.busStopsLayer17_A.clearLayers();
    } else {
        window.busStopsLayer17_A = L.layerGroup();
    }

    // IDs delle fermate in ordine di andata (dal file linee_relazioni.txt)
    const andataStopsIds = [
        "8577834117", // capolinea
        "1621660255",
        "7608819302",
        "4589306199",
        "4589306200",
        "270231408",
        "789981414",
        "268201214",
        "627851056",
        "627851058",
        "627851059",
        "627851062",
        "627851064",
        "273840241",
        "273840235",
        "273840233",
        "270561142",
        "4530646129",
        "281171668"  // capolinea
    ];

    // Query Overpass per ottenere i dettagli delle fermate specifiche
    const nodeIds = andataStopsIds.join(',');
    const query = `[out:json];
node(id:${nodeIds});
out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        // Crea un map per accesso rapido ai dati delle fermate
        const stopsData = {};
        data.elements.forEach(node => {
            stopsData[node.id] = node;
        });

        // Array per memorizzare le fermate ordinate per l'info panel
        const orderedStops = [];

        // Crea i marker nell'ordine corretto dell'andata
        andataStopsIds.forEach((stopId, index) => {
            const node = stopsData[stopId];
            if (node) {
                // Determina se è capolinea
                const isCapolinea = index === 0 || index === andataStopsIds.length - 1;
                const stopName = node.tags?.name || `Fermata ${stopId}`;

                // Icona uniforme per tutte le fermate (blu linea 17), capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: 'bus-stop-marker linea17',
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : 'blue'}; 
                            color: white; 
                            border-radius: 50%; 
                            width: ${isCapolinea ? '25px' : '15px'}; 
                            height: ${isCapolinea ? '25px' : '15px'}; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: ${isCapolinea ? '14px' : '0px'}; 
                            font-weight: bold;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">${isCapolinea ? 'C' : ''}</div>`,
                        iconSize: [isCapolinea ? 25 : 20, isCapolinea ? 25 : 20]
                    })
                });

                // Popup con informazioni dettagliate
                const popupContent = `
                    <div style="text-align: center;">
                        <b style="color: blue;">Linea 17</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${andataStopsIds.length}</small>
                    </div>
                `;

                marker.bindPopup(popupContent);
                window.busStopsLayer17_A.addLayer(marker);

                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window.busStopsLayer17_A);

        // Imposta come layer attivo
        window.activeBusStopsLayer = window.busStopsLayer17_A;

        // Aggiorna il pannello informativo con le fermate ordinate
        updateLineInfoPanelWithOrderedStops("17", "blue", "ANDATA", orderedStops);

        console.log(`Caricate ${orderedStops.length} fermate della linea 17 andata in ordine corretto`);

    } catch (error) {
        console.error("Errore nel caricamento delle fermate andata linea 17:", error);
    }
}

// Funzione per ottenere le fermate della linea 17 RITORNO in ordine corretto
async function getBusStopsR17() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Pulisce il layer ritorno precedente
    if (window.busStopsLayer17_R) {
        window.busStopsLayer17_R.clearLayers();
    } else {
        window.busStopsLayer17_R = L.layerGroup();
    }

    // IDs delle fermate in ordine di ritorno (dal file linee_relazioni.txt, righe 33-57)
    const ritornoStopsIds = [
        "281171668", // capolinea
        "390873856",
        "270561143",
        "273840231",
        "273840230",
        "273840237",
        "627851063",
        "627851061",
        "627851060",
        "627851057",
        "627851055",
        "789920196",
        "789920203",
        "789920212",
        "4589307293",
        "4589264599",
        "9109518640",
        "1621660256",
        "296398798",
        "8577834117"  // capolinea
    ];

    // Query Overpass per ottenere i dettagli delle fermate specifiche
    const nodeIds = ritornoStopsIds.join(',');
    const query = `[out:json];
node(id:${nodeIds});
out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        // Crea un map per accesso rapido ai dati delle fermate
        const stopsData = {};
        data.elements.forEach(node => {
            stopsData[node.id] = node;
        });

        // Array per memorizzare le fermate ordinate per l'info panel
        const orderedStops = [];

        // Crea i marker nell'ordine corretto del ritorno
        ritornoStopsIds.forEach((stopId, index) => {
            const node = stopsData[stopId];
            if (node) {
                // Determina se è capolinea
                const isCapolinea = index === 0 || index === ritornoStopsIds.length - 1;
                const stopName = node.tags?.name || `Fermata ${stopId}`;

                // Icona uniforme per tutte le fermate (blu linea 17), capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: 'bus-stop-marker linea17',
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : 'blue'}; 
                            color: white; 
                            border-radius: 50%; 
                            width: ${isCapolinea ? '25px' : '15px'}; 
                            height: ${isCapolinea ? '25px' : '15px'}; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: ${isCapolinea ? '14px' : '0px'}; 
                            font-weight: bold;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">${isCapolinea ? 'C' : ''}</div>`,
                        iconSize: [isCapolinea ? 25 : 15, isCapolinea ? 25 : 15]
                    })
                });

                // Popup con informazioni dettagliate
                const popupContent = `
                    <div style="text-align: center;">
                        <b style="color: blue;">Linea 17</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${ritornoStopsIds.length}</small>
                    </div>
                `;

                marker.bindPopup(popupContent);
                window.busStopsLayer17_R.addLayer(marker);

                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window.busStopsLayer17_R);

        // Imposta come layer attivo
        window.activeBusStopsLayer = window.busStopsLayer17_R;

        // Aggiorna il pannello informativo con le fermate ordinate
        updateLineInfoPanelWithOrderedStops("17", "blue", "RITORNO", orderedStops);

        console.log(`Caricate ${orderedStops.length} fermate della linea 17 ritorno in ordine corretto`);

    } catch (error) {
        console.error("Errore nel caricamento delle fermate ritorno linea 17:", error);
    }
}

// Funzione helper per ottenere i dati dell'andata senza aggiornare il pannello
async function getBusStopsA17Data() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Pulisce il layer andata precedente
    if (window.busStopsLayer17_A) {
        window.busStopsLayer17_A.clearLayers();
    } else {
        window.busStopsLayer17_A = L.layerGroup();
    }

    // IDs delle fermate in ordine di andata (dal file linee_relazioni.txt)
    const andataStopsIds = [
        "8577834117", // capolinea
        "1621660255",
        "7608819302",
        "4589306199",
        "4589306200",
        "270231408",
        "789981414",
        "268201214",
        "627851056",
        "627851058",
        "627851059",
        "627851062",
        "627851064",
        "273840241",
        "273840235",
        "273840233",
        "270561142",
        "4530646129",
        "281171668"  // capolinea
    ];

    // Query Overpass per ottenere i dettagli delle fermate specifiche
    const nodeIds = andataStopsIds.join(',');
    const query = `[out:json];
node(id:${nodeIds});
out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        // Crea un map per accesso rapido ai dati delle fermate
        const stopsData = {};
        data.elements.forEach(node => {
            stopsData[node.id] = node;
        });

        // Array per memorizzare le fermate ordinate per l'info panel
        const orderedStops = [];

        // Crea i marker nell'ordine corretto dell'andata
        andataStopsIds.forEach((stopId, index) => {
            const node = stopsData[stopId];
            if (node) {
                // Determina se è capolinea
                const isCapolinea = index === 0 || index === andataStopsIds.length - 1;
                const stopName = node.tags?.name || `Fermata ${stopId}`;

                // Icona uniforme per tutte le fermate (blu linea 17), capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: 'bus-stop-marker linea17',
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : 'blue'}; 
                            color: white; 
                            border-radius: 50%; 
                            width: ${isCapolinea ? '25px' : '15px'}; 
                            height: ${isCapolinea ? '25px' : '15px'}; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: ${isCapolinea ? '14px' : '0px'}; 
                            font-weight: bold;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">${isCapolinea ? 'C' : ''}</div>`,
                        iconSize: [isCapolinea ? 25 : 20, isCapolinea ? 25 : 20]
                    })
                });

                // Popup con informazioni dettagliate
                const popupContent = `
                    <div style="text-align: center;">
                        <b style="color: blue;">Linea 17</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${andataStopsIds.length}</small>
                    </div>
                `;

                marker.bindPopup(popupContent);
                window.busStopsLayer17_A.addLayer(marker);

                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window.busStopsLayer17_A);

        // Imposta come layer attivo
        window.activeBusStopsLayer = window.busStopsLayer17_A;

        console.log(`Caricate ${orderedStops.length} fermate della linea 17 andata in ordine corretto`);

        // Restituisce i dati invece di aggiornare il pannello
        return orderedStops;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate andata linea 17:", error);
        return [];
    }
}

// Funzione per caricare ENTRAMBE le direzioni della linea 17
async function getBusStopsAll17() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Carica prima l'andata e ottieni i dati per il pannello
    const andataData = await getBusStopsA17Data();

    // Aspetta un momento e poi carica anche il ritorno
    setTimeout(async () => {
        // Pulisce il layer ritorno precedente
        if (window.busStopsLayer17_R) {
            window.busStopsLayer17_R.clearLayers();
        } else {
            window.busStopsLayer17_R = L.layerGroup();
        }

        // Carica le fermate del ritorno (senza aggiornare il pannello)
        const ritornoStopsIds = [
            "281171668", // capolinea
            "390873856",
            "270561143",
            "273840231",
            "273840230",
            "273840237",
            "627851063",
            "627851061",
            "627851060",
            "627851057",
            "627851055",
            "789920196",
            "789920203",
            "789920212",
            "4589307293",
            "4589264599",
            "9109518640",
            "1621660256",
            "296398798",
            "8577834117"  // capolinea
        ];

        const nodeIds = ritornoStopsIds.join(',');
        const query = `[out:json];
node(id:${nodeIds});
out body;`;

        const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

        try {
            let response = await fetch(url);
            let data = await response.json();

            const stopsData = {};
            data.elements.forEach(node => {
                stopsData[node.id] = node;
            });

            const orderedStopsRitorno = [];

            // Crea i marker del ritorno
            ritornoStopsIds.forEach((stopId, index) => {
                const node = stopsData[stopId];
                if (node) {
                    const isCapolinea = index === 0 || index === ritornoStopsIds.length - 1;
                    const stopName = node.tags?.name || `Fermata ${stopId}`;

                    const marker = L.marker([node.lat, node.lon], {
                        icon: L.divIcon({
                            className: 'bus-stop-marker linea17',
                            html: `<div style="
                                background-color: ${isCapolinea ? '#FF5722' : 'blue'}; 
                                color: white; 
                                border-radius: 50%; 
                                width: ${isCapolinea ? '25px' : '15px'}; 
                                height: ${isCapolinea ? '25px' : '15px'}; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: ${isCapolinea ? '14px' : '0px'}; 
                                font-weight: bold;
                                border: 2px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            ">${isCapolinea ? 'C' : ''}</div>`,
                            iconSize: [isCapolinea ? 25 : 15, isCapolinea ? 25 : 15]
                        })
                    });

                    const popupContent = `
                        <div style="text-align: center;">
                            <b style="color: blue;">Linea 17</b><br>
                            <strong>${stopName}</strong><br>
                            ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                            <small>Fermata ${index + 1} di ${ritornoStopsIds.length}</small>
                        </div>
                    `;

                    marker.bindPopup(popupContent);
                    window.busStopsLayer17_R.addLayer(marker);

                    orderedStopsRitorno.push({
                        ...node,
                        isCapolinea: isCapolinea,
                        position: index + 1
                    });
                }
            });

            // Aggiunge il layer alla mappa
            window.map.addLayer(window.busStopsLayer17_R);

            // Aggiorna il pannello con ENTRAMBE le direzioni
            updateLineInfoPanelWithBothDirections17(andataData, orderedStopsRitorno);

        } catch (error) {
            console.error("Errore nel caricamento delle fermate ritorno:", error);
        }

    }, 1000);
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
