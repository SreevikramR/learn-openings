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

const LearnBoard = ({ moveSequence, openingName, openingLine }) => {
    const { setMoveHistory, setMoveResult, game, setGame, position, setPosition, setOpeningComplete, openingComplete, playerColor, isBoardLoaded, setIsBoardLoaded } = useChessboard();
    const [boardWidth, setBoardWidth] = useState(500);
    const [explanation, setExplanation] = useState("Make your first move to begin.");
    const [arrows, setArrows] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // single source of truth

    const moveQueue = useRef({ expectedMove: null });
    const isProcessing = useRef(false);

    const searchParams = useSearchParams();
    const params = searchParams.get('demo');

    useEffect(() => {
        const gameCopy = new Chess();
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setOpeningComplete(false);
        setCurrentIndex(0);

        const handleResize = () => {
            if (window.innerWidth < 450) setBoardWidth(window.innerWidth / 1.5);
            else if (window.innerWidth < 850) setBoardWidth(window.innerWidth / 2.25);
            else setBoardWidth(window.innerWidth / 3);
        };

        handleResize();
        setIsBoardLoaded(true);
        window.addEventListener('resize', handleResize);

        if (playerColor === "black") {
            // Auto-play White’s first move
            setTimeout(() => {
                const gameCopyBlack = new Chess();
                gameCopyBlack.move(moveSequence[0]);
                setGame(gameCopyBlack);
                setPosition(gameCopyBlack.fen());
                setMoveHistory(gameCopyBlack.history());
                getAndShowExpectedMove(gameCopyBlack.history());
                setCurrentIndex(1);
            }, 500);
        } else {
            // White plays first → show arrow
            getAndShowExpectedMove(gameCopy.history());
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [playerColor, openingName, openingLine]);

    const getAndShowExpectedMove = async (currentHistory) => {
        const expectedMove = await MoveSelector(currentHistory, openingName, openingLine);
        moveQueue.current.expectedMove = expectedMove;

        if (expectedMove && expectedMove !== "invalid") {
            const tempGame = new Chess();
            currentHistory.forEach(move => tempGame.move(move));
            tempGame.move(expectedMove);
            const history = tempGame.history({ verbose: true });
            const lastMove = history[history.length - 1];
            setArrows([[lastMove.from, lastMove.to]]);
        } else if (!expectedMove) {
            setOpeningComplete(true);
            openingLineCompleted(openingName, openingLine, playerColor, "learn");
        }
    };

    const playOpponentMove = (move, currentFen) => {
        const gameCopy = new Chess(currentFen);
        gameCopy.move(move);
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        getAndShowExpectedMove(gameCopy.history());
        setCurrentIndex(prev => prev + 1);
    };

    const handlePlayerMove = async (move) => {
        if (isProcessing.current || openingComplete) return;

        const fenBeforeMove = game.fen();
        const gameCopy = new Chess(fenBeforeMove);
        const playedMove = gameCopy.move(move);

        if (playedMove === null) return;

        isProcessing.current = true;
        setArrows([]);

        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        setExplanation("Analyzing your move...");

        const expectedMoveSan = moveSequence[currentIndex];
        const isCorrectMove = (playedMove.san === expectedMoveSan);

        try {
            const explanationText = await getExplanationFromGemini(
                fenBeforeMove,
                playedMove.san,
                isCorrectMove ? null : expectedMoveSan
            );
            setExplanation(explanationText);
        } catch (err) {
            console.error("Failed to get explanation:", err);
            setExplanation("Sorry, an explanation could not be fetched.");
        }

        if (isCorrectMove) {
            setMoveResult("correct");
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);

            if (nextIndex < moveSequence.length) {
                const nextMove = moveSequence[nextIndex];

                // Opponent’s turn → auto-play
                if ((playerColor === "white" && nextIndex % 2 === 1) ||
                    (playerColor === "black" && nextIndex % 2 === 0)) {
                    setTimeout(() => playOpponentMove(nextMove, gameCopy.fen()), 300);
                }
            } else {
                setOpeningComplete(true);
                openingLineCompleted(openingName, openingLine, playerColor, "learn");
            }
        } else {
            setMoveResult("wrong");
            setTimeout(() => {
                const gameBeforeMove = new Chess(fenBeforeMove);
                setGame(gameBeforeMove);
                setPosition(gameBeforeMove.fen());
                setMoveHistory(gameBeforeMove.history());
            }, 1000);
        }

        isProcessing.current = false;
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
