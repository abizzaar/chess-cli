import React, { useEffect, useRef, useState } from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import { boardToFenString, CHESS_PIECES_DISPLAY_MAP, ChessBoard, isInBoard, Pos } from './game/board.js';
import {execaNode} from 'execa';

export default function App() {
	const {exit} = useApp()

	const [hoveredPos, setHoveredPos] = useState<Pos>({
		row: 1,
		col: 4
	})

	const [validMovesPos, setValidMovesPos] = useState<Pos[]>([])

	const [selectedValidMoveIndex, setSelectedValidMoveIndex] = useState<number>(-1)

	const cb = useRef(new ChessBoard())

	const cancelSignal = useRef(new AbortController())

	const cp = useRef(execaNode(`node_modules/stockfish/src/stockfish-17.1-lite-51f59da.js`, {
		stdio: 'pipe',
		cancelSignal: cancelSignal.current.signal
	}));

	const [isPaused, setIsPaused] = useState<boolean>(false)

	// TODO: move to board.tsx
	const fenPosToPos = (fenPos: string): Pos => {
		if (fenPos.length !== 2) {
			throw new Error(`fenPos was ${fenPos}`)
		} 

		const col = fenPos[0]
		const row = fenPos[1]

		return {
			row: parseInt(row!) - 1,
			col: col!.charCodeAt(0) - "a".charCodeAt(0)
		}
	}

	const playStockfishMove = (fenMove: string) => {
		// TODO: handle `(none)` fenMove
		if (fenMove.length !== 4) {
			throw new Error(`fenMove was ${fenMove}`)
		}

		const origin = fenMove.slice(0, 2)
		const destination = fenMove.slice(2, 4)

		cb.current.playMove(
			fenPosToPos(origin),
			fenPosToPos(destination)
		)

		setSelectedValidMoveIndex(-1)
		setValidMovesPos([])
		resetHoveredPos()
		setIsPaused(false)
	}

	useEffect(() => {
		(async () => {
			cp.current.stdout!.setEncoding('utf8')
			cp.current.stdout.on('data', (lines: string) => {
				for (const line of lines.split("\n")) {
					if (line.startsWith("bestmove")) {
						const move = line.split(" ")[1]
						playStockfishMove(move!)
					}
				}
			})
			cp.current.stdin!.write('uci\n')
			cp.current.stdin!.write('isready\n')
			cp.current.stdin!.write('ucinewgame\n')
		})()

		return () => {
			if (cancelSignal.current) {
				cancelSignal.current.abort()
			}
		}
	}, [])


	const includedInValidMoves = (i: number, j: number) => {
		const validMove = validMovesPos.find(pos => {
			return pos.row === i && pos.col === j
		})
		return validMove !== undefined
	}


	const traverseBoard = (pos: Pos, direction: number[], isMatch: (pos: Pos) => boolean): Pos | null => {
		// needs to move left, right, up and down
		// first handle for validMoves, then for board

		let indicesSetOfStartPositions = new Set()

		let clockwiseDirection = [direction[1]!, -direction[0]!]
		let counterClockwiseDirection = [-clockwiseDirection[0]!, -clockwiseDirection[1]!]

		let startPos = pos

		while (indicesSetOfStartPositions.size < 8) {
			let currPos = {
				row: startPos.row + direction[0]!,
				col: startPos.col + direction[1]!
			}

			while (isInBoard(currPos)) {
				if (isMatch(currPos)) {
					return currPos
				}
				currPos.row += direction[0]!
				currPos.col += direction[1]!
			}
			
			indicesSetOfStartPositions.add(`${startPos.row},${startPos.col}`)

			outerLoop: for (let i = 1; i < 8; i++) {
				for (let dir of [clockwiseDirection, counterClockwiseDirection]) {
					startPos = {
						row: pos.row + (i * dir[0]!),
						col: pos.col + (i * dir[1]!)
					}
					if (isInBoard(startPos) && !indicesSetOfStartPositions.has(`${startPos.row},${startPos.col}`)) {
						break outerLoop
					}
				}
			}
		}

		return null
	}

	const updateHoveredPos = (direction: number[]) => {
		const isMatch = (pos: Pos) => {
			return cb.current.board![pos.row]![pos.col] !== null &&
				cb.current.board![hoveredPos.row]![hoveredPos.col]!.color === cb.current.board![pos.row]![pos.col]!.color
		}
		const newPos = traverseBoard(hoveredPos, direction, isMatch)
		if (newPos) {
			setHoveredPos(newPos)
		}
	}

	const updateSelectedValidMove = (direction: number[]) => {
		setSelectedValidMoveIndex(prev => {
			const isMatch = (pos: Pos) => includedInValidMoves(pos.row, pos.col)
			const newPos = traverseBoard(validMovesPos[prev]!, direction, isMatch)
			if (newPos) {
				return validMovesPos.findIndex(pos => pos.row === newPos.row && pos.col === newPos.col)
			}
			return prev // didn't find anything
		})
	}

	const resetHoveredPos = () => {
		const isMatch = (pos: Pos) => {
			return cb.current.board![pos.row]![pos.col] !== null &&
				cb.current.turn === cb.current.board![pos.row]![pos.col]!.color
		}
		// TODO: make it relative to black / white
		for (let direction of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
			const newPos = traverseBoard(hoveredPos, direction, isMatch)
			if (newPos) {
				setHoveredPos(newPos)
				break
			}
		}
	}

	useInput((input, key) => {
		if (key.escape) {
			setValidMovesPos([])
		}

		if (isPaused) {
			return
		}

		if (validMovesPos.length === 0) {
			if (key.leftArrow || input === "h") {
				updateHoveredPos([0, -1])
			}
			if (key.rightArrow || input === "l") {
				updateHoveredPos([0, 1])
			}
			if (key.upArrow || input === "k") {
				updateHoveredPos([1, 0])
			}
			if (key.downArrow || input === "j") {
				updateHoveredPos([-1, 0])
			}
			if (key.return) {
				setValidMovesPos(
					cb.current!.getMoves(hoveredPos) ?? []
				)
				setSelectedValidMoveIndex(0)
			}
		}
		// TODO: calculate how to correctly move to the next valid move based on direction
		else {
			if (key.leftArrow || input === "h") {
				updateSelectedValidMove([0, -1])
			}
			if (key.rightArrow || input === "l") {
				updateSelectedValidMove([0, 1])
			}
			if (key.upArrow || input === "k") {
				updateSelectedValidMove([1, 0])
			}
			if (key.downArrow || input === "j") {
				updateSelectedValidMove([-1, 0])
			}
			if (key.return) {
				cb.current!.playMove(hoveredPos, validMovesPos[selectedValidMoveIndex]!)

				cp.current.stdin!.write(`position fen ${boardToFenString(cb.current.board)}\n`)
				cp.current.stdin!.write('go depth 10\n')
				setIsPaused(true)
			}
		}
	})

	const BLACK_SQUARE_BG = '#171717'
	const WHITE_SQUARE_BG = '#292929'
	const WHITE_PIECE = 'cyan'
	const BLACK_PIECE = '#808080'
	const BLUE_BG = '#252c30'
	const DARK_BLUE_BG = '#1f2528'

	const getBackgroundColor = (i: number, j: number) => {

		const isLightSquare = ((i+j) % 2) === 0

		if (validMovesPos.length !== 0) {
			const selectedValidMove = validMovesPos[selectedValidMoveIndex]!
			if (
				selectedValidMove.row === i && selectedValidMove.col === j
			) {
				return isLightSquare ? BLUE_BG : DARK_BLUE_BG
			}
		}

		if (includedInValidMoves(i, j)) {
			return isLightSquare ? WHITE_SQUARE_BG : BLACK_SQUARE_BG
		}

		if (hoveredPos?.row === i && hoveredPos?.col === j) {
			return isLightSquare ? BLUE_BG : DARK_BLUE_BG
		}

		return isLightSquare ? WHITE_SQUARE_BG : BLACK_SQUARE_BG
	}

	return cb.current.board.slice().reverse().map((row, iReverse) => {
		const i = 7 - iReverse
		return <React.Fragment key={i}>
			<Text>
				{
					row.map((_, j) => (
						<Text key={j} backgroundColor={getBackgroundColor(i, j)}>
							{` ` + ` ` + ` ` + ` ` + ` ` + ` ` + ` `}
						</Text>
					))
				}
			</Text>
			<Text>
				{
					row.map((piece, j) => (
						<Text key={j} backgroundColor={getBackgroundColor(i, j)} color={includedInValidMoves(i, j) ? "red" : piece?.color === "black" ? BLACK_PIECE : WHITE_PIECE}>
							{` `}
							{` `}
							{` `}
							{
								piece === null ? (includedInValidMoves(i, j) ? "•" : " ") : CHESS_PIECES_DISPLAY_MAP[
									piece!.constructor.name
								]![piece!.color]!
							}
							{` `}
							{` `}
							{` `}
						</Text>
					))
				}
			</Text>
			<Text>
				{
					row.map((piece, j) => (
						<Text key={j} backgroundColor={getBackgroundColor(i, j)} color={includedInValidMoves(i, j) ? "red" : piece?.color === "black" ? BLACK_PIECE : WHITE_PIECE}>
							{` `}
							{` `}
							{` `}
							{
								piece === null ? " " : piece!.constructor.name[0]
							}
							{` `}
							{` `}
							{` `}
						</Text>
					))
				}
			</Text>
			<Text>
				{
					row.map((_, j) => (
						<Text key={j} backgroundColor={getBackgroundColor(i, j)}>
							{` ` + ` ` + ` ` + ` ` + ` ` + ` ` + ` `}
						</Text>
					))
				}
			</Text>
		</React.Fragment>
	})
}
