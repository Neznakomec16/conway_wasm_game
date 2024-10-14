<div align="center">

  <h1><code>Conway's Game of Life - WebAssembly</code></h1>

  <strong>A Rust and WebAssembly implementation of Conway's Game of Life.</strong>
</div>

## About

This project is an implementation of Conway's Game of Life, written in Rust, compiled to WebAssembly, and rendered in the browser via JavaScript. It includes features like real-time simulation, controls to reset and manipulate the universe, and adjustable simulation speed.

## 🚀 Features

- Play/Pause functionality for controlling the simulation.
- Reset the universe to a random state or all dead cells.
- Toggle cells on click, or insert predefined patterns (Glider and Pulsar) using keyboard modifiers.
- Adjustable simulation speed using a slider.
- Frames per second (FPS) counter and memory usage display.
- Optimized for performance with Rust and WebAssembly.

### 🛠️ Build the Project

You need to have **Rust**, **wasm-pack**, and **npm** installed.

1. Clone the project:

   ```bash
   git clone https://github.com/Neznakomec16/conway_wasm_game.git
   cd conway-wasm-game
   ```

2. Build the project using `wasm-pack`:

   ```bash
   wasm-pack build
   ```

3. Move to the `www` directory and install dependencies:

   ```bash
   cd www
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:8080` to play the game.

### 🔬 Test in Headless Browsers with `wasm-pack test`

Run your unit tests in headless browsers using the following command:

```bash
wasm-pack test --headless --firefox
```

## Controls

- **Play/Pause**: Start or stop the simulation.
- **Reset to Random**: Generate a new random universe.
- **Reset to All Dead**: Clear the universe.
- **Tick**: Advance the simulation by one step.
- **Speed Control**: Adjust the number of ticks per animation frame using the slider.
- **Click on a cell**: Toggle between alive and dead.
- **Alt/Option + Click**: Insert a Glider pattern centered at the clicked cell.
- **Shift + Click**: Insert a Pulsar pattern centered at the clicked cell.

## 🔋 Batteries Included

This project includes:

* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for seamless integration between Rust and JavaScript.
* [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook) for logging Rust panic messages to the browser console for easier debugging.
* A fully configured development environment with **npm**, **webpack**, and **wasm-pack**.

## License

* Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
