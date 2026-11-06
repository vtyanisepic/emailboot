import { fen_values } from './values.js'

let board

function createBoard() {
    const grid = document.createElement('table')
    board = Array.from({ length: 64 }, () => [0, 0])
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
    const r = Math.floor((cellNumber - 1) / 8) + 1
    const c = (cellNumber - 1) % 8 + 1

    return [r, c]
}

function locateCellNumber(r, c) {
    r--
    c--
    return ((r * 8) + c) + 1 // plus one so that it doesn't start at zero 
}

function possibleMoves(cellNumber, pieceType) {
    console.log(cellNumber, pieceType)
    const [r, c] = locateCell(cellNumber)
    let possibleMoves = []
    switch (pieceType) {
        case 'p': // i love you fallthrough
        case 'P':
            pieceType == 'p' ? possibleMoves.push(locateCellNumber(r + 1, c)) : possibleMoves.push(locateCellNumber(r - 1, c))
            if ((r == 2 && pieceType == 'p') || (r == 7 && pieceType == 'P')) {
                pieceType == 'p' ? possibleMoves.push(locateCellNumber(r + 2, c)) : possibleMoves.push(locateCellNumber(r - 2, c))
            }
            break
    }
    console.log(possibleMoves)
}

function addPieces(FEN) {
    let cellNumber = 1
    FEN.replaceAll('/', '')
    for (let i = 0; i < FEN.length; i++) {
        if (FEN[i].toLowerCase() in fen_values) {
            board[cellNumber - 1][0] = FEN[i]
            if (FEN[i].toLowerCase() == 'p') board[cellNumber - 1][1] = cellNumber // pawns can move two squares on the first move

            const chess_piece = document.createElement('img')
            const isWhite = FEN[i].toUpperCase() === FEN[i] && FEN[i].toLowerCase() !== FEN[i]
            chess_piece.src = fen_values[FEN[i].toLowerCase()][isWhite ? 1 : 0]
            chess_piece.addEventListener('click', possibleMoves.bind(null, cellNumber, FEN[i]))
            const cell = document.getElementById(cellNumber)
            // console.log(FEN[i], cellNumber, cell)
            cell.appendChild(chess_piece)
            cellNumber++
        } else if (!isNaN(FEN[i])) cellNumber += Number(FEN[i])
    }
    console.log(board)
}

window.onload = createBoard