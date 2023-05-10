"use client"
import React, { useEffect, useState } from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import { useChessboard } from '@/context/BoardContext'
import styles from "../styles/learnPage.module.css"
import TrainBoard from '@/components/chessboard/TrainBoard'
import MoveTable from '@/components/moveTable/MoveTable'
import { getMoveSequence } from '../api/firebaseAccess'
import { getAlternateLine } from '../api/firebaseAccess'
import VariationTable from '@/components/variationTable/VariationTable'

const TrainPage = () => {
    const {setMoveHistory, openingLine, setOpeningLine, openingName, setMoveSequence, setOpeningComplete} = useChessboard()

    useEffect(() => {
        setMoveSequence(getMoveSequence(openingLine));
        setMoveHistory([]);
        setOpeningComplete(false);
    }, [openingName, openingLine, setMoveSequence, setMoveHistory, setOpeningComplete]);

    useEffect(() => {
        setMoveHistory([]);
    }, []);

    async function changeLine() {
        setOpeningLine(await getAlternateLine(openingLine));
        setMoveSequence(getMoveSequence(openingLine));
        setOpeningComplete(false)
        setMoveHistory([]);
    }

    return (
        <>
            <NavbarComponent />
            <div className={styles.learn_row}>
                <div className={styles.learn_hc1}>
                    <VariationTable />
                </div>
                <div className={styles.learn_hc2}>
                    <TrainBoard />
                </div>
                <div className={styles.learn_hc3}>
                    <MoveTable />
                </div>
            </div>
            <button onClick={changeLine}>Try another line!</button>
        </>
    )
}

export default TrainPage