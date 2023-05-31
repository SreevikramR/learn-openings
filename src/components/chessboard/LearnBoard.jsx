import { useChessboard } from "@/context/BoardContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveSelector from "../../scripts/MoveSelector";
import React, { useState, useEffect } from 'react'
import { openingLineCompleted } from "@/app/api/firebaseAccess";

let nextMove;
let tempMoveHistory = []
let arrowArray = []
let playedFirstMove = false;

const LearnBoard = () => {
	const {moveHistory, setMoveHistory, openingLine, openingName, setMoveResult, moveSequence, game, setGame, position, setPosition, setOpeningComplete, openingComplete, playerColor} = useChessboard()

	tempMoveHistory = moveHistory;

	const [boardWidth, setBoardWidth] = useState(500);

	useEffect(() => {
		setGame(new Chess());
		initBoardWidth();
		if(playerColor == 'black'){
			console.log('black playing')
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
		if(window.innerWidth < 450) {
			setBoardWidth(window.innerWidth / 1.5);
		} else if(window.innerWidth < 850) {
			setBoardWidth(window.innerWidth / 2.25);
		} else {
			setBoardWidth(window.innerWidth / 3);
		}
	}

	async function blackFirstMove(){
		const gameBackup = game;
		gameBackup.loadPgn(game.pgn());
		const gameCopy = game;
		gameCopy.loadPgn(game.pgn());
		//console.log(move)
		//console.log(moveSequence)
		await gameCopy.move(moveSequence[0]);
		await setGame(gameCopy);
		await setPosition(game.fen());
		await setMoveHistory(gameCopy.history());
		getExpectedMove()
	}

	function getExpectedMove() {
		arrowArray = []
		let gameCopy = new Chess(game.fen());
		gameCopy.loadPgn(game.pgn());
		tempMoveHistory = gameCopy.history();
		let expectedMove = MoveSelector(tempMoveHistory, openingLine);
		if(expectedMove != undefined) {
			//console.log(expectedMove)
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
		} else {
			getExpectedMove()
		}
	}, [openingLine, playerColor]);

	const makeMove = (move) => {
		const gameBackup = game;
		gameBackup.loadPgn(game.pgn());
		const gameCopy = game;
		gameCopy.loadPgn(game.pgn());
		//console.log(move)
		gameCopy.move(move);
		setGame(gameCopy);
		setPosition(game.fen());

		//moveHistory = gameCopy.history();
		setMoveHistory(gameCopy.history());
		tempMoveHistory = gameCopy.history();
		//console.log("last move played: " + moveHistory[moveHistory.length - 1])
		nextMove = MoveSelector(tempMoveHistory, openingLine);
		//console.log(nextMove)

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
			openingLineCompleted(openingName, openingLine, playerColor, "learn")
			//console.log("move sequence complete")
		} else {
			setTimeout(() => {
				setMoveResult("correct");

				if (tempMoveHistory.length === moveSequence.length - 1) {
					setOpeningComplete(true)
					openingLineCompleted(openingName, openingLine, playerColor, "learn")
				}

				playMove(nextMove);
			}, 250);
		}
	};

	const playMove = (nextMove) => {
		const gameCopy = game;
		gameCopy.loadPgn(game.pgn());
		//console.log(nextMove)
		gameCopy.move(nextMove);
		setGame(gameCopy);
		setPosition(game.fen());
		//moveHistory.push(nextMove)
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
		<div className={"border-8" + (openingComplete ? " border-green-600" : " border-none")}>
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
		</div>
	);
}

export default LearnBoard