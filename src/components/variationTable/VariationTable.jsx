"use client"
import React from 'react'
import { useChessboard } from '@/context/BoardContext'
import { getMoveSequence } from '@/app/api/firebaseAccess'
import styles from "./VariationTable.module.css"

const VariationTable = () => {
    const {lineVariations, setOpeningLine, setMoveSequence, setOpeningComplete, setMoveHistory, openingName} = useChessboard()

    let lines = lineVariations

    let rows = []

    function setLine(line) {
        setOpeningLine(line);
        setMoveSequence(getMoveSequence(line));
        setOpeningComplete(false)
        setMoveHistory([]);
    }

    for (let i = 0; i < lines.length; i++){
        let line = lines[i]
        let row = (
            <tr key={lines[i]} onClick={() => setLine(line)} className={styles.variationRow}>
                <td className={styles.td}>{lines[i]}</td>
            </tr>
        );
        rows.push(row)
    }

    return (
        <div className="flex flex-col">
            <h2 className={styles.openingName}>{openingName}</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>
                            <h2 className={styles.h2}>Variations</h2>
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    )
}

export default VariationTable