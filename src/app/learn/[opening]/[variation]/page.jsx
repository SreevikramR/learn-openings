"use client"
import React, { useEffect, useState } from "react";
import { parseFromURL, getMoveSequence } from "@/app/api/firebaseAccess";
import { useChessboard } from "@/context/BoardContext";
import PageWrapper from "@/components/wrapper/pageWrapper";
import NavbarComponent from "@/components/navbar/Navbar";
import LearnBoard from "@/components/chessboard/LearnBoard";
import MoveTable from "@/components/moveTable/MoveTable";
import RegisterPopUp from "@/components/popUp/RegisterPopUp";
import { useSearchParams } from 'next/navigation'

const LearnPage = ({ params }) => {
    const { setPlayerColor, setMoveHistory, setOpeningComplete, openingComplete } = useChessboard();

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [opening, setOpening] = useState(params.opening);
    const [variation, setVariation] = useState(params.variation);
    const [moveSequence, setMoveSequence] = useState([]);
    const [isDemoUser, setIsDemoUser] = useState(false);

    const searchParams = useSearchParams()

    useEffect(() => {
        initData();
    }, [])

    async function initData() {
        const openingName = await parseFromURL(opening);
        const variationName = await parseFromURL(variation);
        console.log("Opening name: ", openingName)
        console.log("Variation name: ", variationName)
        setOpening(openingName);
        setVariation(variationName);
        let tempMoveSequence = await getMoveSequence(openingName, variationName);
        console.log(tempMoveSequence)
        setMoveSequence(tempMoveSequence);
        await setPlayerColor("white")
        await setMoveHistory([]);
        await setOpeningComplete(false);
        const param = searchParams.get('demo')
        setIsDemoUser(param === "true")
        setIsDataLoaded(true);
    }

    return (
        <PageWrapper>
            <NavbarComponent />
            {isDataLoaded &&
                <> 
                    <main>
                        <div className="lg:flex-row flex-col flex lg:columns-2 justify-center align-middle items-center w-full">
                            <div className="w-1/2 col-span-1 relative justify-center flex mt-5">
                                <span>
                                    <LearnBoard moveSequence={moveSequence} openingName={opening} openingLine={variation}/>
                                </span>
                            </div>
                            <div className="text-white col-span-1 lg:w-1/2 w-full text-center text-7xl font-bold flex-col flex">
                                <div className="lg:text-5xl text-2xl pb-3 pt-3 lg:mr-16">
                                    {opening}
                                </div>
                                <MoveTable moveSequence={moveSequence} openingLine={variation}/>
                            </div>
                        </div>
                        {isDemoUser &&
                            <RegisterPopUp />
                        }
                    </main>
                </>
            }
        </PageWrapper>
    )
}

export default LearnPage;