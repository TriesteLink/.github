# Sistema Bus Parametrico - Documentazione

## Panoramica
Il nuovo sistema parametrico riduce drasticamente la duplicazione del codice passando da 580+ righe per file a un sistema modulare centralizzato.

## Struttura dei File

### 1. `linesConfig.js`
Contiene la configurazione centralizzata di tutte le linee:
- Colori delle linee
- ID delle relazioni OpenStreetMap
- Array ordinati delle fermate per andata e ritorno

### 2. `busLinesFunctions.js` 
Contiene tutte le funzioni parametriche generiche:
- `getBusRoute(lineNumber, color)` - Carica il percorso di una linea
- `getBusStopsDirection(lineNumber, direction)` - Carica fermate per una direzione specifica
- `getBusStopsAndata(lineNumber)` - Carica fermate andata
- `getBusStopsRitorno(lineNumber)` - Carica fermate ritorno
- `getBusStopsAll(lineNumber)` - Carica entrambe le direzioni
- `getBusStops(lineNumber)` - Fallback per linee senza fermate ordinate

### 3. `busLinesManager.js`
Mantiene la retrocompatibilità e fornisce esempi di utilizzo

### 4. `testParametricSystem.js`
Test per verificare il funzionamento del sistema

## Utilizzo

### Esempi Base
```javascript
// Carica il percorso della linea 17
getBusRoute(17);

// Carica il percorso della linea 17 con colore personalizzato
getBusRoute(17, "darkblue");

// Carica fermate andata linea 17
getBusStopsAndata(17);

// Carica fermate ritorno linea 17
getBusStopsRitorno(17);

// Carica entrambe le direzioni
getBusStopsAll(17);
```

### Retrocompatibilità
Le vecchie funzioni continuano a funzionare:
```javascript
getBusRoute17(); // equivale a getBusRoute(17)
getBusStopsA17(); // equivale a getBusStopsAndata(17)
getBusStopsR17(); // equivale a getBusStopsRitorno(17)
```

## Aggiungere una Nuova Linea

### Passo 1: Configurazione
Aggiungi la configurazione in `linesConfig.js`:
```javascript
8: {
    color: "purple",
    relations: {
        andata: "12345678",
        ritorno: "87654321"
    },
    stops: {
        andata: ["stop1", "stop2", "stop3"],
        ritorno: ["stop3", "stop2", "stop1"]
    }
}
```

### Passo 2: Utilizzo Immediato
```javascript
// Ora puoi immediatamente usare:
getBusRoute(8);
getBusStopsAndata(8);
getBusStopsRitorno(8);
```

### Passo 3: Funzioni di Convenienza (Opzionale)
Aggiungi in `busLinesManager.js` per retrocompatibilità:
```javascript
function getBusRoute8() {
    return getBusRoute(8);
}
```

## Vantaggi del Nuovo Sistema

### 1. Riduzione Codice
- **Prima**: 580+ righe × 6 linee = 3480+ righe totali
- **Dopo**: ~400 righe totali per tutto il sistema

### 2. Manutenibilità
- Modifiche a una funzione si applicano a tutte le linee
- Aggiungere una linea richiede solo aggiornare la configurazione

### 3. Consistenza
- Tutte le linee usano lo stesso stile e comportamento
- Riduzione degli errori dovuti a copie/incolla

### 4. Flessibilità
- Facile cambiare colori, stili, comportamenti
- Sistema di fallback per linee incomplete

## Migrazione Graduale

Il sistema è progettato per una migrazione graduale:
1. ✅ Sistema parametrico implementato
2. ✅ Retrocompatibilità garantita
3. 🔄 Testare le linee una per una
4. 📝 Rimuovere i vecchi file quando pronti

## Test

Esegui `testParametricSystem.js` nella console del browser per verificare il funzionamento.

## Configurazioni Linee Attuali

- **Linea 2**: Completamente configurata (andata/ritorno)
- **Linea 17**: Completamente configurata (andata/ritorno)
- **Linea 6**: Configurazione base (da completare fermate)
- **Linea 17B**: Configurazione base (da completare fermate)
- **Linea 36**: Configurazione base (da completare fermate)

## Prossimi Passi

1. Completare la configurazione delle fermate per linee 6, 17B, 36
2. Testare tutte le funzionalità
3. Rimuovere gradualmente i vecchi file .js delle singole linee
4. Aggiungere nuove linee usando il sistema parametrico