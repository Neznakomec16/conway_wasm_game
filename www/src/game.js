import { drawGrid, drawCells } from './canvas.js';
import { updateMemoryUsage } from './memory.js';

export class Game {
    constructor(universe, fps, memory, width, height, ctx, fpsCounter, memoryCounter, speedControl) {
        this.universe = universe;
        this.fps = fps;
        this.memory = memory;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.fpsCounter = fpsCounter;
        this.memoryCounter = memoryCounter;
        this.animationId = null;
        this.speedControl = speedControl;
    }

    renderLoop() {
        this.fps.render();

        let tps = this.speedControl.value;
        for (let i = 0; i < tps; i++) {
            this.universe.tick();
        }
        this.draw();
        updateMemoryUsage(this.memory, this.memoryCounter);

        this.animationId = requestAnimationFrame(this.renderLoop.bind(this));
    }

    play() {
        if (!this.animationId) {
            this.renderLoop();
        }
    }

    draw() {
        drawGrid(this.ctx, this.width, this.height);
        drawCells(this.ctx, this.universe, this.memory, this.width, this.height);
    }
    
    reset_random() {
        this.universe.reset_random();
        this.draw();
    }

    reset_dead() {
        this.universe.reset_dead();
        this.draw();
    }

    toggle_cell(row, col) {
        this.universe.toggle_cell(row, col);
    }

    insertPattern (row, col, pattern) {
        pattern.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width) {
                this.universe.set_cell_alive(newRow, newCol)
            }
        })
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            this.fps.reset();
        }
    }

    tick() {
        this.universe.tick();
        this.draw();
    }

    isPaused() {
        return this.animationId === null;
    }
}
