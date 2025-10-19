// Test per verificare il pannello con entrambe le direzioni
// Esegui nella console del browser

console.log('🧪 TEST PANNELLO ANDATA + RITORNO');

// Test con la linea 17
console.log('⏳ Testando linea 17 con entrambe le direzioni...');

setTimeout(() => {
    getBusRoute(17);
    
    setTimeout(() => {
        getBusStopsAll(17);
        console.log('✅ Linea 17: andata + ritorno dovrebbero essere visibili nel pannello');
    }, 1000);
}, 500);

// Test con la linea 2
setTimeout(() => {
    console.log('⏳ Testando linea 2 con entrambe le direzioni...');
    
    getBusRoute(2);
    
    setTimeout(() => {
        getBusStopsAll(2);
        console.log('✅ Linea 2: andata + ritorno dovrebbero essere visibili nel pannello');
    }, 1000);
}, 4000);

console.log('🔍 Controlla il pannello laterale per vedere entrambe le direzioni!');