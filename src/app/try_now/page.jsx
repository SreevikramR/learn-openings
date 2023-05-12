"use client"
import { useChessboard } from "@/context/BoardContext"
import { getMoveSequence, readOpening, setFirstLine, getLines } from "../api/firebaseAccess"
import React, { useEffect } from "react"
import NavbarComponent from "@/components/navbar/Navbar"
import TrainBoard from "@/components/chessboard/TrainBoard"
import MoveTable from "@/components/moveTable/MoveTable"
import LearnBoard from "@/components/chessboard/LearnBoard"

function TrialPage() {
    const {setMoveHistory, setPlayerColor, setOpeningLine, openingName, setOpeningName, setMoveSequence, setLineVariations} = useChessboard();

    return(
        <>
            <NavbarComponent />
            <main className="flex-row flex columns-2 justify-center align-middle items-center w-full">
                <div className="w-1/2 col-span-1 relative justify-center flex mt-5">
                    <span>
                        <LearnBoard />
                    </span>
                </div>
                <div className="text-white col-span-1 w-1/2 text-center text-7xl font-bold flex-row">
                    <div className="text-5xl pb-3 mr-16">
                        {openingName}
                    </div>
                    <MoveTable />
                </div>
		    </main>
        </>
    )
}

export default TrialPage