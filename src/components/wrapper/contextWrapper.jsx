"use client"
import React from 'react'
import { BoardProvider } from '@/context/BoardContext'

const ContextWrapper = ({ children }) => {
	return (
		<BoardProvider>
			{children}
		</BoardProvider>
	)
}

export default ContextWrapper