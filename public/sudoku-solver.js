const textArea = document.getElementById('text-input');
const grid = document.getElementsByClassName("grid")[0];
const numRegex = /[1-9]/;
const clrBtn = document.getElementById("clear-button");
const slvBtn = document.getElementById("solve-button");
const errorDiv = document.getElementById("error-msg");
// import { puzzlesAndSolutions } from './puzzle-strings.js';


let populateGrid = function(str = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..') {
  let text = str.split("");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = grid.rows[i].cells[j].firstElementChild
      if (numRegex.test(text[i * 9 + j])) {
        cell.value = text[i * 9 + j];
      }
    }
  }
}

let updateGrid = function(textArea, grid, regex) {
  let text = textArea.value.split("");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = grid.rows[i].cells[j].firstElementChild
      if (regex.test(text[i * 9 + j])) {
        cell.value = text[i * 9 + j];
      }else if (text[i * 9 + j] === ".") {
        cell.value = "";
      }
    }
  }
};

let updateText = function(textArea, grid){
  let text = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = grid.rows[i].cells[j].firstElementChild
      let num = parseInt(cell.value)
      if (num < 10 && num > 0) {
        text.push(cell.value);
      }else {
        text.push(".");
      }
    }
  }
  textArea.value = text.join("");
}

let resetGrid = function() {
  textArea.value = "";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = grid.rows[i].cells[j].firstElementChild
        cell.value = "";     
    }
  }
}

let parseGrid = function(str) {
  let board = [];
  if (str.length === 81 || str.length === 0) {
    document.getElementById("error-msg").innerHTML = "";
    for (let i = 0; i < 9; i++) {
      let tempArr = str.substring(i * 9, i * 9 + 9).split("")
      for (let j = 0; j < 9; j++) {
        if (tempArr[j] === ".") {
          tempArr[j] = 0;
        }else
          tempArr[j] = parseInt(tempArr[j]);
      }
      board.push([...tempArr]);
    }
    return board;
  }else {
    return "Error: Expected puzzle to be 81 characters long.";
  }

}

let solve = function(str) {

  let board = [];
  
  for (let i = 0; i < 9; i++) {
    let tempArr = str.substring(i * 9, i * 9 + 9).split("")
    for (let j = 0; j < 9; j++) {
      if (tempArr[j] === ".") {
        tempArr[j] = 0;
      }else
        tempArr[j] = parseInt(tempArr[j]);
    }
    board.push([...tempArr]);
  }
  
  
  let checkRow = (row, num) => row.includes(num);
  let checkCol = (col, num) => col.includes(num);
  let checkField = (field, num) => field.includes(num);
  
  let rows = [];
  let cols = [];
  let fields = [];
  let empty = [];
  
  // make rows, cols
  for (let r = 0; r < 9; r++) {
    let row = board[r].map(val => val);
    let col = [];
    for (let c = 0; c < 9; c++) {
     col.push(board[c][r]);       
    }
    rows.push(row.map(val => val));
    cols.push(col.map(val => val));   
  }
  
  //make fields
  for (let i = 0; i < 9; i++) {
    let tempArr = [];
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        tempArr.push(rows[j+(Math.floor(i/3) * 3)][k + i%3 * 3]);
      }
    }
    fields.push(tempArr.map(val => val));
  }

  // find empty fields
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        empty.push([r, c])
      }
    }
  }
  
  //check if there are invalid numbers
  function checkDuplicate(w){
    for (let j = 0; j < w.length; j++) {
      if (w[j] === 0) {
        continue;
      }
      for (let k = j + 1; k < w.length; k++) {
        if(w[k] === 0) {
          continue;
        }
        if (w[j] === w[k]) {
          return false
        }
      }
    }
    return true
  }
  
  for (let i = 0; i < 9; i++) {
    if (!checkDuplicate(rows[i]) || !checkDuplicate(cols[i]) || !checkDuplicate(fields[i])) {
      return "no solution found"
    }
  }

  let checker = (rows, cols, fields, empty) => {
    for (let cell of empty) {
      let possible = []
      if (rows[cell[0]][cell[1]] !== 0 && !Array.isArray(rows[cell[0]][cell[1]])) {
        continue;
      }  
      for (let i = 1; i < 10; i++) {    
        if (!checkRow(rows[cell[0]], i) && !checkCol(cols[cell[1]], i) && !checkField(fields[Math.floor(cell[0]/3) * 3 + Math.floor(cell[1]/3)], i)) {
          possible.push(i)
        }
      }
      if (possible.length === 1) {
        rows[cell[0]][cell[1]] = possible[0];
        cols[cell[1]][cell[0]] = possible[0];
        fields[Math.floor(cell[0]/3) * 3 + Math.floor(cell[1]/3)][cell[0]%3 * 3 + cell[1]%3] = possible[0];
      }else if (possible.length > 1) {
        rows[cell[0]][cell[1]] = possible;
        cols[cell[1]][cell[0]] = possible;
        fields[Math.floor(cell[0]/3) * 3 + Math.floor(cell[1]/3)][cell[0]%3 * 3 + cell[1]%3] = possible;
      }else if (possible.length === 0) {
        return -1;
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (rows[i][j] === 0 || rows[i][j].length > 1) {
          checker(rows, cols, fields, empty);
        }
      }
    }
    return rows
  }
  
  let solved = checker(rows, cols, fields, empty);
  //console.log(solved);
  if (solved === -1) {
    return "no solution found";
  }
  let returnStr = "";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      returnStr = returnStr + solved[i][j];
    }
  }
  
  return returnStr
 
};  

document.addEventListener('DOMContentLoaded', () => {
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
  populateGrid(textArea.value);

});

textArea.addEventListener("change", () => {
  let val = parseGrid(textArea.value);
  if (typeof val === "string") {
    errorDiv.innerHTML = val;
  }
})

textArea.addEventListener("input", () => {
  let text = textArea.value.split("");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = grid.rows[i].cells[j].firstElementChild
      if (numRegex.test(text[i * 9 + j])) {
        cell.value = text[i * 9 + j];
      }else if (text[i * 9 + j] === ".") {
        cell.value = "";
      }
    }
  }
});

grid.addEventListener("input", () => {
  let text = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = grid.rows[i].cells[j].firstElementChild
      if (numRegex.test(cell.value)) {
        text.push(cell.value);
      }else {
        text.push(".");
      }
    }
  }
  textArea.value = text.join("");
})

clrBtn.addEventListener("click", () => {
  resetGrid();
});

slvBtn.addEventListener("click", () => {
  let result = solve(textArea.value);
  if (result === "no solution found") {
    document.getElementById("error-msg").innerHTML = result; 
  }else {
    textArea.value = result;
    updateGrid(textArea, grid, numRegex);
  }
});

  

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    updateText: updateText,
    parseGrid: parseGrid,
    solve: solve,
    updateGrid: updateGrid,
    updateText: updateText,
    resetGrid: resetGrid
  }
} catch (e) {}
