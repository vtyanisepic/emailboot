import { fen_values } from './values.js'

let board

function createBoard() {
    const grid = document.createElement('table')
    board = new Array(64).fill(0)
    // board = Array.from({ length: 8 }, () =>
    //     Array.from({ length: 8 }, () => Array(2).fill(0))
    // );
    for (let r = 1; r <= 8; r++) {
        const row = document.createElement('tr')
        for (let c = 1; c <= 8; c++) {
            const cell = document.createElement('td')
            if ((r + c) % 2 !== 0) {
                cell.classList.add('black')
            }
            cell.id = locateCellNumber(r, c)
            row.appendChild(cell)
        }
        grid.appendChild(row)
    }
    document.body.appendChild(grid)
    addPieces('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')
}

function locateCell(cellNumber) {
    const r = Math.ceil(cellNumber / 8)
    const c = ((cellNumber - 1) % 8) + 1

    return [r, c]
}

function locateCellNumber(r, c) {
    return (r - 1) * 8 + c
}

function isWhite(piece) {
    return piece.toUpperCase() === piece && piece.toLowerCase() !== piece
}

function removeClassFromAll(target, clean = false) {
    const elements = document.querySelectorAll(`.${target}`)
    elements.forEach(e => {
        e.classList.remove(target)
        if (clean == true) {
            const clone = e.cloneNode(true)
            e.replaceWith(clone)
        }
    })
}

function possibleMoves(cellNumber, pieceType) {
    removeClassFromAll('possible', true)

    console.log(cellNumber, pieceType)
    const [r, c] = locateCell(cellNumber)
    let possibleMoves = []
    switch (pieceType) {
        case 'p': // i love you fallthrough
        case 'P':
            const blackDiagRight = locateCellNumber(r + 1, c + 1)
            const blackDiagLeft = locateCellNumber(r + 1, c - 1)
            const whiteDiagRight = locateCellNumber(r - 1, c + 1)
            const whiteDiagLeft = locateCellNumber(r - 1, c - 1)
            if (isWhite(pieceType) && r != 1) {
                if (c != 8) {
                    if (board[whiteDiagRight - 1] != 0 && !isWhite(board[whiteDiagRight - 1])) possibleMoves.push(whiteDiagRight)
                }
                if (c != 1) {
                    if (board[whiteDiagLeft - 1] != 0 && !isWhite(board[whiteDiagLeft - 1])) possibleMoves.push(whiteDiagLeft)
                }
            } else if (!isWhite(pieceType) && r != 8) {
                if (c != 8) {
                    if (board[blackDiagRight - 1] != 0 && isWhite(board[blackDiagRight - 1])) possibleMoves.push(blackDiagRight)
                }
                if (c != 1) {
                    if (board[blackDiagLeft - 1] != 0 && isWhite(board[blackDiagLeft - 1])) possibleMoves.push(blackDiagLeft)
                }
            }

            const blackForwardOne = locateCellNumber(r + 1, c)
            const blackForwardTwo = locateCellNumber(r + 2, c)
            const whiteForwardOne = locateCellNumber(r - 1, c)
            const whiteForwardTwo = locateCellNumber(r - 2, c)

            if (pieceType == 'p' ? board[blackForwardOne - 1] != 0 : board[whiteForwardOne - 1] != 0) break
            pieceType == 'p' ? possibleMoves.push(blackForwardOne) : possibleMoves.push(whiteForwardOne)
            if ((r == 2 && pieceType == 'p') || (r == 7 && pieceType == 'P')) {
                if (pieceType == 'p' ? board[blackForwardTwo - 1] != 0 : board[whiteForwardTwo - 1] != 0) break
                pieceType == 'p' ? possibleMoves.push(blackForwardTwo) : possibleMoves.push(whiteForwardTwo)
            }

            break
        case 'r':
        case 'R':
            
    }

    const currentCell = document.getElementById(cellNumber)
    if (currentCell.classList.contains('selected')) {
        currentCell.classList.remove('selected')
    } else {
        for (let i = 0; i < possibleMoves.length; i++) {
            const possibleMove = document.getElementById(possibleMoves[i])
            possibleMove.classList.add('possible')
            possibleMove.addEventListener('click', movePiece.bind(null, cellNumber, possibleMoves[i]))
        }
        removeClassFromAll('selected')
        currentCell.classList.add('selected')
    }
    console.log(possibleMoves)
}

function movePiece(piecePosition, targetPosition) {
    console.log(piecePosition, targetPosition)
    console.log(board[piecePosition - 1])
    board[targetPosition - 1] = board[piecePosition - 1]
    board[piecePosition - 1] = 0
    redrawBoard()
}

function addPieces(FEN) {
    let cellNumber = 1
    FEN.replaceAll('/', '')
    for (let i = 0; i < FEN.length; i++) {
        if (FEN[i].toLowerCase() in fen_values) {
            board[cellNumber - 1] = FEN[i]
            cellNumber++
        } else if (!isNaN(FEN[i])) cellNumber += Number(FEN[i])
    }
    redrawBoard()
    console.log(board)
}

function redrawBoard() {
    removeClassFromAll('possible', true)
    removeClassFromAll('selected')

    const grid = document.querySelector('table')
    const images = grid.querySelectorAll("img");
    images.forEach(img => img.remove());

    for (let i = 0; i < board.length; i++) {
        if (board[i] != 0) {
            const chess_piece = document.createElement('img')
            const isWhite = board[i].toUpperCase() === board[i] && board[i].toLowerCase() !== board[i]
            chess_piece.src = fen_values[board[i].toLowerCase()][isWhite ? 1 : 0]
            chess_piece.addEventListener('click', possibleMoves.bind(null, i + 1, board[i]))
            const cell = document.getElementById(i + 1)
            cell.appendChild(chess_piece)
        }
    }
}

window.onload = createBoard