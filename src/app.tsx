import React, { useEffect, useRef, useState } from 'react';
import {Box, Text, useApp, useInput} from 'ink';
import { CHESS_PIECES_DISPLAY_MAP, ChessBoard, Pos } from './game/board.js';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	const [input, setInput] = useState('')
	const {exit} = useApp()

	const [hoveredPos, setHoveredPos] = useState<null | Pos>({
		row: 0,
		col: 0
	})

	const [selectedPos, setSelectedPos] = useState<null | Pos>(null)

	const cb = useRef(new ChessBoard())

	useEffect(() => {

	}, [])

	useInput((input, key) => {
		if (key.escape) {
			exit()
		}
		setInput((oldInput) => { 
			return oldInput + input	
		})
	})

	const renderBoardPieces = () => {

		const result = []

		for (let row = 0; row < cb.current.board.length; row++) {
			const innerResult = []
			for (let col = 0; col < cb.current.board[0]!.length; col++) {
				const piece = cb.current.board[hoveredPos!.row]![hoveredPos!.col]
				innerResult.push(
					<Text backgroundColor="gray" key={`${row},${col}`}>
						{
							piece === null ? " " : 
								CHESS_PIECES_DISPLAY_MAP[
									piece!.constructor.name
								]![piece!.color]
					}
					</Text>
				)
			}
			result.push(innerResult)
		}

		return result
	}

	return (
		<Box flexDirection="row">
			{renderBoardPieces()}
		</Box>
	);
}
