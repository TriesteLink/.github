// Test manuale semplificato per la linea 17 ritorno
// Copia e incolla nella console del browser

console.clear();
console.log('🧪 TEST MANUALE LINEA 17 RITORNO');

// Test 1: Verifica configurazione
const config = getLineConfig(17);
console.log('Config linea 17:', config);

if (config && config.stops && config.stops.ritorno) {
    console.log('✅ Configurazione ritorno OK:', config.stops.ritorno.length, 'fermate');
    
    // Test 2: Costruisci query manualmente
    const nodeIds = config.stops.ritorno.join(',');
    const query = `[out:json];
node(id:${nodeIds});
out body;`;
    
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
    
    console.log('🌐 URL:', url);
    console.log('📝 Query:', query);
    
    // Test 3: Fetch manuale
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('📦 Risposta Overpass:', data);
            console.log('📊 Elementi:', data.elements ? data.elements.length : 0);
            
            if (data.elements && data.elements.length > 0) {
                console.log('✅ Dati ricevuti correttamente!');
                console.log('🗂️ Primo elemento:', data.elements[0]);
            } else {
                console.log('❌ Nessun elemento ricevuto');
                if (data.remark) {
                    console.log('⚠️ Remark:', data.remark);
                }
            }
        })
        .catch(error => {
            console.error('💥 Errore fetch:', error);
        });
} else {
    console.error('❌ Configurazione ritorno non trovata!');
}