// Configurazione centralizzata di tutte le linee bus
const LINES_CONFIG = {
    2: {
        color: "#FF6B35",
        relations: {
            andata: "13286981",
            ritorno: "13286982"
        },
        stops: {
            andata: [
                "269060873", // capolinea Via Galatti
                "789906872",
                "789896987",
                "789845210",
                "789876206",
                "789876530",
                "8715832760",
                "8715832759",
                "7029958990",
                "4956308015",
                "4956308016",
                "7029958989",
                "8715832758",
                "7029958988",
                "651673083"  // capolinea Via Nazionale (Piazzale Monte Re)
            ],
            ritorno: [
                "7029958988", // capolinea Via Nazionale (Piazzale Monte Re)
                "8715832758",
                "7029958989",
                "7710286111",
                "4956308013",
                "9122425642",
                "9124030040",
                "9216810967",
                "789880589",
                "789876534",
                "789876207",
                "789845447",
                "789897439",
                "789908256",
                "789912569",
                "269060873"  // capolinea Via Galatti
            ]
        }
    },
    
    6: {
        color: "green",
        relations: {
            andata: "13295182",
            ritorno: "13295183"
        },
        stops: {
            andata: [], // Da completare con i dati corretti
            ritorno: []
        }
    },
    
    17: {
        color: "blue",
        relations: {
            andata: "13300193",
            ritorno: "13300194"
        },
        stops: {
            andata: [
                "8577834117", // capolinea
                "1621660255",
                "7608819302",
                "4589306199",
                "4589306200",
                "270231408",
                "789981414",
                "268201214",
                "627851056",
                "627851058",
                "627851059",
                "627851062",
                "627851064",
                "273840241",
                "273840235",
                "273840233",
                "270561142",
                "4530646129",
                "281171668"  // capolinea
            ],
            ritorno: [
                "281171668", // capolinea
                "390873856",
                "270561143",
                "273840231",
                "273840230",
                "273840237",
                "627851063",
                "627851061",
                "627851060",
                "627851057",
                "627851055",
                "789920196",
                "789920203",
                "789920212",
                "4589307293",
                "4589264599",
                "9109518640",
                "1621660256",
                "296398798",
                "8577834117"  // capolinea
            ]
        }
    },
    
    "17B": {
        color: "red",
        relations: {
            andata: "13307218",
            ritorno: "13300195"
        },
        stops: {
            andata: [], // Da completare con i dati corretti
            ritorno: []
        }
    },
    
    36: {
        color: "violet",
        relations: {
            andata: "13365168",
            ritorno: "13365169"
        },
        stops: {
            andata: [], // Da completare con i dati corretti
            ritorno: []
        }
    }
};

// Funzione per ottenere la configurazione di una linea
function getLineConfig(lineNumber) {
    return LINES_CONFIG[lineNumber];
}

// Funzione per ottenere tutte le linee disponibili
function getAvailableLines() {
    return Object.keys(LINES_CONFIG);
}

// Esporta la configurazione per l'uso globale
window.LINES_CONFIG = LINES_CONFIG;
window.getLineConfig = getLineConfig;
window.getAvailableLines = getAvailableLines;