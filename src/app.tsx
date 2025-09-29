import React, { useState } from 'react';
import {Box, Text, useApp, useInput} from 'ink';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	const [input, setInput] = useState('')
	const {exit} = useApp()

	useInput((input, key) => {
		if (key.escape) {
			exit()
		}
		setInput((oldInput) => { 
			return oldInput + input	
		})
	})

	return (
		<Box flexDirection="column">
			<Text>
				Hello, <Text color="green">{name}</Text>
			</Text>
			<Text>Type something (press ESC to exit): {input}</Text>
		</Box>
	);
}
