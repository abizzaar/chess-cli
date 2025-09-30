/**
 TODOs:
 - Get moves working for all pieces.

 - (Done) Write tests to run the chess board.
 */

/**
 The ChessBoard is a class that exposes an initialization, playMove(pos1, pos2), and getMoves(pos), and getPieces(color).

 Internally, the board is a 8x8 grid stores as an array.

 Each square is either null or a piece.

 A piece exposes a getMoves(pos, board) that returns its valid moves.

 Each move would ideally also contain whether a piece is being killed or not. For now, I can recalculate it in the board and see whether it will kill or not.

 I don't like that the piece and board are so tightly coupled. I'll rethink some of this later, but I want to focus on implementation using this abstraction for now.

 Making a move will update the board.

 We should also have a mechanism to guarantee that each player can only update its own piece.
 */
type Color = "white" | "black"

export type Pos = {
    row: number,
    col: number
}

abstract class Piece {
    color: Color;
    constructor(color: Color) {
        this.color = color
    }
    abstract getMoves(pos: Pos, board: Board): Pos[];
}

class Pawn extends Piece {
    constructor(color: Color) {
        super(color);
    }
    getMoves(pos: Pos, board: Board): Pos[] {
        const result = []

        const rowDelta = this.color === "white" ? 1 : -1

        // starting position double move
        const startingRow = this.color === "white" ? 1 : 6
        const startDestination = {
            row: pos.row + (2 * rowDelta),
            col: pos.col
        }
        if (
            pos.row === startingRow && board[startDestination.row]![startDestination.col] === null
        ) {
            result.push(startDestination)
        }

        // normal move
        if (board[pos.row + rowDelta]![pos.col] === null) {
            result.push({
                row: pos.row + rowDelta,
                col: pos.col
            })
        }

        // kill move
        const diagonals = [
            {
                row: pos.row + rowDelta,
                col: pos.col + 1
            },
            {
                row: pos.row + rowDelta,
                col: pos.col - 1
            }
        ]

        for (let d of diagonals) {
            if (isInBoard(d) && board[d.row]![d.col] !== null && board[d.row]![d.col]!.color !== this.color) {
                result.push(d)
            }
        }

        return result
    }
}

class King extends Piece {
    getMoves(pos: Pos, board: Board): Pos[] {
        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1]
        ]
        return directions
            .map(([rowD, colD]) => ({
                row: pos.row + rowD!,
                col: pos.col + colD!
            }))
            .filter(isInBoard)
            // can't move where another piece of same color is
            .filter(pos => board[pos.row]![pos.col]?.color !== this.color)
    }
}

class Rook extends Piece {
    getMoves(pos: Pos, board: Board): Pos[] {
        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ]

        return computeBishopRookQueenMoves(
            pos,
            this.color,
            board,
            directions
        )
    }
}

class Bishop extends Piece {
    getMoves(pos: Pos, board: Board): Pos[] {
        const directions = [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1]
        ]

        return computeBishopRookQueenMoves(
            pos,
            this.color,
            board,
            directions
        )
    }
}

class Queen extends Piece {
    getMoves(pos: Pos, board: Board): Pos[] {
        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1]
        ]

        return computeBishopRookQueenMoves(
            pos,
            this.color,
            board,
            directions
        )
    }
}

class Horse extends Piece {
    getMoves(pos: Pos, board: Board): Pos[] {
        const deltas = [
            [2, 1],
            [-2, 1],
            [2, -1],
            [-2, -1],
            [1, 2],
            [-1, 2],
            [1, -2],
            [-1, -2]
        ]
        
        return deltas.map(([rowD, colD]) => {
            return {
                row: pos.row + rowD!,
                col: pos.col + colD!
            }
        }).filter(pos => isInBoard(pos) && board[pos.row]![pos.col]?.color !== this.color)
    }
}


const identifiers: { [id: string]: new (color: Color) => Piece } = {
    "r": Rook,
    "h": Horse,
    "b": Bishop,
    "q": Queen,
    "k": King,
    "p": Pawn
}


const INITIAL_POSITIONS = [
    ["r", "h", "b", "q", "k", "b", "h", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "H", "B", "Q", "K", "B", "H", "R"]
]


// 8 x 8 board
type Board = Array<Array<Piece | null>>;

export class ChessBoard {
    private _board: Board;

    constructor() {
        this._board = []
        this.initializeBoard()
    }

    private initializeBoard(positions: string[][] = INITIAL_POSITIONS) {
        this._board = []
        for (let i = 0; i < 8; i++) {
            this._board.push([])
            for (let j = 0; j < 8; j++) {
                const char = positions[i]![j]!
                this._board[i]!.push(
                    char === " "
                    ? null
                    : new identifiers[char.toLowerCase()]!(isLowercase(char) ? 'white' : 'black')
                )
            }
        }
    }

    get board(): Board {
        return this._board
    }

    set board(positions: string[][]) {
        this.initializeBoard(positions)
    }

    playMove(origin: Pos, destination: Pos) {
        // TODO: check if valid before allowing

        const piece = this._board[origin.row]![origin.col]!
        this._board[origin.row]![origin.col] = null
        this._board[destination.row]![destination.col] = piece
    }

    getMoves(pos: Pos): Pos[] | null {
        // TODO: check invalid pos
        if (!isInBoard(pos)) {
            throw new Error("Invalid move entered")
        }

        const square = this._board[pos.row]![pos.col]

        if (!square) {
            return null
        }

        return square.getMoves(pos, this._board)
    }
}

// Utils

function computeBishopRookQueenMoves(pos: Pos, color: Color, board: Board, directions: number[][]) {
    const result = []

    for (let [rowD, colD] of directions) {
        let newPos = {
            row: pos.row + rowD!,
            col: pos.col + colD!
        }

        while (isInBoard(newPos) && board[newPos.row]![newPos.col] === null) {
            result.push(newPos)
            newPos = {
                row: newPos.row + rowD!,
                col: newPos.col + colD!
            }
        }

        // kill move
        if (isInBoard(newPos) && color !== board[newPos.row]![newPos.col]!.color) {
            result.push(newPos)
        }
    }

    return result 
}

function isLowercase(char: string) {
    return char.toLowerCase() === char
}

function isInBoard(pos: Pos) {
   return pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7 
}


/*

TODOs later:
- Separate the types of the internal-facing API and external-facing API.
- Don't allow setting of board via class; only expose it via a backdoor-method.
- How should the moves be ordered? For now it's unordered, think of ordering later.

*/