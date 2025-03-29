# Cosa ci serve

1. **Accesso ai dati in tempo reale**: Per fornire informazioni aggiornate sulla posizione degli autobus, quindi i servizi di TPL FVG, anche se so che non c'è un servizio libero per avere le loro API oubbliche 
2. **Utilizzo di API di terze parti**: in caso sti cancari non le diano, trovare se ne esistono di terze parti.
3. **Normative privacy**: per fare una cosa simile probabilmente sarebbe da contattare direttamete le utorità locali per capire dove siamo limitati e dove invece possiamo agire in tranquillità.

# Pacchetti utilizzati

Sto utilizzando OpenStreetMap (OSM) come "fornitore" di informazioni, avvalendomi della loro guida sul sito, comprese di librerie e API, per ora il pacchetto che sto utilizzando è **Leaflet.js**, essendo che utilizziamo javascript: è facile da utilizzare e e per le integrazioni, ed inoltre permette di aggiungere i marker per fermate e tracciare le linee, sarà utile se integreremo il tempo reale.

# Overpass API
## Fermate

Con [questo sito](https://overpass-turbo.eu/index.html) posso usare il sistema per ottenere tutti i dati specifici.

Andando a leggere la guida, per ottenere tutte le fermate di Trieste ho utilizzato questa query nel loro ambiente di sviluppo:
```query 
[out:json];
area["name"="Trieste"]->.searchArea;
node["highway"="bus_stop"](area.searchArea);
out body;
```
appunto, questa cerca i nodi che hanno il tag "highway"="bus_stop" per le fermate del bus.

Poi con il js in pratica sistemo un marker per ogni fermata con il relativo nome in evidenza.

## Linee

Ora, le linee sono generalmente mappate come relazioni con il tag type=route e route=bus. Ora, questo comando purtroppo non mostra sulla mappa nessun tipo di segno visivo, ma rimanda in console svariate coordiante, quindi, presumo che saranno da tracciare a mano, utilzzando comandi (che devo ancora scoprire)