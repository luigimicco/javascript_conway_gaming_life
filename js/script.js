// The Game of Life, also known simply as Life, is a cellular automaton devised by the
// British mathematician John Horton Conway in 1970.
// It is a zero-player game, meaning that its evolution is determined by its initial state,
// requiring no further input. One interacts with the Game of Life by creating an initial
// configuration and observing how it evolves.
// It is Turing complete and can simulate a universal constructor or any other Turing machine.


// main elements
const startButton = document.getElementById('start');
const grid = document.getElementById('grid');

// size buttons
const small = document.getElementById('small');
const medium = document.getElementById('medium');
const large = document.getElementById('large');
const extralarge = document.getElementById('extralarge');

// random button
const random = document.getElementById('random');

const refreshRate = 300;

const world = {
        cells: [],
        population: null,
        generation: 0,
        cellsPerRow: 20
};

// toggle on cell
function onCellClick(event) {
    const cell = event.target;
    let number = parseInt(cell.id);

    world.cells[number] = !world.cells[number];
    cell.classList.toggle("alive")
}  

// draw the whole crid
function drawGrid(gridsize) {

    // create single cell
    function createCell(cellNumber) {
        world.cells[cellNumber] = false;
        const cell = document.createElement("div");
        cell.id = cellNumber;
        cell.className = "cell";
        cell.innerText = "";
        const wh = `calc(100% / ${gridsize})`;
        cell.style.height = wh;
        cell.style.width = wh;
        return cell;
    }

    let totalCells = gridsize*gridsize;
    world.cellsPerRow = gridsize;
    
    // empty grid
    grid.innerHTML = '';

    for (let i = 0; i < totalCells; i++) {
        const cell = createCell(i, gridsize);
        cell.addEventListener('click', onCellClick);
        grid.appendChild(cell);
    }
}


// populate world with dead or alive cells
const populateWorld = () => {

    let aliveCells = 0;    
    const allCells = grid.querySelectorAll('.cell');

    for (let i = 0; i < allCells.length; i++) {
      
        if (world.cells[i]) {
            allCells[i].classList.add("alive");
            aliveCells++;
        } else    
            allCells[i].classList.remove("alive");
    }

    return aliveCells;
}


function onStartClick(event) {



    // show info about generation and population
    const renderResults = () => {
        const results = document.getElementById("results");
        results.innerHTML = "";
        
        let row = document.createElement("div");
        row.classList.add("result");
        row.append(` Generation : ${world.generation}`);
        results.append(row);
    
        row = document.createElement("div");
        row.classList.add("result");
        row.classList.add("winner");
        row.append(` Population: : ${world.population}`);
        results.append(row);
    
    };

    // calculate next generation state
    const nextGeneration = () => {

        // get cell state
        const getState = (x, y) => {
    
            // PacMan effect    
            if (x > (world.cellsPerRow - 1)) x = 0;
            if (x < 0) x = world.cellsPerRow - 1;
    
            if (y > (world.cellsPerRow - 1)) y = 0;
            if (y < 0) y = world.cellsPerRow - 1;
    
            let cellNun = y * world.cellsPerRow + x;
            return (world.cells[cellNun] ? 1: 0);
        }
    
        const newWorld = [];

        let totalCells = world.cellsPerRow * world.cellsPerRow;
    
        for (let i = 0; i < totalCells; i++) {
    
            let y = parseInt(i / world.cellsPerRow);
            let x = i % world.cellsPerRow;
    
            // apply rules
            let neighbours = getState(x-1, y-1) + getState(x, y-1) + getState(x+1, y-1) +
                                getState(x-1, y) + getState(x+1, y) +
                                getState(x-1, y+1) + getState(x, y+1) + getState(x+1, y+1);
    
            if (world.cells[i] && (neighbours == 2 || neighbours == 3)) { // Any live cell with two or three live neighbours survives
                newWorld[i] = true;                             
            } else if (!world.cells[i] && neighbours == 3) { // Any dead cell with three live neighbours becomes a live cell.
                newWorld[i] = true;                             
            } else {
                newWorld[i] = false; // All other live cells die in the next generation. Similarly, all other dead cells stay dead.                            
            }    
        }
    
        world.cells = newWorld;
        world.generation++;
        world.population = populateWorld();
        renderResults();
    
    }


    // change caption to start button
    startButton.innerText = '[Stop]';

    // avoid to press more time the start button
    startButton.removeEventListener('click', onStartClick);
    startButton.addEventListener("click", () => {
        clearInterval(playGame);
        startButton.innerText = '[Start]';
        startButton.addEventListener("click", onStartClick);
    });

    // no events on cells after start
    const allCells = grid.querySelectorAll('.cell');
    for (let i = 0; i < allCells.length; i++) {
        allCells[i].removeEventListener('click', onCellClick);
    }


    const playGame = setInterval(() => {
        // no more alive cells ? Game over
        if (world.population == 0) {
            clearInterval(playGame);
        }
        nextGeneration();
    }, refreshRate);


}  

// setup a random population
const populateRandom = () => {

    // random genertor
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let totalCells = world.cellsPerRow * world.cellsPerRow;
    world.cells = [];
    let aliveCells = getRandomNumber(0, totalCells/2);
    do {
        let cell = getRandomNumber(0, totalCells);
        if (!world.cells[cell]) {
            aliveCells--;
            world.cells[cell] = true;
        }
    } while (aliveCells > 0); 

    populateWorld();
}



// event listener on buttons
random.addEventListener("click", populateRandom);
startButton.addEventListener("click", onStartClick);

small.addEventListener("click", () => drawGrid(10));
medium.addEventListener("click", () => drawGrid(20));
large.addEventListener("click", () => drawGrid(50));
extralarge.addEventListener("click", () => drawGrid(100));


// draw a medium grid as default
drawGrid(20);

