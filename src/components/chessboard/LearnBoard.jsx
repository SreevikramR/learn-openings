"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useChessboard } from "@/context/BoardContext";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveSelector from "../../scripts/MoveSelector";
import { openingLineCompleted } from "@/app/api/firebaseAccess";
import LoadingOverlay from "../overlay/LoadingOverlay";
import { useSearchParams } from 'next/navigation';
import ExplanationBox from "../explanation/ExplanationBox";
import MoveTable from "../moveTable/MoveTable";
import { getExplanationFromGemini } from "../explanation/geminiHelper";

// --- Removed global variables to prevent bugs with React re-renders ---

const LearnBoard = ({ moveSequence, openingName, openingLine }) => {
    const { setMoveHistory, setMoveResult, game, setGame, position, setPosition, setOpeningComplete, openingComplete, playerColor, isBoardLoaded, setIsBoardLoaded } = useChessboard();
    const [boardWidth, setBoardWidth] = useState(500);
    const [explanation, setExplanation] = useState("Make your first move to begin.");
    const [arrows, setArrows] = useState([]);

    // Use useRef to store values that don't need to trigger re-renders
    const moveQueue = useRef({ expectedMove: null, history: [] });
    const isProcessing = useRef(false); // Prevents multiple moves from being processed at once

    const searchParams = useSearchParams();
    const params = searchParams.get('demo');

    useEffect(() => {
        const gameCopy = new Chess();
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setOpeningComplete(false);

        const handleResize = () => {
            if (window.innerWidth < 450) setBoardWidth(window.innerWidth / 1.5);
            else if (window.innerWidth < 850) setBoardWidth(window.innerWidth / 2.25);
            else setBoardWidth(window.innerWidth / 3);
        };

        handleResize();
        setIsBoardLoaded(true);
        window.addEventListener('resize', handleResize);

        // Initial setup based on player color
        if (playerColor === 'black') {
            setTimeout(playFirstOpponentMove, 1000);
        } else {
            getAndShowExpectedMove();
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [playerColor, openingName, openingLine]); // Re-run effect if the opening changes


    const getAndShowExpectedMove = async () => {
        const currentHistory = game.history();
        const expectedMove = await MoveSelector(currentHistory, openingName, openingLine);
        moveQueue.current.expectedMove = expectedMove;

        if (expectedMove && expectedMove !== "invalid") {
            const gameCopy = new Chess(game.fen());
            gameCopy.move(expectedMove);
            const history = gameCopy.history({ verbose: true });
            const lastMove = history[history.length - 1];
            setArrows([[lastMove.from, lastMove.to]]);
        } else if (!expectedMove) {
            // Opening is complete from the computer's perspective
            setOpeningComplete(true);
            openingLineCompleted(openingName, openingLine, playerColor, "learn");
        }
    };

    const playFirstOpponentMove = () => {
        const gameCopy = new Chess();
        gameCopy.move(moveSequence[0]);
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        getAndShowExpectedMove();
    };

    const playOpponentMove = (move) => {
        const gameCopy = new Chess(game.fen());
        gameCopy.move(move);
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        getAndShowExpectedMove();
    };

    const handlePlayerMove = async (move) => {
        if (isProcessing.current || openingComplete) return; // Don't process if busy or done

        // --- Step 1: Make the move on a copy to validate it ---
        const fenBeforeMove = game.fen();
        const gameCopy = new Chess(fenBeforeMove);
        const playedMove = gameCopy.move(move);

        // If the move is illegal, do nothing.
        if (playedMove === null) {
            return;
        }

        isProcessing.current = true; // Lock processing
        setArrows([]); // Clear hint arrows

        // --- Step 2: Update the UI *immediately* to feel responsive ---
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        setExplanation("Analyzing your move..."); // Set loading state

        // --- Step 3: Fetch explanation in the background ---
        const expectedMoveSan = moveQueue.current.expectedMove;
        const isCorrectMove = (playedMove.san === expectedMoveSan);

        try {
            const explanationText = await getExplanationFromGemini(fenBeforeMove, playedMove.san, isCorrectMove ? null : expectedMoveSan);
            setExplanation(explanationText);
        } catch (err) {
            console.error("Failed to get explanation:", err);
            setExplanation("Sorry, an explanation could not be fetched.");
        }

        // --- Step 4: Handle the game logic after the move ---
        if (isCorrectMove) {
            setMoveResult("correct");
            const nextOpponentMove = await MoveSelector(gameCopy.history(), openingName, openingLine);

            if (nextOpponentMove && nextOpponentMove !== "invalid") {
                setTimeout(() => playOpponentMove(nextOpponentMove), 300);
            } else {
                setOpeningComplete(true);
                openingLineCompleted(openingName, openingLine, playerColor, "learn");
            }
        } else {
            // Incorrect move
            setMoveResult("wrong");
            // Revert the board to the state before the wrong move after a short delay
            setTimeout(() => {
                const gameBeforeMove = new Chess(fenBeforeMove);
                setGame(gameBeforeMove);
                setPosition(gameBeforeMove.fen());
                setMoveHistory(gameBeforeMove.history());
                getAndShowExpectedMove(); // Show the correct move hint again
            }, 1000);
        }

        isProcessing.current = false; // Unlock processing
    };


    const onDrop = (startSquare, endSquare) => {
        handlePlayerMove({
            from: startSquare,
            to: endSquare,
            promotion: "q",
        });
    };

    const isDraggable = ({ piece }) => {
        if (isProcessing.current || openingComplete) return false;
        return piece.startsWith(playerColor[0]);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className={"border-8 w-fit " + (openingComplete ? "border-green-600" : "border-transparent")}>
                <h1 className="text-white text-4xl font-bold text-center">{openingName}</h1>
                <h2 className="text-white text-xl font-bold mb-2 text-center">{openingLine}</h2>
                <Chessboard
                    boardWidth={boardWidth}
                    position={position}
                    onPieceDrop={onDrop}
                    isDraggablePiece={isDraggable}
                    animationDuration={200}
                    customArrows={arrows}
                    customArrowColor="rgb(87, 109, 232, 0.9)"
                    boardOrientation={playerColor}
                />
                {!isBoardLoaded && <div className="justify-center flex"><LoadingOverlay /></div>}
            </div>

            <div className="flex flex-col justify-start gap-4 w-full md:w-[300px]">
                <ExplanationBox explanation={explanation} />
                <MoveTable moveSequence={moveSequence} openingLine={openingLine} />
            </div>
        </div>
    );
}

export default LearnBoard;