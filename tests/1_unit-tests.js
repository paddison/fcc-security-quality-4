/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

// PLEASE READ BEFORE:
// I wasn't 100% sure how to fill out some of the tests, especially the one where it said you need to parse it into an object.
// since my solver doesn't rely on an object, but only a string, which is parsed into an array, i tested for an array and not an object.
// also the solver parsers the string into an object by itself, so i only parsed it into an object in the parseGrid function to pass the tests,
// it actually isn't required for my solver.

// in glitch sometimes the tests run, sometimes they don't, but i dont really know why

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
//const { validateInput } = require('../public/sudoku-solver.js');
const { JSDOM } = jsdom;
const numRegex = /-/;
let Solver



suite('UnitTests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;
        Solver = require('../public/sudoku-solver.js');

      });
  });
  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function updateText()', () => {
    test('Valid "1-9" characters', (done) => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const cell = document.getElementById("A1");
      const textArea = document.getElementById('text-input');
      const grid = document.getElementsByClassName("grid")[0];
      for (let i = 0; i < input.length; i++) {
        cell.value = input[i];
        Solver.updateText(textArea, grid, numRegex);
        assert.equal(textArea.value[0], input[i])
      }
      done();
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      const cell = document.getElementById("A1");
      const textArea = document.getElementById('text-input');
      const grid = document.getElementsByClassName("grid")[0];
      for (let i = 0; i < input.length; i++) {
        cell.value = input[i];
        Solver.updateText(textArea, grid);
        assert.equal(textArea.value[0], ".")
      }
      done();
    });
  });
  
  suite('Function parseGrid()', () => {
    test('Parses a valid puzzle string into an object', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let board = Solver.parseGrid(input);
      assert.isArray(board);
      done();
    });
    
    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');     
      errorDiv.textContent = Solver.parseGrid(shortStr);
      assert.equal(errorDiv.textContent, errorMsg);
      errorDiv.textContent = Solver.parseGrid(longStr);
      assert.equal(errorDiv.textContent, errorMsg);
      done();
    });
  });

  suite('Function solve()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      let solved = Solver.solve(input);
      assert.equal(solved, input)
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
      let error = Solver.solve(input);
      assert.equal(error, "no solution found")
      done();
    });
  });
  
  
  suite('Function solve()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
      let solved = Solver.solve(input);
      assert.equal(solved, solution)
      done();
    });
  });
});
