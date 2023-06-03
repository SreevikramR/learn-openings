"use client"
import React, { useEffect, useState } from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import LearnBoard from '@/components/chessboard/LearnBoard'
import { useChessboard } from '@/context/BoardContext'
import styles from "../styles/learnPage.module.css"
import MoveTable from '@/components/moveTable/MoveTable'
import { getMoveSequence } from '../api/firebaseAccess'
import VariationTable from '@/components/variationTable/VariationTable'
import PageWrapper from '@/components/wrapper/pageWrapper'

const LearnPage = () => {
    const {setMoveHistory, openingLine, openingName, setMoveSequence, setOpeningComplete} = useChessboard()

    const [movesTabActive, setMovesTabActive] = useState(true);

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

    return (
        <>
            <PageWrapper>
                <NavbarComponent />
                <div className={styles.learn_row}>
                    <div className="flex lg:flex-row items-center flex-col w-full">
                        <div className="w-fit">
                            <div className={styles.learn_hc2}>
                                <LearnBoard />
                            </div>
                        </div>
                        <div className="font-semibold block lg:hidden italic text-2xl text-center">
                            {openingName}
                        </div>
                        <div className="lg:hidden flex w-full justify-center">
                            <div className={styles.menuBar}>
                                <div className={"w-1/2 text-sm text-center pb-1 pt-0 font-semibold border-t-2 rounded-md" + (!movesTabActive ? " bg-zinc-800 border-neutral-900" : " border-white")} onClick={() => {setMovesTabActive(true)}}>
                                    <span>Moves</span>
                                </div>
                                <div className={"w-1/2 text-sm text-center pb-1 pt-0 font-semibold border-t-2 rounded-md" + (movesTabActive ? " bg-zinc-800 border-neutral-900" : " border-white")} onClick={() => {setMovesTabActive(false)}}>
                                    <span>Variations</span>
                                </div>
                            </div>
                        </div>
                        <div className={"lg:order-first lg:w-1/3 w-full lg:flex mb-10 lg:mb-0" + (!movesTabActive ? " flex" : " hidden")}>
                            <div className={styles.learn_hc1}>
                                <VariationTable />
                            </div>
                        </div>
                        <div className={"lg:w-1/3 w-full lg:flex" + (movesTabActive ? " flex" : " hidden")}>
                            <div className={styles.learn_hc3}>
                                <MoveTable />
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        </>
    )
}

export default LearnPage