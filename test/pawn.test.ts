import test from "ava"
import { computeMovesAsStringBoard } from "./testUtils.js"

test('kill pawn', t => {
	const board = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", " ", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", "_p", " ", " ", " ", " "],
		[" ", " ", " ", " ", "P", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", " ", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]

	const actual = computeMovesAsStringBoard(
		board
	)

	const expected = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", " ", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", "p", " ", " ", " ", " "],
		[" ", " ", " ", "x", "x", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", " ", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]

	t.deepEqual(actual, expected)
})

test('starting position (white)', t => {
	const board = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "_p", "p", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]

	const actual = computeMovesAsStringBoard(board)

	const expected = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]

	t.deepEqual(actual, expected)
})

test('starting position (black)', t => {
	const board = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["P", "P", "_P", "P", "P", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]
	
	const actual = computeMovesAsStringBoard(board)

	const expected = [
		["r", "h", "b", "q", "k", "b", "h", "r"],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		["R", "H", "B", "Q", "K", "B", "H", "R"]
	]

	t.deepEqual(actual, expected)
})
