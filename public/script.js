
const term = new Terminal({
    fontSize: 20,  
    fontFamily: 'Fira Code , monospace',    //fontFamily: 'Noto Sans, monospace',
    cursorBlink: true,   // Pour faire clignoter le curseur
    cursorStyle: 'bar',  // Pour avoir une barre verticale
    lineHeight: 1.25, // Ajuster pour éviter les coupure    s verticales
    rows: 17,
    cols: 80,
    theme: {
        foreground: '#e0def4',
        background: '#32374A',
        cursor: '#adadad',
        black: '#000000',
        red: '#d81e00',
        green: '#3e8fb0',
        yellow: '#cfae00',
        blue: '#427ab3',
        magenta: '#89658e',
        cyan: '#34e2e2',
        white: '#e0def4',
        brightBlack: '#686a66',
    }
});


function resizeTerminal() {
    fitAddon.fit();
    const windowHeight = window.innerHeight;
    const rough = Math.round(0.0206 * windowHeight - 2.2448);
    term.resize(term.cols - 1, rough);
    console.log(' -- Cols:', term.cols, 'Rows:', term.rows, 'heigh', windowHeight, 'Calculated Tows', rough);
}

const fitAddon = new FitAddon.FitAddon();
const webglAddon = new WebglAddon.WebglAddon();


term.loadAddon(fitAddon);
term.loadAddon(webglAddon);
term.open(document.getElementById('terminal'));
resizeTerminal();

/* fonction pas très bien gérée pour le moment, pour les grands écrans cela zoome dans la page,
alors que pour les petits cela modifie le nombre de lignes et de colonnes visibles par l'utilisateur et ne modifie pas celle du serveur */
window.addEventListener('resize', resizeTerminal);



const socket = new WebSocket(`ws://${window.location.host}/`);

socket.onopen = () => {
    setTimeout(() => {
        socket.send('./program\n');
    }, 500); // Delay of 1/4 second
};

socket.onmessage = (event) => {
    term.write(event.data);
    term.scrollToBottom();
};

/*--------------------block ctrl----------------------*/
term.attachCustomKeyEventHandler((event) => {
    if (event.ctrlKey) {
        console.log(`Ctrl+${event.key} bloqué !`);
        return false; // Empêche l'action par défaut
    }
    return true;
});

term.onData((data) => { 
    socket.send(data);
});

term.focus();



/*------------------------prototype------------------------*/
/*const screenHeight = window.innerHeight;

if (screenHeight >= 1860) {  // Résolution 4K 1862
    const zoomFactor = 1.5;  // Réduire légèrement le zoom
    document.body.style.zoom = '1.5';
} else if (screenHeight >= 1390) {  // Résolution 2K 1396,5
    const zoomFactor = 1.25; // Un peu plus grand pour 2K
    document.body.style.transform = `scale(${zoomFactor})`;
}*/