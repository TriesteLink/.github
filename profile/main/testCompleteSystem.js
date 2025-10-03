// Test rapido del nuovo sistema parametrico
// Esegui questo nella console del browser per testare

console.log('🧪 INIZIO TEST SISTEMA PARAMETRICO 🧪');

// Test 1: Verifica caricamento configurazione
console.log('1️⃣ Test configurazione...');
try {
    const linee = getAvailableLines();
    console.log('✅ Linee disponibili:', linee);
    
    linee.forEach(num => {
        const config = getLineConfig(num);
        console.log(`📋 Linea ${num}:`, {
            colore: config.color,
            relazioni: config.relations,
            fermate_andata: config.stops.andata.length,
            fermate_ritorno: config.stops.ritorno.length
        });
    });
} catch (error) {
    console.error('❌ Errore configurazione:', error);
}

// Test 2: Test caricamento linea 17
console.log('\n2️⃣ Test caricamento linea 17...');
try {
    getBusRoute(17);
    console.log('✅ Percorso linea 17 caricato');
    
    setTimeout(() => {
        console.log('⏳ Caricamento fermate andata linea 17...');
        getBusStopsAndata(17);
    }, 2000);
} catch (error) {
    console.error('❌ Errore linea 17:', error);
}

// Test 3: Test caricamento linea 2
console.log('\n3️⃣ Test caricamento linea 2...');
setTimeout(() => {
    try {
        getBusRoute(2);
        console.log('✅ Percorso linea 2 caricato');
        
        setTimeout(() => {
            console.log('⏳ Caricamento fermate complete linea 2...');
            getBusStopsAll(2);
        }, 1000);
    } catch (error) {
        console.error('❌ Errore linea 2:', error);
    }
}, 3000);

// Test 4: Test retrocompatibilità
console.log('\n4️⃣ Test retrocompatibilità...');
setTimeout(() => {
    try {
        console.log('⏳ Test getBusRoute17() legacy...');
        getBusRoute17();
        console.log('✅ Funzione legacy funzionante');
    } catch (error) {
        console.error('❌ Errore retrocompatibilità:', error);
    }
}, 5000);

console.log('\n🔚 Test completati. Controlla i risultati sopra e nella mappa!');
console.log('\n💡 Se tutto funziona, puoi rimuovere i vecchi file .js delle linee');

// Test 5: Verifica layer dinamici
setTimeout(() => {
    console.log('\n5️⃣ Verifica layer dinamici creati...');
    
    const linee = getAvailableLines();
    linee.forEach(num => {
        const routeLayer = window[`routeLayer${num}`];
        const stopsLayer = window[`busStopsLayer${num}`];
        
        console.log(`📍 Linea ${num}:`, {
            percorso: routeLayer ? '✅' : '❌',
            fermate: stopsLayer ? '✅' : '❌'
        });
    });
}, 7000);