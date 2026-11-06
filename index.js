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

function removeClassFromAll(target) {
    const elements = document.querySelectorAll(`.${target}`)
    elements.forEach(e => {
        e.classList.remove(target)
    })
}

function possibleMoves(cellNumber, pieceType) {
    removeClassFromAll('possible')

    console.log(cellNumber, pieceType)
    const [r, c] = locateCell(cellNumber)
    let possibleMoves = []
    switch (pieceType) {
        case 'p': // i love you fallthrough
        case 'P':
            const upOne = locateCellNumber(r + 1, c)
            const upTwo = locateCellNumber(r + 2, c)
            const downOne = locateCellNumber(r - 1, c)
            const downTwo = locateCellNumber(r - 2, c)

            if (pieceType == 'p' ? board[upOne - 1] != 0 : board[downOne - 1] != 0) break
            pieceType == 'p' ? possibleMoves.push(upOne) : possibleMoves.push(downOne)
            if ((r == 2 && pieceType == 'p') || (r == 7 && pieceType == 'P')) {
                if (pieceType == 'p' ? board[upTwo - 1] != 0 : board[downTwo - 1] != 0) break
                pieceType == 'p' ? possibleMoves.push(upTwo) : possibleMoves.push(downTwo)
            }
            break
    }

    const currentCell = document.getElementById(cellNumber)
    if (currentCell.classList.contains('selected')) {
        currentCell.classList.remove('selected')
    } else {
        for (let i = 0; i < possibleMoves.length; i++) {
            const possibleMove = document.getElementById(possibleMoves[i])
            possibleMove.classList.add('possible')
        }
        removeClassFromAll('selected')
        currentCell.classList.add('selected')
    }
    console.log(possibleMoves)
}

function addPieces(FEN) {
    let cellNumber = 1
    FEN.replaceAll('/', '')
    for (let i = 0; i < FEN.length; i++) {
        if (FEN[i].toLowerCase() in fen_values) {
            board[cellNumber - 1] = FEN[i]

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