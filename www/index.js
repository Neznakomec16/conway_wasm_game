import { Universe } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg.wasm";
import { FPS } from './src/fps.js';
import { initCanvas, drawGrid, drawCells, CELL_SIZE } from './src/canvas.js';
import { Game } from './src/game.js';


const universe = Universe.new(256, 256);
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
const ctx = initCanvas(canvas, width, height);

const fpsCounter = document.getElementById('fps');
const memoryCounter = document.getElementById('memory');

const fps = new FPS(fpsCounter);

const playPauseButton = document.getElementById("play-pause");
// Track how many ticks per frame from the slider
// Get the speed control range slider
const speedControl = document.getElementById('speed-control');
const game = new Game(
    universe,
    fps,
    memory,
    width,
    height,
    ctx,
    fpsCounter,
    memoryCounter,
    speedControl,
);

const gliderPattern = [
    [-1, 0], [0, 1], [1, -1], [1, 0], [1, 1] // Glider shape
];

const pulsarPattern = [
    // Add the relative positions for the pulsar pattern here
    [-1, -6], [0, -6], [1, -6], [-6, -1], [-6, 0], [-6, 1], // Left side
    [1, 6], [0, 6], [-1, 6], [6, -1], [6, 0], [6, 1],      // Right side
    // Repeat for other sides, top, and bottom portions of the pulsar
];

playPauseButton.addEventListener("click", event => {
    if (game.isPaused()) {
        playPauseButton.textContent = "⏸";
        game.play();
    } else {
        playPauseButton.textContent = "▶";
        game.pause();
    }
});

canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    if (event.altKey) { game.insertPattern(row, col, gliderPattern); }
    else if (event.shiftKey) { game.insertPattern(row, col, pulsarPattern); }
    else { game.toggle_cell(row, col); }
    game.draw();
})

document.getElementById('reset-random').addEventListener("click", () => {
    game.reset_random();
});

// Event listener for "Reset to All Dead" button
document.getElementById('reset-dead').addEventListener("click", () => {
    game.reset_dead();
});

document.getElementById('tick').addEventListener("click", () => {
    game.tick();
});

drawGrid(ctx, width, height);
drawCells(ctx, universe, memory, width, height);
game.play();
