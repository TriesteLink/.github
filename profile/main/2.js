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

// Funzione per ottenere le fermate della linea 2 ANDATA in ordine corretto
async function getBusStopsA2() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Pulisce il layer andata precedente
    if (window.busStopsLayer2_A) {
        window.busStopsLayer2_A.clearLayers();
    } else {
        window.busStopsLayer2_A = L.layerGroup();
    }

    // IDs delle fermate in ordine di andata (dal file linee_relazioni.txt)
    const andataStopsIds = [
        "269060873", // capolinea Via Galatti
        "789906872",
        "789896987",
        "789845210",
        "789876206",
        "789876530",
        "8715832760",
        "8715832759",
        "7029958990",
        "4956308015",
        "4956308016",
        "7029958989",
        "8715832758",
        "7029958988",
        "651673083"  // capolinea Via Nazionale (Piazzale Monte Re)
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
                
                // Icona uniforme per tutte le fermate (arancione linea 2), capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: 'bus-stop-marker linea2',
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : '#FF6B35'}; 
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
                        <b style="color: #FF6B35;">Linea 2</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${andataStopsIds.length}</small>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                window.busStopsLayer2_A.addLayer(marker);
                
                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window.busStopsLayer2_A);
        
        // Imposta come layer attivo
        window.activeBusStopsLayer = window.busStopsLayer2_A;
        
        // Aggiorna il pannello informativo con le fermate ordinate
        updateLineInfoPanelWithOrderedStops("2", "#FF6B35", "ANDATA", orderedStops);

        console.log(`Caricate ${orderedStops.length} fermate della linea 2 andata in ordine corretto`);

    } catch (error) {
        console.error("Errore nel caricamento delle fermate andata linea 2:", error);
    }
}

// Funzione per ottenere le fermate della linea 2 RITORNO in ordine corretto
async function getBusStopsR2() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Pulisce il layer ritorno precedente
    if (window.busStopsLayer2_R) {
        window.busStopsLayer2_R.clearLayers();
    } else {
        window.busStopsLayer2_R = L.layerGroup();
    }

    // IDs delle fermate in ordine di ritorno (dal file linee_relazioni.txt)
    const ritornoStopsIds = [
        "7029958988", // capolinea Via Nazionale (Piazzale Monte Re)
        "8715832758",
        "7029958989",
        "7710286111",
        "4956308013",
        "9122425642",
        "9124030040",
        "9216810967",
        "789880589",
        "789876534",
        "789876207",
        "789845447",
        "789897439",
        "789908256",
        "789912569",
        "269060873"  // capolinea Via Galatti
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
                
                // Icona uniforme per tutte le fermate (arancione linea 2), capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: 'bus-stop-marker linea2',
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : '#FF6B35'}; 
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
                        <b style="color: #FF6B35;">Linea 2</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${ritornoStopsIds.length}</small>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                window.busStopsLayer2_R.addLayer(marker);
                
                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window.busStopsLayer2_R);
        
        // Imposta come layer attivo
        window.activeBusStopsLayer = window.busStopsLayer2_R;
        
        // Aggiorna il pannello informativo con le fermate ordinate
        updateLineInfoPanelWithOrderedStops("2", "#FF6B35", "RITORNO", orderedStops);

        console.log(`Caricate ${orderedStops.length} fermate della linea 2 ritorno in ordine corretto`);

    } catch (error) {
        console.error("Errore nel caricamento delle fermate ritorno linea 2:", error);
    }
}

// Funzione helper per ottenere i dati dell'andata senza aggiornare il pannello
async function getBusStopsA2Data() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Pulisce il layer andata precedente
    if (window.busStopsLayer2_A) {
        window.busStopsLayer2_A.clearLayers();
    } else {
        window.busStopsLayer2_A = L.layerGroup();
    }

    // IDs delle fermate in ordine di andata (dal file linee_relazioni.txt)
    const andataStopsIds = [
        "269060873", // capolinea Via Galatti
        "789906872",
        "789896987",
        "789845210",
        "789876206",
        "789876530",
        "8715832760",
        "8715832759",
        "7029958990",
        "4956308015",
        "4956308016",
        "7029958989",
        "8715832758",
        "7029958988",
        "651673083"  // capolinea Via Nazionale (Piazzale Monte Re)
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
                
                // Icona uniforme per tutte le fermate (arancione linea 2), capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: 'bus-stop-marker linea2',
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : '#FF6B35'}; 
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
                        <b style="color: #FF6B35;">Linea 2</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${andataStopsIds.length}</small>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                window.busStopsLayer2_A.addLayer(marker);
                
                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window.busStopsLayer2_A);
        
        // Imposta come layer attivo
        window.activeBusStopsLayer = window.busStopsLayer2_A;

        console.log(`Caricate ${orderedStops.length} fermate della linea 2 andata in ordine corretto`);

        // Restituisce i dati invece di aggiornare il pannello
        return orderedStops;

    } catch (error) {
        console.error("Errore nel caricamento delle fermate andata linea 2:", error);
        return [];
    }
}

// Funzione per caricare ENTRAMBE le direzioni della linea 2
async function getBusStopsAll2() {
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    // Carica prima l'andata e ottieni i dati per il pannello
    const andataData = await getBusStopsA2Data();
    
    // Aspetta un momento e poi carica anche il ritorno
    setTimeout(async () => {
        // Pulisce il layer ritorno precedente
        if (window.busStopsLayer2_R) {
            window.busStopsLayer2_R.clearLayers();
        } else {
            window.busStopsLayer2_R = L.layerGroup();
        }

        // Carica le fermate del ritorno (senza aggiornare il pannello)
        const ritornoStopsIds = [
            "7029958988", // capolinea Via Nazionale (Piazzale Monte Re)
            "8715832758",
            "7029958989",
            "7710286111",
            "4956308013",
            "9122425642",
            "9124030040",
            "9216810967",
            "789880589",
            "789876534",
            "789876207",
            "789845447",
            "789897439",
            "789908256",
            "789912569",
            "269060873"  // capolinea Via Galatti
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
                            className: 'bus-stop-marker linea2',
                            html: `<div style="
                                background-color: ${isCapolinea ? '#FF5722' : '#FF6B35'}; 
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
                            <b style="color: #FF6B35;">Linea 2</b><br>
                            <strong>${stopName}</strong><br>
                            ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                            <small>Fermata ${index + 1} di ${ritornoStopsIds.length}</small>
                        </div>
                    `;
                    
                    marker.bindPopup(popupContent);
                    window.busStopsLayer2_R.addLayer(marker);
                    
                    orderedStopsRitorno.push({
                        ...node,
                        isCapolinea: isCapolinea,
                        position: index + 1
                    });
                }
            });

            // Aggiunge il layer alla mappa
            window.map.addLayer(window.busStopsLayer2_R);
            
            // Aggiorna il pannello con ENTRAMBE le direzioni
            updateLineInfoPanelWithBothDirections2(andataData, orderedStopsRitorno);

        } catch (error) {
            console.error("Errore nel caricamento delle fermate ritorno:", error);
        }
        
    }, 1000);
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
// COMMENTATO: Caricamento automatico disabilitato per migliorare le performance
// getBusRoute2();
