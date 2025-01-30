const board = document.getElementsByClassName('sudoku-board')[0];

const sudokuPuzzles = [
    [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    [
        [0, 0, 2, 0, 0, 0, 6, 0, 0],
        [0, 0, 4, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 8, 0, 3, 0, 0],
        [5, 0, 0, 3, 0, 7, 0, 0, 0],
        [0, 0, 0, 8, 0, 0, 0, 9, 0],
        [0, 3, 0, 0, 0, 9, 0, 0, 7],
        [0, 0, 6, 0, 4, 0, 0, 0, 0],
        [0, 4, 0, 0, 0, 5, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 9, 2, 0]
    ]
];

function generateBoard(puzzle) {
    board.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.contentEditable = "true";
            const value = puzzle[row][col];
            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add('readonly');
                cell.contentEditable = "false";
            }

            
            cell.addEventListener('input', (event) => {
                const value = event.target.textContent;

              
                event.target.style.backgroundColor = "";
                event.target.style.color = "";

                
                if (value && !/^[1-9]$/.test(value)) {
                    event.target.textContent = ""; 
                    alert("give input between 1 to 9");
                }
            });

            board.appendChild(cell);
        }
    }
}

function validateBoard() {
    let isValid = true;
    let isComplete = true;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = "";
        cell.classList.remove('invalid');
    });

  
    for (let row = 0; row < 9; row++) {
        let rowValues = [];
        for (let col = 0; col < 9; col++) {
            const value = board.children[row * 9 + col].textContent.trim();
            if (!value) {
                isComplete = false;
            } else if (!/^[1-9]$/.test(value) || rowValues.includes(value)) {
                markInvalidCell(row, col);
                isValid = false;
            } else {
                rowValues.push(value);
            }
        }
    }


    for (let col = 0; col < 9; col++) {
        let colValues = [];
        for (let row = 0; row < 9; row++) {
            const value = board.children[row * 9 + col].textContent.trim();
            if (!value) continue;
            if (colValues.includes(value)) {
                markInvalidCell(row, col);
                isValid = false;
            } else {
                colValues.push(value);
            }
        }
    }


    for (let gridRow = 0; gridRow < 3; gridRow++) {
        for (let gridCol = 0; gridCol < 3; gridCol++) {
            let gridValues = [];
            for (let row = gridRow * 3; row < gridRow * 3 + 3; row++) {
                for (let col = gridCol * 3; col < gridCol * 3 + 3; col++) {
                    const value = board.children[row * 9 + col].textContent.trim();
                    if (!value) continue;
                    if (gridValues.includes(value)) {
                        markInvalidCell(row, col);
                        isValid = false;
                    } else {
                        gridValues.push(value);
                    }
                }
            }
        }
    }

   
    if (!isComplete) {
        alert("The board is incomplete. Please fill all cells.");
    } else if (!isValid) {
        alert("There are errors on the board. Please fix them.");
    } else {
        alert("Congratulations! You are the winner!");
    }
    return isValid;
}

function markInvalidCell(row, col) {
    const cell = board.children[row * 9 + col];
    if (cell.classList.contains('readonly')) return;
    cell.style.color = "red";
    cell.classList.add('invalid');
}


document.getElementById('new').addEventListener('click', () => {
    const randomPuzzle = sudokuPuzzles[Math.floor(Math.random() * sudokuPuzzles.length)];
    generateBoard(randomPuzzle);
});

document.getElementById('check').addEventListener('click', () => {
    validateBoard();
});


generateBoard(sudokuPuzzles[0]);




document.getElementById('h1').addEventListener("click", () => {
    const boardArray = [];
  
    for (let row = 0; row < 9; row++) {
        const currentRow = [];
        for (let col = 0; col < 9; col++) {
            const value = board.children[row * 9 + col].textContent.trim();
            currentRow.push(value === "" ? 0 : parseInt(value));
        }
        boardArray.push(currentRow);
    }


    if (solveSudoku(boardArray)) {
       
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = board.children[row * 9 + col];
                cell.textContent = boardArray[row][col];
                cell.style.color = cell.classList.contains("readonly") ? "white" : "lime";
            }
        }
        alert("Sudoku Solved!");
    } else {
        alert("This Sudoku puzzle cannot be solved.");
    }
});


function isSafe(board, row, col, num) {
    
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }

  
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }

   
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0; 
                    }
                }
                return false; 
            }
        }
    }
    return true; 
}


document.getElementById('timer').addEventListener('click',()=>{
    const div = document.createElement('div');
    div.id='time';
    div.textContent="hello"
    // console.log("hello hit");

    

})

