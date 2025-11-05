// Test semplificato per debug linea 17
// Esegui nella console del browser

console.clear();
console.log('🔍 TEST RAPIDO LINEA 17');

// Test diretto
setTimeout(() => {
    console.log('📋 1. Test configurazione...');
    const config = getLineConfig(17);
    console.log('Andata:', config?.stops?.andata?.length);
    console.log('Ritorno:', config?.stops?.ritorno?.length);

    setTimeout(() => {
        console.log('🚀 2. Test getBusStopsAll...');
        getBusStopsAll(17);
    }, 1000);

}, 500);