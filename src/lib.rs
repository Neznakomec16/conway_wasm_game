mod utils;

use bitvec::prelude::*;
use core::fmt;
use wasm_bindgen::prelude::*;
extern crate web_sys;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format! ( $( $t )* ).into())
    };
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: BitVec<u8, Msb0>,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Self {
        utils::set_panic_hook();
        let size = (width * height) as usize;
        let mut cells = BitVec::<u8, Msb0>::with_capacity(size);
        for _ in 0..size {
            cells.push(js_sys::Math::random() < 0.5);
        }
        Universe {
            width,
            height,
            cells,
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }
    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn set_height(&mut self, height: u32) {
        self.height = height;
        let size = (self.width * height) as usize;
        self.cells = bitvec![u8, Msb0; 0; size];
    }

    pub fn set_width(&mut self, width: u32) {
        self.width = width;
        let size = (self.height * width) as usize;
        self.cells = bitvec![u8, Msb0; 0; size];
    }

    pub fn cells(&self) -> *const u8 {
        self.cells.as_raw_slice().as_ptr()
    }

    pub fn reset_random(&mut self) {
        let size = (self.width * self.height) as usize;
        for i in 0..size {
            self.cells.set(i, js_sys::Math::random() < 0.5)
        }
    }

    pub fn reset_dead(&mut self) {
        let size = (self.width * self.height) as usize;
        for i in 0..size {
            self.cells.set(i, false)
        }
    }

    pub fn set_cell_alive(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        if row < self.height && column < self.width {
            self.cells.set(idx, true);
        }
    }

    pub fn cells_size(&self) -> usize {
        self.cells.as_raw_slice().len()
    }

    pub fn new_64x64() -> Self {
        Universe::new(64, 64)
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                if self.cells[idx] {
                    count += 1;
                }
            }
        }
        count
    }

    pub fn tick(&mut self) {
        let _timer = Timer::new("Universe::tick");
        let mut next = {
            let _timer = Timer::new("allocate next cells");
            self.cells.clone()
        };

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (cell, live_neighbors) {
                    (true, x) if x < 2 => false,
                    (true, 2) | (true, 3) => true,
                    (true, x) if x > 3 => false,
                    (false, 3) => true,
                    _ => cell,
                };

                next.set(idx, next_cell);
            }
        }

        self.cells = next;
    }

    pub fn toggle_cell(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        if let Some(mut current_state) = self.cells.get_mut(idx) {
            *current_state = !*current_state;
        }
    }
}

impl Universe {
    pub fn get_cells(&self) -> &BitVec<u8, Msb0> {
        &self.cells
    }

    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (row, col) in cells.iter().cloned() {
            let idx = self.get_index(row, col);
            self.cells.set(idx, true);
        }
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let symbol = if self.cells[idx] { '◼' } else { '◻' };
                write!(f, "{}", symbol)?;
            }
            writeln!(f)?;
        }
        Ok(())
    }
}
