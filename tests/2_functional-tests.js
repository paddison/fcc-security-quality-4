/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const numRegex = /[1-9]/;
let Solver;
let grid;
let textArea;
let testCell1;
let testCell2;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      //this function runs on the eventtrigger "input" on the textArea
      grid = document.getElementsByClassName("grid")[0];
      textArea = document.getElementById('text-input');
      textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      Solver.updateGrid(textArea, grid, numRegex);
      testCell1 = grid.rows[0].cells[2].firstElementChild.value;
      testCell2 = grid.rows[2].cells[2].firstElementChild.value;
      assert.equal(testCell1, 9, "should be 9");
      assert.equal(testCell2, 2, "should be 2");
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      //this function runs on the eventtrigger "input" on the grid
      //check value before function
      assert.equal(textArea.value[0], ".");
      assert.equal(textArea.value[80], ".");
      testCell1 = grid.rows[0].cells[0].firstElementChild;
      testCell1.value = "7";
      testCell2 = grid.rows[8].cells[8].firstElementChild;
      testCell2.value = "1";
      Solver.updateText(textArea, grid);
      //check if value was updated
      assert.equal(textArea.value[0], "7");
      assert.equal(textArea.value[80], "1");

      done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {
      // when the clear button is pressed, resetGrid() is called
      assert.equal(textArea.value[0], "7");
      assert.equal(textArea.value[80], "1");
      assert.equal(testCell1.value, "7");
      assert.equal(testCell2.value, "1");
      Solver.resetGrid();
      console.log
      assert.equal(textArea.value, "");
      assert.equal(testCell1.value, "");
      assert.equal(testCell2.value, "");
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      // the solve function runs on the click trigger of the solve button, which updates the textArea.value and afterwards the grid with updateGrid()
      let str = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      textArea.value = Solver.solve(str);
      Solver.updateGrid(textArea, grid, numRegex);
      assert.equal(textArea.value, "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
      assert.equal(testCell1.value, "7");
      assert.equal(testCell2.value, "5");
      done();
    });
  });
});

