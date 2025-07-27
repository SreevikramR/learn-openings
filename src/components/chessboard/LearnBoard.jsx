"use client"
import React, { useState, useEffect } from 'react'
import { useChessboard } from "@/context/BoardContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveSelector from "../../scripts/MoveSelector";
import { openingLineCompleted } from "@/app/api/firebaseAccess";
import LoadingOverlay from "../overlay/LoadingOverlay";
import { useSearchParams } from 'next/navigation';
import ExplanationBox from "../explanation/ExplanationBox";  // ✅ NEW IMPORT
import MoveTable from "../moveTable/MoveTable";            // ✅ NEW IMPORT

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
		window.addEventListener('resize', initBoardWidth)
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
				return piece.piece.startsWith("w");
			} else if (playerColor == 'black'){
				return piece.piece.startsWith("b");
			}
		}
		return false;
	};

	return (
		<div className="flex flex-col md:flex-row gap-4">
      
			<div className={"border-8 w-fit " + (openingComplete ? "border-green-600" : "border-none")}>
        <h1 className="text-white text-4xl font-bold text-center">{openingName}</h1>
        <h2 className="text-white text-xl font-bold mb-2 text-center">
      {openingLine}
    </h2>
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
					<LoadingOverlay />
				</div>
			</div>

			{/* RIGHT PANEL */}
			<div className="flex flex-col justify-start gap-4 w-full md:w-[300px]">
      <ExplanationBox currentFEN={game.fen()} />  {/* This shows correct explanation */}
      <MoveTable moveSequence={moveSequence} openingLine={openingLine} />
    </div>
		</div>
	);
}

export default LearnBoard
