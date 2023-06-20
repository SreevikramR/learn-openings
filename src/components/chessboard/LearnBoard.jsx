"use client"
import React, { useState, useEffect } from 'react'
import { useChessboard } from "@/context/BoardContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveSelector from "../../scripts/MoveSelector";
import { openingLineCompleted } from "@/app/api/firebaseAccess";
import LoadingOverlay from "../overlay/LoadingOverlay";
import { useSearchParams } from 'next/navigation';

let nextMove;
let tempMoveHistory = []
let arrowArray = []
let playedFirstMove = false;
let firstRun = true;

const LearnBoard = ({ moveSequence, openingName, openingLine }) => {
	const { setMoveHistory, setMoveResult, game, setGame, position, setPosition, setOpeningComplete, openingComplete, playerColor, isBoardLoaded, setIsBoardLoaded} = useChessboard()

	const [boardWidth, setBoardWidth] = useState(500);

	const searchParams = useSearchParams()
	const params = searchParams.get('demo')

	useEffect(() => {
		const gameCopy = new Chess();
		game.loadPgn(gameCopy.pgn());
		setPosition(game.fen());
		setOpeningComplete(false)
		initBoardWidth();
		if(playerColor == 'black'){
			setTimeout(() => {
				getExpectedMove()
				if(!playedFirstMove){
					blackFirstMove()
				}
			}, 1500);
		} else {
			getExpectedMove()
		}
		window.addEventListener('resize', ()=> {
            if(window.innerWidth < 450) {
				setBoardWidth(window.innerWidth / 1.5);
			} else if(window.innerWidth < 850) {
				setBoardWidth(window.innerWidth / 2.25);
			} else {
				setBoardWidth(window.innerWidth / 3);
			}
        })
		firstRun = false;
	}, []);

	useEffect(() => {
		if(!firstRun) {
			const gameCopy = new Chess();
			game.loadPgn(gameCopy.pgn());
			setPosition(game.fen());
			setOpeningComplete(false)
			if(playerColor == 'black'){
				setTimeout(() => {
					blackFirstMove()
					playedFirstMove = true
				}, 800);
			} else {
				getExpectedMove()
			}
		}
	}, [playerColor]);

	function initBoardWidth() {
		if(window.innerWidth < 450) {
			setBoardWidth(window.innerWidth / 1.5);
		} else if(window.innerWidth < 850) {
			setBoardWidth(window.innerWidth / 2.25);
		} else {
			setBoardWidth(window.innerWidth / 3);
		}
		setIsBoardLoaded(true)
	}

	async function blackFirstMove(){
		const gameBackup = game;
		gameBackup.loadPgn(game.pgn());
		const gameCopy = game;
		gameCopy.loadPgn(game.pgn());
		await gameCopy.move(moveSequence[0]);
		await setGame(gameCopy);
		await setPosition(game.fen());
		await setMoveHistory(gameCopy.history());
		playedFirstMove = true
	}

	async function getExpectedMove() {
		arrowArray = []
		let gameCopy = new Chess(game.fen());
		gameCopy.loadPgn(game.pgn());
		tempMoveHistory = gameCopy.history();
		let expectedMove = await MoveSelector(tempMoveHistory, openingName, openingLine);
		if(expectedMove != undefined) {
			gameCopy.move(expectedMove)
			let history = gameCopy.history({verbose: true})
			let tempArray = []
			tempArray.push(history.at(-1).from)
			tempArray.push(history.at(-1).to)
			arrowArray.push(tempArray)
		} else {
			setOpeningComplete(true)
			openingLineCompleted(openingName, openingLine, playerColor, "learn")
		}
	}

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

		if (nextMove === "invalid") {
			setMoveResult("wrong");
			setTimeout(() => {
				game.undo();
				setGame(gameBackup);
				setPosition(gameBackup.fen());
				getExpectedMove()
			}, 100);
		} else if (nextMove == null) {
			setMoveResult("correct");
			setOpeningComplete(true)
			if(params === 'true') {
				umami.track('Demo - variation complete - ' + openingName + ' - ' + openingLine)
			} else {
				umami.track('Learn - variation complete')
			}
			openingLineCompleted(openingName, openingLine, playerColor, "learn")
		} else {
			setTimeout(() => {
				setMoveResult("correct");
				if (tempMoveHistory.length === moveSequence.length - 1) {
					setOpeningComplete(true)
					if(params === 'true') {
						umami.track('Demo - variation complete - ' + openingName + ' - ' + openingLine)
					} else {
						umami.track('Learn - variation complete')
					}
					openingLineCompleted(openingName, openingLine, playerColor, "learn")
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
		getExpectedMove()
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
		<div className={"border-8 w-fit" + (openingComplete ? " border-green-600" : " border-none")}>
			<Chessboard
				boardWidth={boardWidth}
				position={position}
				onPieceDrop={onDrop}
				isDraggablePiece={isDraggable}
				animationDuration={750}
				customArrows={arrowArray}
				customArrowColor="rgb(87, 109, 232, 0.9)"
				boardOrientation={playerColor}
			/>
			<div className={"justify-center" + (!isBoardLoaded ? " flex" : " hidden")}>
                <LoadingOverlay/>
            </div>
		</div>
	);
}

export default LearnBoard