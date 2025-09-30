import { ChessBoard, Pos } from '../src/game/board.js';

export function computeMovesAsStringBoard(board: string[][]) {
	const cb = new ChessBoard()

	let pos: Pos | undefined;

	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[0]!.length; j++) {
			if (board[i]![j]![0] === "_") {
				pos = {
					row: i,
					col: j
				}
				board[i]![j] = board[i]![j]![1]!
			}
		}
	}

	if (pos === undefined) {
		throw new Error("no pos defined in board")
	}

	cb.board = board
	const moves = cb.getMoves(pos)

	if (moves === null) {
		throw new Error('Received `null` moves')
	}

	// mutates in-place
	for (let {row, col} of moves) {
		board[row]![col] = "x"
	}

	return board
}

/* Boilerplate tests for how to test ink UI */

// test('greet unknown user', t => {
// 	const {lastFrame} = render(<App name={undefined} />);

// 	t.is(lastFrame(), `Hello, ${chalk.green('Stranger')}`);
// });

// test('greet user with a name', t => {
// 	const {lastFrame} = render(<App name="Jane" />);

// 	t.is(lastFrame(), `Hello, ${chalk.green('Jane')}`);
// });
