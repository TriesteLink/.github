// Debug per linea 17 - esegui nella console del browser

console.log('🔍 DEBUG LINEA 17 - ANDATA E RITORNO');

// Test 1: Verifica configurazione
const config17 = getLineConfig(17);
console.log('📋 Configurazione linea 17:', config17);
console.log('📍 Fermate andata:', config17?.stops?.andata?.length || 0);
console.log('📍 Fermate ritorno:', config17?.stops?.ritorno?.length || 0);

// Test 2: Verifica array fermate ritorno
if (config17?.stops?.ritorno) {
    console.log('🔄 Fermate ritorno IDs:', config17.stops.ritorno);
}

// Test 3: Test getBusStopsDirectionSilent per ritorno
console.log('🧪 Test caricamento fermate ritorno...');
setTimeout(async () => {
    try {
        const ritornoData = await getBusStopsDirectionSilent(17, "ritorno");
        console.log('✅ Dati ritorno ricevuti:', ritornoData);
        console.log('📊 Numero fermate ritorno:', ritornoData.length);
        
        if (ritornoData.length === 0) {
            console.error('❌ PROBLEMA: 0 fermate ritorno caricate');
            
            // Test manuale della query
            const nodeIds = config17.stops.ritorno.join(',');
            const query = `[out:json];
node(id:${nodeIds});
out body;`;
            const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
            
            console.log('🔗 URL query Overpass:', url);
            console.log('📝 Query:', query);
            
            // Test della fetch
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log('🌐 Risposta Overpass:', data);
                    console.log('📦 Elementi trovati:', data.elements?.length || 0);
                })
                .catch(error => {
                    console.error('💥 Errore fetch:', error);
                });
        }
    } catch (error) {
        console.error('💥 Errore getBusStopsDirectionSilent:', error);
    }
}, 1000);

// Test 4: Confronto con andata
setTimeout(async () => {
    console.log('🔄 Test andata per confronto...');
    try {
        const andataData = await getBusStopsDirectionSilent(17, "andata");
        console.log('✅ Dati andata ricevuti:', andataData.length, 'fermate');
    } catch (error) {
        console.error('💥 Errore andata:', error);
    }
}, 2000);