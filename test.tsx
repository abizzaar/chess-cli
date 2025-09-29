import test from 'ava';
import { ChessBoard } from './src/game/board.js';

test('basic: initialize board', t => {
	const cb = new ChessBoard()
	const b = cb.board
	t.assert(b.length === 8)
	t.assert(b[0]!.length === 8)
	// TODO: add more tests for initial board layout
})

test('king: move pawn and king', t => {
	const cb = new ChessBoard()
	// move pawn one ahead
	cb.playMove(
		{
			row: 1,
			col: 4
		},
		{
			row: 2,
			col: 4
		}
	)
	// check that king can move where pawn used to be
	const moves = cb.getMoves(
		{
			row: 0,
			col: 4
		}
	)!
	t.assert(moves.length === 1)
	t.deepEqual(moves[0], {
		row: 1,
		col: 4
	})
})

test('pawn: kill pawn', t => {
	const cb = new ChessBoard()
	cb.board = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", " ", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", "p", " ", " ", " ", " "],
		[" ", " ", " ", " ", "P", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", " ", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]
	const moves = cb.getMoves({
		row: 3,
		col: 3
	})!
	t.assert(moves.length === 2)
	t.assert(exists(moves, m => m.row === 4 && m.col === 3))
	t.assert(exists(moves, m => m.row === 4 && m.col === 4))
})

test('pawn: starting position (white)', t => {
	const cb = new ChessBoard()
	cb.board = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]
	const moves = cb.getMoves({
		row: 1,
		col: 2
	})!
	t.assert(moves.length === 2)
	t.assert(exists(moves, m => m.row === 2 && m.col === 2))
	t.assert(exists(moves, m => m.row === 3 && m.col === 2))
})

test('pawn: starting position (black)', t => {
	const cb = new ChessBoard()
	cb.board = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]
	const moves = cb.getMoves({
		row: 6,
		col: 2
	})!
	t.assert(moves.length === 2)
	t.assert(exists(moves, m => m.row === 5 && m.col === 2))
	t.assert(exists(moves, m => m.row === 4 && m.col === 2))
})

/* Utils */

function exists<T>(arr: T[], predicate: (t: T) => void) {
	return arr.findIndex(predicate) !== -1
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
