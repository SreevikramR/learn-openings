"use client"
import React, {useEffect} from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import LearnBoard from '@/components/chessboard/LearnBoard'
import { useChessboard } from '@/context/BoardContext'
import styles from "../styles/learnPage.module.css"
import MoveTable from '@/components/moveTable/MoveTable'
import { getMoveSequence } from '../api/firebaseAccess'
import { getAlternateLine } from '../api/firebaseAccess'
import VariationTable from '@/components/variationTable/VariationTable'
import PageWrapper from '@/components/wrapper/pageWrapper'

const LearnPage = () => {
    const {setMoveHistory, openingLine, setOpeningLine, openingName, setMoveSequence, setOpeningComplete} = useChessboard()

    useEffect(() => {
        if (openingLine === "") {
            window.location.href = "/learn_now"
        }
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
            <PageWrapper>
                <NavbarComponent />
                <div className={styles.learn_row}>
                    <div className={styles.learn_hc1}>
                        <VariationTable />
                    </div>
                    <div className={styles.learn_hc2}>
                        <LearnBoard />
                    </div>
                    <div className={styles.learn_hc3}>
                        <MoveTable />
                    </div>
                </div>
                <button onClick={changeLine}>Try another line!</button>
            </PageWrapper>
        </>
    )
}

export default LearnPage