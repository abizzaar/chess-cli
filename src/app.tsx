import React, { useEffect, useRef, useState } from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import { CHESS_PIECES_DISPLAY_MAP, ChessBoard, Pos } from './game/board.js';
import stringWidth from 'string-width';

function modulo(n: number, m: number) {
	return ((n % m) + m) % m;
  }

export default function App() {
	const {exit} = useApp()

	const [hoveredPos, setHoveredPos] = useState<Pos>({
		row: 6,
		col: 4
	})

	const [validMovesPos, setValidMovesPos] = useState<Pos[]>([])

	const [selectedValidMoveIndex, setSelectedValidMoveIndex] = useState<number>(-1)

	const cb = useRef(new ChessBoard())

	const updatePos = (posDelta: number[]) => {
		const newPos = {
			row: hoveredPos.row + posDelta[0]!,
			col: hoveredPos!.col + posDelta[1]!
		}

		if (
			newPos!.row >= 0 && newPos!.row < 8 && newPos!.col >= 0 && newPos!.col < 8
		) {
			setHoveredPos(newPos)	
		}
	}

	useInput((input, key) => {
		if (key.escape) {
			setValidMovesPos([])
		}

		if (validMovesPos.length === 0) {
			if (key.leftArrow || input === "h") {
				updatePos([0, -1])
			}
			if (key.rightArrow || input === "l") {
				updatePos([0, 1])
			}
			if (key.upArrow || input === "k") {
				updatePos([-1, 0])
			}
			if (key.downArrow || input === "j") {
				updatePos([1, 0])
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
				setSelectedValidMoveIndex(prev => modulo(prev - 1, validMovesPos.length))
			}
			if (key.rightArrow || input === "l") {
				setSelectedValidMoveIndex(prev => modulo(prev + 1, validMovesPos.length))
			}
			if (key.upArrow || input === "k") {
				setSelectedValidMoveIndex(prev => modulo(prev + 1, validMovesPos.length))
			}
			if (key.downArrow || input === "j") {
				setSelectedValidMoveIndex(prev => modulo(prev - 1, validMovesPos.length))
			}
			if (key.return) {
				cb.current!.playMove(hoveredPos, validMovesPos[selectedValidMoveIndex]!)
				setHoveredPos(validMovesPos[selectedValidMoveIndex]!)
				setSelectedValidMoveIndex(-1)
				setValidMovesPos([])
			}
		}
		
		
	})

	const WHITE_SQUARE_BG = '#4a4a4a'
	const BLACK_SQUARE_BG = '#333333'
	const BLUE_BG = '#3e4a52'
	const DARK_BLUE_BG = '#36444d'

	const includedInValidMoves = (i: number, j: number) => {
		const validMove = validMovesPos.find(pos => {
			return pos.row === i && pos.col === j
		})
		return validMove !== undefined
	}

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

	return cb.current.board.map((row, i) => {
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
						<Text key={j} backgroundColor={getBackgroundColor(i, j)} color={includedInValidMoves(i, j) ? "red" : piece?.color === "black" ? "#000000" : "white"}>
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
						<Text key={j} backgroundColor={getBackgroundColor(i, j)} color={includedInValidMoves(i, j) ? "red" : piece?.color === "black" ? "#000000" : "white"}>
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
