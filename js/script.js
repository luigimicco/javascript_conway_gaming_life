// # RECUPERO GLI ELEMENTI
const startButton = document.getElementById('start');
const grid = document.getElementById('grid');

// size buttons
const small = document.getElementById('small');
const medium = document.getElementById('medium');
const large = document.getElementById('large');
const extralarge = document.getElementById('extralarge');

// populate random
const random = document.getElementById('random');

const refreshRate = 300;

let world = [];

let totalCells;
let cellsPerRow;
let generation = 0; 
let population; 

// generatore di numeri random
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// genera una popolazione casuale
const populateRandom = () => {
    let aliveCells = getRandomNumber(0, totalCells/2);

    do {
        let cell = getRandomNumber(0, totalCells);
        if (!world[cell]) {
            aliveCells--;
            world[cell] = true;
        }
    } while (aliveCells > 0); 

    populateWorld();
}

// generate grid 
const generateGrid = () => {
    for (let i = 0; i < totalCells; i++) {
        const cell = createCell(i, cellsPerRow);
        cell.addEventListener('click', onCellClick);
        grid.appendChild(cell);
    }
}

// create single cell
function createCell(cellNumber) {
    world[cellNumber] = false;
    const cell = document.createElement("div");
    cell.id = cellNumber;
    cell.className = "cell";
    cell.innerText = "";
    const wh = `calc(100% / ${cellsPerRow})`;
    cell.style.height = wh;
    cell.style.width = wh;
    return cell;
}

function onCellClick(event) {
    const cell = event.target;
    //cell.removeEventListener("click", onCellClick);

    let number = parseInt(cell.id);

    world[number] = !world[number];
    cell.classList.toggle("alive")
}  

function drawGrid(gridsize) {

    totalCells = gridsize;
    
    // Elimino il contenuto di grid
    grid.innerHTML = '';

    // Radice quadrata per calcolare le celle
    cellsPerRow = Math.sqrt(totalCells);

    generateGrid();
}

const renderResults = () => {
    const results = document.getElementById("results");
    results.innerHTML = "";
    
    //renderizza un singolo risultato dato un oggetto cars
    let row = document.createElement("div");
    row.classList.add("result");
    row.append(` Generation : ${generation}`);
    results.append(row);

    row = document.createElement("div");
    row.append(` Population: : ${population}`);
    results.append(row);

};

// se non ci sono più celle vice, allora il gioco e' finito
const gameOver = () => {
    let isGamerOver = population == 0;
    return isGamerOver;
};

const getXY = (cellNumber) => { 
    let y = parseInt(cellNumber / cellsPerRow);
    let x = cellNumber % cellsPerRow;
    return [x, y];
}

// get cell state
const getState = (x, y) => {

    // PacMan effect    
    if (x > (cellsPerRow - 1)) x = 0;
    if (x < 0) x = cellsPerRow - 1;

    if (y > (cellsPerRow - 1)) y = 0;
    if (y < 0) y = cellsPerRow - 1;

    let cellNun = y * cellsPerRow + x;
    return (world[cellNun] ? 1: 0);
}

// populate world with dead or alive cells
const populateWorld = () => {

    let aliveCells = 0;    
    const allCells = grid.querySelectorAll('.cell');

    for (let i = 0; i < allCells.length; i++) {
        if (world[i]) {
            allCells[i].classList.add("alive");
            aliveCells++;
        } else    
            allCells[i].classList.remove("alive");
    }

    return aliveCells;
}




const nextGeneration = () => {
    const newWorld = [];

    for (let i = 0; i < totalCells; i++) {
        let pos = getXY(i);
        let x = pos[0];
        let y = pos[1];

        // apply rules
        let neighbours = getState(x-1, y-1) + getState(x, y-1) + getState(x+1, y-1) +
                            getState(x-1, y) + getState(x+1, y) +
                            getState(x-1, y+1) + getState(x, y+1) + getState(x+1, y+1);

        if (world[i] && (neighbours == 2 || neighbours == 3)) { // Any live cell with two or three live neighbours survives
            newWorld[i] = true;                             
        } else if (!world[i] && neighbours == 3) { // Any dead cell with three live neighbours becomes a live cell.
            newWorld[i] = true;                             
        } else {
            newWorld[i] = false; // All other live cells die in the next generation. Similarly, all other dead cells stay dead.                            
        }    
    }

    world = newWorld;
    generation++;
    population = populateWorld();
    renderResults();

}

function onStartClick(event) {

    // Cambio testo al bottone
    startButton.innerText = '[Stop]';
    // impedisce di premerre più volte start
    startButton.removeEventListener('click', onStartClick);
    startButton.addEventListener("click", () => {
        clearInterval(playGame);
        startButton.innerText = '[Start]';
        startButton.addEventListener("click", onStartClick);
    });

    // impedisce di modificare lo schema
    const allCells = grid.querySelectorAll('.cell');
    for (let i = 0; i < allCells.length; i++) {
        allCells[i].removeEventListener('click', onCellClick);
    }

    const playGame = setInterval(() => {
        if (gameOver()) {
            clearInterval(playGame);
        //renderResults();
        }
        nextGeneration();
    }, refreshRate);


}  


// # Prendo il bottone e aggancio event listener
random.addEventListener("click", populateRandom);
startButton.addEventListener("click", onStartClick);
small.addEventListener("click", () => drawGrid(64));
medium.addEventListener("click", () => drawGrid(100));
large.addEventListener("click", () => drawGrid(400));
extralarge.addEventListener("click", () => drawGrid(900));


// draw a medium grid as default
drawGrid(100);

