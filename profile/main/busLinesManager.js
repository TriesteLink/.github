// File di esempio per dimostrare l'utilizzo delle nuove funzioni parametriche
// Questo file sostituisce completamente i vecchi file delle singole linee

// Inizializzazione dei layer per tutte le linee configurate
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inizializzazione sistema bus parametrico...');
    
    // Inizializza i layer per tutte le linee disponibili
    const availableLines = getAvailableLines();
    availableLines.forEach(lineNumber => {
        initializeBusStopsLayer(lineNumber);
        console.log(`Layer inizializzato per linea ${lineNumber}`);
    });
});

// Esempi di utilizzo delle nuove funzioni parametriche:

// Carica il percorso della linea 17 con colore blu (specificato nella config)
// getBusRoute(17);

// Carica il percorso della linea 17 con un colore personalizzato
// getBusRoute(17, "darkblue");

// Carica il percorso della linea 2 con colore arancione (dalla config)
// getBusRoute(2);

// Carica le fermate andata della linea 17
// getBusStopsAndata(17);

// Carica le fermate ritorno della linea 17
// getBusStopsRitorno(17);

// Carica entrambe le direzioni della linea 17
// getBusStopsAll(17);

// Funzioni di convenienza per mantenere la retrocompatibilità
function getBusRoute17() {
    return getBusRoute(17);
}

function getBusStopsA17() {
    return getBusStopsAndata(17);
}

function getBusStopsR17() {
    return getBusStopsRitorno(17);
}

function getBusStopsAll17() {
    return getBusStopsAll(17);
}

function getBusStops17() {
    return getBusStops(17);
}

// Linea 2
function getBusRoute2() {
    return getBusRoute(2);
}

function getBusStopsA2() {
    return getBusStopsAndata(2);
}

function getBusStopsR2() {
    return getBusStopsRitorno(2);
}

function getBusStopsAll2() {
    return getBusStopsAll(2);
}

function getBusStops2() {
    return getBusStops(2);
}

// Linea 6
function getBusRoute6() {
    return getBusRoute(6);
}

function getBusStops6() {
    return getBusStops(6);
}

// Linea 17B
function getBusRoute17B() {
    return getBusRoute("17B");
}

function getBusStops17B() {
    return getBusStops("17B");
}

// Linea 36
function getBusRoute36() {
    return getBusRoute(36);
}

function getBusStops36() {
    return getBusStops(36);
}

// Esempi di utilizzo avanzato:

/**
 * Carica tutte le linee disponibili
 */
function loadAllLines() {
    const availableLines = getAvailableLines();
    availableLines.forEach(lineNumber => {
        getBusRoute(lineNumber);
    });
}

/**
 * Carica una linea specifica con gestione degli errori
 */
async function loadLineWithErrorHandling(lineNumber) {
    try {
        await getBusRoute(lineNumber);
        console.log(`Linea ${lineNumber} caricata con successo`);
    } catch (error) {
        console.error(`Errore nel caricamento della linea ${lineNumber}:`, error);
    }
}

/**
 * Carica le fermate di una specifica direzione per una linea
 */
async function loadStopsForDirection(lineNumber, direction) {
    try {
        const stops = await getBusStopsDirection(lineNumber, direction);
        console.log(`Caricate ${stops.length} fermate per linea ${lineNumber} ${direction}`);
        return stops;
    } catch (error) {
        console.error(`Errore nel caricamento fermate ${direction} linea ${lineNumber}:`, error);
        return [];
    }
}

// Esporta le funzioni di convenienza per mantenere la compatibilità
window.getBusRoute17 = getBusRoute17;
window.getBusStopsA17 = getBusStopsA17;
window.getBusStopsR17 = getBusStopsR17;
window.getBusStopsAll17 = getBusStopsAll17;
window.getBusStops17 = getBusStops17;

window.getBusRoute2 = getBusRoute2;
window.getBusStopsA2 = getBusStopsA2;
window.getBusStopsR2 = getBusStopsR2;
window.getBusStopsAll2 = getBusStopsAll2;
window.getBusStops2 = getBusStops2;

window.getBusRoute6 = getBusRoute6;
window.getBusStops6 = getBusStops6;

window.getBusRoute17B = getBusRoute17B;
window.getBusStops17B = getBusStops17B;

window.getBusRoute36 = getBusRoute36;
window.getBusStops36 = getBusStops36;

// Funzioni di utilità
window.loadAllLines = loadAllLines;
window.loadLineWithErrorHandling = loadLineWithErrorHandling;
window.loadStopsForDirection = loadStopsForDirection;