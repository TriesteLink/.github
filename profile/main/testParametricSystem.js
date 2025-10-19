// Test del nuovo sistema parametrico - da aggiungere alla console del browser per testare

console.log('=== TEST DEL SISTEMA PARAMETRICO ===');

// Test 1: Verifica configurazione linee
console.log('1. Linee disponibili:', getAvailableLines());

// Test 2: Verifica configurazione specifica linea 17
const config17 = getLineConfig(17);
console.log('2. Configurazione linea 17:', config17);

// Test 3: Carica il percorso della linea 17
console.log('3. Caricamento percorso linea 17...');
getBusRoute(17);

// Test 4: Dopo 2 secondi, carica le fermate andata linea 17
setTimeout(() => {
    console.log('4. Caricamento fermate andata linea 17...');
    getBusStopsAndata(17);
}, 2000);

// Test 5: Dopo 4 secondi, carica le fermate ritorno linea 17  
setTimeout(() => {
    console.log('5. Caricamento fermate ritorno linea 17...');
    getBusStopsRitorno(17);
}, 4000);

// Test 6: Dopo 6 secondi, test linea 2
setTimeout(() => {
    console.log('6. Test linea 2...');
    getBusRoute(2);
    setTimeout(() => getBusStopsAndata(2), 1000);
}, 6000);

// Test 7: Test funzioni di retrocompatibilità
setTimeout(() => {
    console.log('7. Test retrocompatibilità - usando getBusRoute17()...');
    getBusRoute17(); // Dovrebbe funzionare esattamente come prima
}, 8000);

console.log('Tests programmati. Controlla la console nei prossimi 10 secondi...');