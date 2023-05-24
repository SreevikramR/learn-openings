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
                <td className="w-1/4 text-right justify-center flex flex-wrap content-center"><span className='text-black'>&#10004;</span><span className='text-white'>&#10004;</span></td>
            </tr>
        );
        rows.push(row)
    }

    return (
        <div className="flex flex-col">
            <h2 className={styles.openingName}>{openingName}</h2>
            <div className={styles.tableContainer}>
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
        </div>
    )
}

export default VariationTable