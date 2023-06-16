"use client"
import React, { useEffect, useState } from "react";
import { parseFromURL, getMoveSequence } from "@/app/api/firebaseAccess";
import { useChessboard } from "@/context/BoardContext";
import PageWrapper from "@/components/wrapper/pageWrapper";
import NavbarComponent from "@/components/navbar/Navbar";
import TrainBoard from "@/components/chessboard/TrainBoard";
import MoveTable from "@/components/moveTable/MoveTable";

const LearnPage = ({ params }) => {
    const { setPlayerColor, setMoveHistory, setOpeningComplete } = useChessboard();

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [opening, setOpening] = useState(params.opening);
    const [variation, setVariation] = useState(params.variation);
    const [moveSequence, setMoveSequence] = useState([]); // Try changing to var and not using a state

    useEffect(() => {
        initData();
    }, [])

    async function initData() {
        const openingName = await parseFromURL(opening);
        const variationName = await parseFromURL(variation);
        setOpening(openingName);
        setVariation(variationName);
        let tempMoveSequence = await getMoveSequence(openingName, variationName);
        setMoveSequence(tempMoveSequence);
        await setPlayerColor("white")
        await setMoveHistory([]);
        await setOpeningComplete(false);
        setIsDataLoaded(true);
    }

    return (
        <PageWrapper>
            <NavbarComponent />
            {isDataLoaded &&
                <>
                    <main className="lg:flex-row flex-col flex lg:columns-2 justify-center align-middle items-center w-full">
                        <div className="w-1/2 col-span-1 relative justify-center flex mt-5">
                            <span>
                                <TrainBoard moveSequence={moveSequence} openingName={opening} openingLine={variation}/>
                            </span>
                        </div>
                        <div className="text-white col-span-1 lg:w-1/2 w-full text-center text-7xl font-bold flex-col flex">
                            <div className="lg:text-5xl text-2xl pb-3 pt-3 lg:mr-16">
                                {opening}
                            </div>
                            <MoveTable moveSequence={moveSequence} openingLine={variation}/>
                        </div>
                    </main>
                </>
            }
        </PageWrapper>
    )
}

export default LearnPage;