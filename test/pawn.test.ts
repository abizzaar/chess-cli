import test from "ava"
import { computeMovesAsStringBoard } from "./testUtils.js"

test('kill pawn', t => {
	const board = [
		["R", "N", "B", "Q", "K", "B", "N", "R"],
		["P", "P", "P", "P", " ", "P", "P", "P"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", "P", " ", " ", " "],
		[" ", " ", " ", "_p", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["p", "p", "p", " ", "p", "p", "p", "p"],
		["r", "n", "b", "q", "k", "b", "n", "r"],
	]

	const actual = computeMovesAsStringBoard(
		board
	)

	const expected = [
		["R", "N", "B", "Q", "K", "B", "N", "R"],
		["P", "P", "P", "P", " ", "P", "P", "P"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", "x", "x", " ", " ", " "],
		[" ", " ", " ", "p", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["p", "p", "p", " ", "p", "p", "p", "p"],
		["r", "n", "b", "q", "k", "b", "n", "r"],
	]

	t.deepEqual(actual, expected)
})

test('starting position (white)', t => {
	const board = [
		["R", "N", "B", "Q", "K", "B", "N", "R"],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["p", "p", "_p", "p", "p", "p", "p", "p"],
		["r", "n", "b", "q", "k", "b", "n", "r"],
	]

	const actual = computeMovesAsStringBoard(board)

	const expected = [
		["R", "N", "B", "Q", "K", "B", "N", "R"],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		["r", "n", "b", "q", "k", "b", "n", "r"],
	]

	t.deepEqual(actual, expected)
})

test('starting position (black)', t => {
	const board = [
		["R", "N", "B", "Q", "K", "B", "N", "R"],
		["P", "P", "_P", "P", "P", "P", "P", "P"],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		["r", "n", "b", "q", "k", "b", "n", "r"],
	]
	
	const actual = computeMovesAsStringBoard(board)

	const expected = [
		["R", "N", "B", "Q", "K", "B", "N", "R"],
		["P", "P", "P", "P", "P", "P", "P", "P"],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		[" ", " ", "x", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		[" ", " ", " ", " ", " ", " ", " ", " "],
		["p", "p", "p", "p", "p", "p", "p", "p"],
		["r", "n", "b", "q", "k", "b", "n", "r"],
	]

	t.deepEqual(actual, expected)
})
