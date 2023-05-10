import { useChessboard } from "@/context/BoardContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveSelector from "../../scripts/MoveSelector";
import React, { useState, useEffect } from 'react'

let nextMove;
let tempMoveHistory = []
let arrowArray = []
let playedFirstMove = false;

const LearnBoard = () => {
	const {moveHistory, setMoveHistory, openingLine, setMoveResult, moveSequence, game, setGame, position, setPosition, setOpeningComplete, openingComplete, playerColor} = useChessboard()

	tempMoveHistory = moveHistory;

	const [boardWidth, setBoardWidth] = useState(500);

	useEffect(() => {
		setGame(new Chess());
		if(playerColor == 'black'){
			console.log('black playing')
			setTimeout(() => {
				if(!playedFirstMove){
				blackFirstMove()
				playedFirstMove = true
				}
			}, 1500);  
		} else {
			getExpectedMove()
		}
		window.addEventListener('resize', ()=> {
            if (window.innerWidth / 2 > 500) {
				setBoardWidth(500);
			} else {
				setBoardWidth(window.innerWidth / 2.2);
			}
        })
	}, []);

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
			arrowArray = [['c4', 'd3'], ['d3', 'f6']]
			setOpeningComplete(true)
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

	useEffect(() => {
		let viewPortWidth = window.innerWidth;

		if (viewPortWidth / 2 > 500) {
			setBoardWidth(500);
		} else {
			setBoardWidth(viewPortWidth / 2.5);
		}
	}, []);

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
			arrowArray = [['c4', 'd3'], ['d3', 'f6']]
			setOpeningComplete(true)
			//console.log("move sequence complete")
		} else {
			setTimeout(() => {
				setMoveResult("correct");

				if (tempMoveHistory.length === moveSequence.length - 1) {
					arrowArray = [['c4', 'd3'], ['d3', 'f6']]
					setOpeningComplete(true)
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
	);
}

export default LearnBoard