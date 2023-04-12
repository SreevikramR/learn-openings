"use client"
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { getAlternateLine, getMoveSequence, readOpening, setFirstLine } from "@/app/api/firebaseAccess";

let firstRun = true;

const AnimatedBoard = () => {
    const [game, setGame] = useState(new Chess());
    const [position, setPosition] = useState();
    const [boardWidth, setBoardWidth] = useState(window.innerWidth / 3);

    let moveSequence = [];
    let openingVariation;

    useEffect(() => {
        setBoardWidth(window.innerWidth / 3);
        playMoves();
    }, []);

    window.onresize = () => {
        setBoardWidth(window.innerWidth / 3);
    };

    const makeMove = (move) => {
        const gameCopy = game;
        gameCopy.loadPgn(game.pgn());
        gameCopy.move(move);
        setGame(gameCopy);
        setPosition(gameCopy.fen());
    };

    const isDraggable = (piece, sourceSquare) => {
        return false;
    }

    async function playMoves () {
        if (firstRun) {
            firstRun = false;
            await readOpening("Ruy Lopez");
            openingVariation = await setFirstLine("Ruy Lopez");
        }
        const gameCopy = new Chess();
        game.loadPgn(gameCopy.pgn());
        setPosition(gameCopy.fen());

        openingVariation = await getAlternateLine(openingVariation);
        moveSequence = await getMoveSequence(openingVariation);

        for (let i = 0; i < moveSequence.length; i++) {
            if (window.location.pathname === "/") {
                const timer = (ms) => new Promise((res) => setTimeout(res, ms));
                await timer(1400);
                makeMove(moveSequence[i]);
            }
        }

        const timer = (ms) => new Promise((res) => setTimeout(res, ms));
        await timer(1400);
        if (window.location.pathname !== "/") {
            return;
        } else {
            playMoves();
        }
    };

	return (
		<>
			<Chessboard 
                boardWidth={boardWidth} 
                position={position} 
                isDraggablePiece={isDraggable} 
                animationDuration={750} 
            />
		</>
	);
};

export default AnimatedBoard