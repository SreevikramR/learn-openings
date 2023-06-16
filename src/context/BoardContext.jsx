"use client"

import React, { useContext, createContext, forwardRef } from 'react'
import { useState } from 'react';
import { Chess } from 'chess.js';

export const ChessboardContext = createContext();

export const useChessboard = () => useContext(ChessboardContext)

export const BoardProvider = ({ children }) => {
	const [moveHistory, setMoveHistory] = useState([]);
	const [openingName, setOpeningName] = useState("Ruy Lopez")
  	const [openingLine, setOpeningLine] = useState("");
	const [lineVariations, setLineVariations] = useState([]);
  	const [moveResult, setMoveResult] = useState("correct");
	const [moveSequence, setMoveSequence] = useState([]);
	const [popUpState, setPopUpState] = useState(false);
	const [popUpType, setPopUpType] = useState("")
	const [game, setGame] = useState(new Chess());
	const [position, setPosition] = useState()
	const [openingComplete, setOpeningComplete] = useState(false)
	const [playerColor, setPlayerColor] = useState('white')
	const [mode, setMode] = useState('')
	const [isBoardLoaded, setIsBoardLoaded] = useState(false)

	const value = {
		openingName,
		setOpeningName,
		moveHistory,
		setMoveHistory,
		openingLine,
		setOpeningLine,
		moveResult,
		setMoveResult,
		moveSequence,
		setMoveSequence,
		popUpState,
		setPopUpState,
		popUpType,
		setPopUpType,
		game,
		setGame,
		position,
		setPosition,
		openingComplete,
		setOpeningComplete,
		lineVariations,
		setLineVariations,
		playerColor,
		setPlayerColor,
		mode,
		setMode,
		isBoardLoaded,
		setIsBoardLoaded,
	}
	

	return (
		<ChessboardContext.Provider value={value}>
			{ children }
		</ChessboardContext.Provider>
	)
}