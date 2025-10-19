// Funzione di test alternativa per getBusStopsAll
// Aggiungi alla console del browser per testare

async function testGetBusStopsAll17() {
    console.log('🧪 TEST ALTERNATIVO getBusStopsAll per linea 17');
    
    try {
        // Test separato per andata
        console.log('⏳ Test andata...');
        const andataResult = await getBusStopsDirectionSilent(17, "andata");
        console.log('✅ Andata completata:', andataResult.length, 'fermate');
        
        // Aspetta un po'
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test separato per ritorno
        console.log('⏳ Test ritorno...');
        const ritornoResult = await getBusStopsDirectionSilent(17, "ritorno");
        console.log('✅ Ritorno completato:', ritornoResult.length, 'fermate');
        
        // Test pannello
        if (typeof updateLineInfoPanelWithBothDirections === 'function') {
            console.log('🎨 Aggiornamento pannello...');
            updateLineInfoPanelWithBothDirections(17, andataResult, ritornoResult);
            console.log('✅ Pannello aggiornato');
        } else {
            console.error('❌ Funzione pannello non trovata');
        }
        
        return {
            andata: andataResult.length,
            ritorno: ritornoResult.length
        };
        
    } catch (error) {
        console.error('💥 Errore nel test:', error);
    }
}

// Esegui il test
testGetBusStopsAll17();