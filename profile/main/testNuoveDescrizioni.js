// Test per verificare i nuovi nomi delle direzioni
// Esegui nella console del browser

console.clear();
console.log('🎨 TEST NUOVI NOMI DIREZIONI');

// Test 1: Verifica configurazione linea 2
console.log('📋 1. Test configurazione linea 2...');
const config2 = getLineConfig(2);
console.log('Linea 2 - Andata:', config2?.directions?.andata);
console.log('Linea 2 - Ritorno:', config2?.directions?.ritorno);

// Test 2: Verifica configurazione linea 17
console.log('📋 2. Test configurazione linea 17...');
const config17 = getLineConfig(17);
console.log('Linea 17 - Andata:', config17?.directions?.andata);
console.log('Linea 17 - Ritorno:', config17?.directions?.ritorno);

// Test 3: Test visuale linea 2
setTimeout(() => {
    console.log('🚌 3. Test visuale linea 2...');
    getBusRoute(2);
    
    setTimeout(() => {
        getBusStopsAll(2);
        console.log('✅ Controlla il pannello laterale - dovrebbe mostrare "Via Galatti → Via Nazionale" e "Via Nazionale → Via Galatti"');
    }, 1000);
}, 1000);

// Test 4: Test visuale linea 17
setTimeout(() => {
    console.log('🚌 4. Test visuale linea 17...');
    getBusRoute(17);
    
    setTimeout(() => {
        getBusStopsAll(17);
        console.log('✅ Controlla il pannello laterale - dovrebbe mostrare "Campo Marzio → San Cilino" e "San Cilino → Campo Marzio"');
    }, 1000);
}, 4000);

console.log('🎯 I pannelli dovrebbero ora mostrare i capolinea effettivi invece di "Andata/Ritorno"!');