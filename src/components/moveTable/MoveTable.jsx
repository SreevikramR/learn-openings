"use client"
import React, { useEffect, useState } from "react";
import { useChessboard } from "@/context/BoardContext";
import styles from "./MoveTable.module.css";

const MoveTable = ({ moveSequence }) => {
	const { moveHistory, moveResult, openingComplete, setOpeningComplete, playerColor, setPlayerColor } = useChessboard();
	const [isPlayerWhite, setIsPlayerWhite] = useState(true);

	useEffect(() => {
		setOpeningComplete(false);
	}, []);

	let moveIds = [];
	let correctMoves = [];
	let wrongMove;
	let previousMoveSequence;

	useEffect(() => {
		for (let i = 0; i < moveHistory.length - 1; i++) {
			document.getElementById("ti" + i)?.classList.remove(styles.correct, styles.wrong);
			document.getElementById("ti" + i)?.classList.add(styles.td);
		}
		moveIds = [];
		correctMoves = [];
		wrongMove = "";
	}, [moveSequence, playerColor]);

	let sequenceLength = moveSequence ? moveSequence.length : 0;
	let numRows = Math.ceil(sequenceLength / 2);
	if (previousMoveSequence !== moveSequence) {
		previousMoveSequence = moveSequence;
		correctMoves = [];
		wrongMove = "";
		moveIds = [];
	}

	let rows = [];

	useEffect(() => {
		if (openingComplete) {
			document.getElementById("movesTable")?.classList.add("openingComplete");
		} else {
			setTimeout(() => {
				document.getElementById("movesTable")?.classList.remove("openingComplete");
			}, 10);
		}
	}, [openingComplete]);

	for (let i = 0; i < numRows; i++) {
		let rowNumber = i + 1;
		let whiteMove = moveHistory[i * 2];
		let blackMove = moveHistory[i * 2 + 1];

		let whiteCellId = whiteMove !== undefined ? "ti" + i * 2 : "";
		let blackCellId = blackMove !== undefined ? "ti" + (i * 2 + 1) : "";

		if (playerColor === "white" && whiteCellId !== "") {
			moveIds.push(whiteCellId);
		} else if (playerColor === "black" && blackCellId !== "") {
			moveIds.push(blackCellId);
		}

		rows.push(
			<tr key={rowNumber}>
				<td className={styles.indexNumber}>{rowNumber}</td>
				<td id={whiteCellId} className={styles.td}>{whiteMove}</td>
				<td id={blackCellId} className={styles.td}>{blackMove}</td>
			</tr>
		);
	}

	let lastMove = moveIds[moveIds.length - 1];
	if (
		moveResult === "correct" &&
		lastMove !== undefined &&
		lastMove !== correctMoves[correctMoves.length - 1]
	) {
		correctMoves.push(lastMove);
		wrongMove = "";
	} else if (moveResult === "wrong") {
		wrongMove = lastMove;
	}

	useEffect(() => {
		setTimeout(() => {
			if (correctMoves.length !== 0 || wrongMove) {
				for (let j = 0; j < correctMoves.length; j++) {
					document.getElementById(correctMoves[j])?.classList.add(styles.correct);
				}
				if (wrongMove) {
					document.getElementById(wrongMove)?.classList.add(styles.wrong);
				}
			}
		}, 50);
	}, [moveHistory]);

	function togglePlayerColor() {
		setIsPlayerWhite((isWhite) => !isWhite);
		setPlayerColor((color) => (color === "white" ? "black" : "white"));
		const toggleHandle = document.getElementById("toggleSwitchHandle");
		if (toggleHandle) {
			toggleHandle.classList = isPlayerWhite
				? styles.toggleSwitchHandleBlack
				: styles.toggleSwitchHandleWhite;
		}
	}

	return (
		<div className={styles.tableContainer}>
			{/* Toggle switch stays above the table */}
			<div className="w-full flex justify-end mb-2">
				<div className={styles.toggleSwitch} onClick={togglePlayerColor}>
					<div id="toggleSwitchHandle" className={styles.toggleSwitchHandleWhite}></div>
				</div>
			</div>

			<table id="movesTable" className={styles.moveTable}>
				<thead className={styles.thead}>
					<tr className={styles.tr}>
						<th>#</th>
						<th>White</th>
						<th>Black</th>
					</tr>
				</thead>
				<tbody className={styles.tbody}>{rows}</tbody>
			</table>
		</div>
	);
};

export default MoveTable;
