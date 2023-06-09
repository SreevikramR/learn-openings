"use client"
import React, { useEffect, useState } from "react";
import { useChessboard } from "@/context/BoardContext";
import styles from "./MoveTable.module.css";

const MoveTable = ({ moveSequence, openingLine }) => {
	const {moveHistory, moveResult, openingComplete, setOpeningComplete, playerColor, setPlayerColor} = useChessboard()
	const [isPlayerWhite, setIsPlayerWhite] = useState(true);

	useEffect(() => {
		setOpeningComplete(false)
	}, [])
	
	let moveIds = [];
	let correctMoves = [];
	let wrongMove;
	let previousMoveSequence;
  
	useEffect(() => {
		for (let i = 0; i < moveHistory.length - 1; i++){
			document.getElementById("ti" + i).className = styles.td;
		}
		moveIds = [];
		correctMoves = [];
		wrongMove = "";
	}, [openingLine, playerColor])
  
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
		if(openingComplete) {
			document.getElementById('movesTable').classList.add('openingComplete');
		} else {
			setTimeout(() => {
			document.getElementById('movesTable').classList.remove('openingComplete');
			}, 10);
		}
	}, [openingComplete])
  
  
	for (let i = 0; i < numRows; i++) {
		let rowNumber = i + 1;
		let whiteMove = moveHistory[i * 2];
		let blackMove = moveHistory[i * 2 + 1];
		
		let whiteCellId = whiteMove !== undefined ? "ti" + i * 2 : "";
		let blackCellId = blackMove !== undefined ? "ti" + (i * 2 + 1) : "";
		
		if (playerColor == 'white') {
			if (whiteCellId !== "") {
				moveIds.push(whiteCellId);
			}
		} else if (playerColor == 'black') {
			if (blackCellId !== "") {
				moveIds.push(blackCellId);
			}
		}

	
		let row = (
			<tr key={rowNumber}>
				<td className={styles.indexNumber}>{rowNumber}</td>
				<td id={whiteCellId} className={styles.td}>{whiteMove}</td>
				<td id={blackCellId} className={styles.td}>{blackMove}</td>
			</tr>
		);
	
		rows.push(row);
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
	  	//console.log("move is wrong");
	}
  
	useEffect(() => {
		setTimeout(() => {
			if (correctMoves.length !== 0 || wrongMove) {
				for (let j = 0; j < correctMoves.length; j++) {
					document.getElementById(correctMoves[j]).className = styles.correct;
				}
				if (wrongMove) {
					document.getElementById(wrongMove).className = styles.wrong;
				}
			}
		}, 50);
	}, [moveHistory]);

	function togglePlayerColor(){
		setIsPlayerWhite(isWhite => !isWhite);
        setPlayerColor(color => color === 'white' ? 'black' : 'white');
		if(isPlayerWhite) {
			document.getElementById('toggleSwitchHandle').classList = styles.toggleSwitchHandleBlack;
		} else {
			document.getElementById('toggleSwitchHandle').classList = styles.toggleSwitchHandleWhite;
		}
	}
  
	return (
		<div className={styles.tableContainer}>
			<table id='movesTable' className={styles.moveTable}>
				<thead className={styles.thead}>
					<tr className={styles.tr}>
						<th colSpan={3} className={styles.th}>
							<div className={styles.headerBox}>
								<h2 className={styles.h2}>{openingLine}</h2>
								<div className="w-1/4">
									<div className={styles.toggleSwitch} onClick={togglePlayerColor}>
										<div id="toggleSwitchHandle" className={styles.toggleSwitchHandleWhite}></div>
									</div>
								</div>
							</div>
						</th>
					</tr>
				</thead>
				<tbody className={styles.tbody}>{rows}</tbody>
			</table>
		</div>
	);
}

export default MoveTable