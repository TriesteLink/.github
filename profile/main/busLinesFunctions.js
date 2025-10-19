// Funzioni parametriche per la gestione delle linee bus

/**
 * Funzione generica per caricare il percorso di una linea bus
 * @param {string|number} lineNumber - Numero della linea (es: 17, "17B", 2)
 * @param {string} color - Colore della linea (opzionale, se non specificato usa quello della config)
 */
async function getBusRoute(lineNumber, color = null) {
    const config = getLineConfig(lineNumber);
    if (!config) {
        console.error(`Configurazione non trovata per la linea ${lineNumber}`);
        return;
    }

    const lineColor = color || config.color;
    const relations = `${config.relations.andata},${config.relations.ritorno}`;
    
    const query = `[out:json];
    rel(id:${relations});
    (._; >;);
    out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();
        let routesGeoJSON = window.osmToGeoJSON(data);

        // Nome del layer dinamico basato sulla linea
        const layerName = `routeLayer${lineNumber}`;
        
        // Controlla se il layer esiste già e rimuovilo
        if (window[layerName]) {
            window.map.removeLayer(window[layerName]);
        }

        // Crea un nuovo layer e assegnalo dinamicamente
        window[layerName] = L.geoJSON(routesGeoJSON, {
            style: { color: lineColor, weight: 3 }
        }).addTo(window.map);

        // Aggiungi evento per mostrare/nascondere fermate
        window[layerName].on('click', function () {
            const busStopsLayerName = `busStopsLayer${lineNumber}`;
            if (window.map.hasLayer(window[busStopsLayerName])) {
                window.map.removeLayer(window[busStopsLayerName]);
            } else {
                getBusStops(lineNumber);
            }
        });

        console.log(`Caricata linea ${lineNumber} con colore ${lineColor}`);

    } catch (error) {
        console.error(`Errore nel caricamento della linea ${lineNumber}:`, error);
    }
}

/**
 * Funzione generica per caricare le fermate di una specifica direzione
 * @param {string|number} lineNumber - Numero della linea
 * @param {string} direction - "andata" o "ritorno"
 */
async function getBusStopsDirection(lineNumber, direction) {
    const config = getLineConfig(lineNumber);
    if (!config || !config.stops[direction]) {
        console.error(`Configurazione ${direction} non trovata per la linea ${lineNumber}`);
        return [];
    }

    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    const layerName = `busStopsLayer${lineNumber}_${direction.charAt(0).toUpperCase()}`;
    
    // Pulisce il layer precedente
    if (window[layerName]) {
        window[layerName].clearLayers();
    } else {
        window[layerName] = L.layerGroup();
    }

    const stopsIds = config.stops[direction];
    if (stopsIds.length === 0) {
        console.log(`Nessuna fermata configurata per la linea ${lineNumber} ${direction}`);
        return [];
    }

    // Query Overpass per ottenere i dettagli delle fermate specifiche
    const nodeIds = stopsIds.join(',');
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

        // Crea i marker nell'ordine corretto
        stopsIds.forEach((stopId, index) => {
            const node = stopsData[stopId];
            if (node) {
                // Determina se è capolinea
                const isCapolinea = index === 0 || index === stopsIds.length - 1;
                const stopName = node.tags?.name || `Fermata ${stopId}`;

                // Icona uniforme per tutte le fermate, capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: `bus-stop-marker linea${lineNumber}`,
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : config.color}; 
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
                        <b style="color: ${config.color};">Linea ${lineNumber}</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${stopsIds.length}</small>
                    </div>
                `;

                marker.bindPopup(popupContent);
                window[layerName].addLayer(marker);

                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window[layerName]);
        
        // Imposta come layer attivo
        window.activeBusStopsLayer = window[layerName];
        
        // Aggiorna il pannello informativo con le fermate ordinate
        updateLineInfoPanelWithOrderedStops(lineNumber.toString(), config.color, direction.toUpperCase(), orderedStops);

        console.log(`Caricate ${orderedStops.length} fermate della linea ${lineNumber} ${direction} in ordine corretto`);
        return orderedStops;

    } catch (error) {
        console.error(`Errore nel caricamento delle fermate ${direction} linea ${lineNumber}:`, error);
        return [];
    }
}

/**
 * Funzione per caricare fermate di una direzione senza aggiornare il pannello
 * @param {string|number} lineNumber - Numero della linea
 * @param {string} direction - "andata" o "ritorno"
 */
async function getBusStopsDirectionSilent(lineNumber, direction) {
    console.log(`🔍 getBusStopsDirectionSilent: Linea ${lineNumber}, Direzione ${direction}`);
    
    const config = getLineConfig(lineNumber);
    if (!config || !config.stops[direction]) {
        console.error(`Configurazione ${direction} non trovata per la linea ${lineNumber}`);
        return [];
    }

    console.log(`📋 Configurazione trovata per linea ${lineNumber}:`, config);

    const layerName = `busStopsLayer${lineNumber}_${direction.charAt(0).toUpperCase()}`;
    console.log(`🎯 Nome layer: ${layerName}`);
    
    // Pulisce il layer precedente
    if (window[layerName]) {
        window[layerName].clearLayers();
    } else {
        window[layerName] = L.layerGroup();
    }

    const stopsIds = config.stops[direction];
    console.log(`📍 Fermate ${direction} configurate:`, stopsIds.length, stopsIds);
    
    if (stopsIds.length === 0) {
        console.log(`Nessuna fermata configurata per la linea ${lineNumber} ${direction}`);
        return [];
    }

    // Query Overpass per ottenere i dettagli delle fermate specifiche
    const nodeIds = stopsIds.join(',');
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

        // Array per memorizzare le fermate ordinate
        const orderedStops = [];

        // Crea i marker nell'ordine corretto
        stopsIds.forEach((stopId, index) => {
            const node = stopsData[stopId];
            if (node) {
                // Determina se è capolinea
                const isCapolinea = index === 0 || index === stopsIds.length - 1;
                const stopName = node.tags?.name || `Fermata ${stopId}`;

                // Icona uniforme per tutte le fermate, capolinea in rosso
                const marker = L.marker([node.lat, node.lon], {
                    icon: L.divIcon({
                        className: `bus-stop-marker linea${lineNumber}`,
                        html: `<div style="
                            background-color: ${isCapolinea ? '#FF5722' : config.color}; 
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
                        <b style="color: ${config.color};">Linea ${lineNumber}</b><br>
                        <strong>${stopName}</strong><br>
                        ${isCapolinea ? '<span style="color: #FF5722; font-weight: bold;">CAPOLINEA</span><br>' : ''}
                        <small>Fermata ${index + 1} di ${stopsIds.length} (${direction.toUpperCase()})</small>
                    </div>
                `;

                marker.bindPopup(popupContent);
                window[layerName].addLayer(marker);

                // Aggiungi alla lista per l'info panel
                orderedStops.push({
                    ...node,
                    isCapolinea: isCapolinea,
                    position: index + 1
                });
            }
        });

        // Aggiunge il layer alla mappa
        window.map.addLayer(window[layerName]);
        
        console.log(`Caricate ${orderedStops.length} fermate della linea ${lineNumber} ${direction} (silenzioso)`);
        return orderedStops;

    } catch (error) {
        console.error(`Errore nel caricamento delle fermate ${direction} linea ${lineNumber}:`, error);
        return [];
    }
}

/**
 * Funzioni di convenienza per andata e ritorno
 */
async function getBusStopsAndata(lineNumber) {
    return await getBusStopsDirection(lineNumber, "andata");
}

async function getBusStopsRitorno(lineNumber) {
    return await getBusStopsDirection(lineNumber, "ritorno");
}

/**
 * Funzione per caricare entrambe le direzioni
 * @param {string|number} lineNumber - Numero della linea
 */
async function getBusStopsAll(lineNumber) {
    console.log(`🚀 getBusStopsAll chiamata per linea ${lineNumber}`);
    
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    try {
        // Carica entrambe le direzioni senza aggiornare il pannello individualmente
        console.log(`⏳ Caricamento andata per linea ${lineNumber}...`);
        const andataData = await getBusStopsDirectionSilent(lineNumber, "andata");
        console.log(`✅ Andata caricata: ${andataData.length} fermate`);
        
        console.log(`⏳ Caricamento ritorno per linea ${lineNumber}...`);
        const ritornoData = await getBusStopsDirectionSilent(lineNumber, "ritorno");
        console.log(`✅ Ritorno caricato: ${ritornoData.length} fermate`);
        
        // Imposta il layer attivo come quello dell'andata (per compatibilità)
        const andataLayerName = `busStopsLayer${lineNumber}_A`;
        if (window[andataLayerName]) {
            window.activeBusStopsLayer = window[andataLayerName];
        }
        
        // Aggiorna il pannello con entrambe le direzioni
        if (typeof updateLineInfoPanelWithBothDirections === 'function') {
            console.log(`🎨 Aggiornamento pannello con entrambe le direzioni...`);
            updateLineInfoPanelWithBothDirections(lineNumber, andataData, ritornoData);
        } else {
            // Fallback se la funzione non esiste
            console.log(`⚠️ Usando fallback per pannello...`);
            updateLineInfoPanelWithOrderedStops(lineNumber.toString(), getLineConfig(lineNumber)?.color || "blue", "ANDATA", andataData);
        }
        
        console.log(`✅ Completato caricamento linea ${lineNumber}: ${andataData.length} andata, ${ritornoData.length} ritorno`);
        
    } catch (error) {
        console.error(`❌ Errore in getBusStopsAll per linea ${lineNumber}:`, error);
    }
}


/**
 * Funzione generica per linee senza fermate ordinate (fallback al sistema originale)
 * @param {string|number} lineNumber - Numero della linea
 */
async function getBusStops(lineNumber) {
    const config = getLineConfig(lineNumber);
    if (!config) {
        console.error(`Configurazione non trovata per la linea ${lineNumber}`);
        return;
    }

    // Se la linea ha fermate ordinate, usa il nuovo sistema
    if (config.stops.andata && config.stops.andata.length > 0) {
        return await getBusStopsAndata(lineNumber);
    }

    // Altrimenti usa il sistema originale per retrocompatibilità
    // Rimuove le fermate della linea precedente, se presenti
    if (window.activeBusStopsLayer) {
        window.map.removeLayer(window.activeBusStopsLayer);
    }

    const layerName = `busStopsLayer${lineNumber}`;
    if (!window[layerName]) {
        window[layerName] = L.layerGroup().addTo(window.map);
    }
    window[layerName].clearLayers();

    const relations = `${config.relations.andata},${config.relations.ritorno}`;
    const query = `[out:json];
rel(id:${relations});
node(r)->.stops;
.stops out body;`;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        let response = await fetch(url);
        let data = await response.json();

        data.elements.forEach(node => {
            let marker = L.marker([node.lat, node.lon])
                .bindPopup(node.tags.name || `Fermata ${lineNumber}`);
            window[layerName].addLayer(marker);
        });

        window.map.addLayer(window[layerName]);
        window.activeBusStopsLayer = window[layerName];

    } catch (error) {
        console.error(`Errore nel caricamento delle fermate linea ${lineNumber}:`, error);
    }
}

/**
 * Funzione per inizializzare i layer delle fermate per una linea
 * @param {string|number} lineNumber - Numero della linea
 */
function initializeBusStopsLayer(lineNumber) {
    const layerName = `busStopsLayer${lineNumber}`;
    if (!window[layerName]) {
        window[layerName] = L.layerGroup().addTo(window.map);
    }
}

// Esporta le funzioni per l'uso globale
window.getBusRoute = getBusRoute;
window.getBusStopsDirection = getBusStopsDirection;
window.getBusStopsDirectionSilent = getBusStopsDirectionSilent;
window.getBusStopsAndata = getBusStopsAndata;
window.getBusStopsRitorno = getBusStopsRitorno;
window.getBusStopsAll = getBusStopsAll;
window.getBusStops = getBusStops;
window.initializeBusStopsLayer = initializeBusStopsLayer;