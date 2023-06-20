"use client"
import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import MoveSelector from "@/scripts/MoveSelector";
import { Chessboard } from "react-chessboard";
import { useChessboard } from "@/context/BoardContext";
import LoadingOverlay from "../overlay/LoadingOverlay";
import { openingLineCompleted } from "@/app/api/firebaseAccess";

let previousLine = "Cozio Defense";
let nextMove;
let tempMoveHistory = []
let playedFirstMove = false

const TrainBoard = ({ moveSequence, openingName, openingLine }) => {

	const {
		setMoveHistory,
		setMoveResult,
		game,
		setGame,
		position, 
		setPosition,
		setOpeningComplete, 
		openingComplete, 
		playerColor, 
		setIsBoardLoaded, 
		isBoardLoaded
	} = useChessboard()
	
	const [boardWidth, setBoardWidth] = useState(500);

	useEffect(() => {
		const gameCopy = new Chess();
		game.loadPgn(gameCopy.pgn());
		setPosition(game.fen());
		setOpeningComplete(false)
		initBoardWidth();
		if(playerColor == 'black'){
			setTimeout(() => {
				if(!playedFirstMove){
					blackFirstMove()
					playedFirstMove = true
				}
			}, 1500);  
		}
		window.addEventListener('resize', ()=> {
			console.log('resize called')
            if(window.innerWidth < 450) {
				setBoardWidth(window.innerWidth / 1.5);
			} else if(window.innerWidth < 850) {
				setBoardWidth(window.innerWidth / 2.25);
			} else {
				setBoardWidth(window.innerWidth / 3);
			}
        })
	}, []);

	function initBoardWidth() {
		setTimeout(() => {
			if(window.innerWidth < 450) {
				setBoardWidth(window.innerWidth / 1.5);
			} else if(window.innerWidth < 850) {
				setBoardWidth(window.innerWidth / 2.25);
			} else {
				setBoardWidth(window.innerWidth / 3);
			}
		}, 100)
		setIsBoardLoaded(true)
	}

	async function blackFirstMove(){
		const gameBackup = game;
		gameBackup.loadPgn(game.pgn());
		const gameCopy = game;
		gameCopy.loadPgn(game.pgn());
		console.log(moveSequence)
		await gameCopy.move(moveSequence[0]);
		await setGame(gameCopy);
		await setPosition(game.fen());
		await setMoveHistory(gameCopy.history());
	}

	useEffect(() => {
		const gameCopy = new Chess();
		game.loadPgn(gameCopy.pgn());
		setPosition(game.fen());
		setOpeningComplete(false)
		if(playerColor == 'black'){
			setTimeout(() => {
				blackFirstMove()
				playedFirstMove = true
			}, 800);
		}
	}, [openingLine, playerColor]);

	if (previousLine != openingLine) {
		const newGame = new Chess();
		setGame(newGame);
		setPosition(game.fen());
		previousLine = openingLine;
	}

	useEffect(() => {
		if (window.innerWidth / 2 > 500) {
			setBoardWidth(500);
		} else {
			setBoardWidth(window.innerWidth / 2.5);
		}
	}, []);

	const makeMove = async (move) => {
		const gameBackup = game;
		gameBackup.loadPgn(game.pgn());
		const gameCopy = game;
		gameCopy.loadPgn(game.pgn());
		gameCopy.move(move);
		setGame(gameCopy);
		setPosition(game.fen());

		setMoveHistory(gameCopy.history());
		tempMoveHistory = gameCopy.history();
		nextMove = await MoveSelector(tempMoveHistory, openingName, openingLine);
		console.log(tempMoveHistory, nextMove, openingName, openingLine)

		if (nextMove === "invalid") {
			setMoveResult("wrong");
			setTimeout(() => {
				game.undo();
				setGame(gameBackup);
				setPosition(gameBackup.fen());
			}, 100);
		} else if (nextMove == null) {
			setMoveResult("correct");
			setOpeningComplete(true)
			openingLineCompleted(openingName, openingLine, playerColor, "train")
			umami.track('Train - variation complete')
		} else {
			setTimeout(() => {
				setMoveResult("correct");

				if (tempMoveHistory.length === moveSequence.length - 1) {
					setOpeningComplete(true)
					openingLineCompleted(openingName, openingLine, playerColor, "train")
					umami.track('Train - variation complete')
				}

				playMove(nextMove);
			}, 250);
		}
	};

	const playMove = (nextMove) => {
		const gameCopy = game;
		gameCopy.loadPgn(game.pgn());
		gameCopy.move(nextMove);
		setGame(gameCopy);
		setPosition(game.fen());
		setMoveHistory(gameCopy.history());
	};

	const onDrop = (startSquare, endSquare) => {
		makeMove({
			from: startSquare,
			to: endSquare,
			promotion: "q",
		});
	};

	const isDraggable = (piece, sourceSquare) => {
		if(!openingComplete) {
			if (playerColor == 'white') {
				if (
					piece.piece === "wP" ||
					piece.piece === "wR" ||
					piece.piece === "wB" ||
					piece.piece === "wN" ||
					piece.piece === "wK" ||
					piece.piece === "wQ"
				) {
					return true;
				} else return false;
			} else if (playerColor == 'black'){
				if (
					piece.piece === "bP" ||
					piece.piece === "bR" ||
					piece.piece === "bB" ||
					piece.piece === "bN" ||
					piece.piece === "bK" ||
					piece.piece === "bQ"
				) {
					return true;
				} else return false;
			}
		} else return false;
	};

	return (
		<div className={"border-8" + (openingComplete ? " border-green-600" : " border-black")}>
			<Chessboard
				boardWidth={boardWidth}
				position={position}
				onPieceDrop={onDrop}
				isDraggablePiece={isDraggable}
				animationDuration={750}
				boardOrientation={playerColor}
			/>
			<div className={"justify-center" + (!isBoardLoaded ? " flex" : " hidden")}>
                <LoadingOverlay/>
            </div>
		</div>
	);
};

export default TrainBoard;