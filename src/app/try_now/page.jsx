"use client"
import { useChessboard } from "@/context/BoardContext"
import { getMoveSequence, readOpening, setFirstLine } from "../api/firebaseAccess"
import React, { useEffect } from "react"
import NavbarComponent from "@/components/navbar/Navbar"
import BoardComponent from "@/components/chessboard/BoardComponent"
import MoveTable from "@/components/moveTable/MoveTable"

function TrialPage() {
    const {setMoveHistory, openingLine, setOpeningLine, openingName, setOpeningName, setMoveSequence, moveSequence} = useChessboard();
    
    useEffect(() => {
        initPage();
    }, [])
    
    async function initPage() {
        await setOpeningName('Ruy Lopez')
        await readOpening(openingName);
        const line = await setFirstLine()
        await setOpeningLine(line)
        const sequence = await getMoveSequence(line)
        await setMoveSequence(sequence);
        setMoveHistory([]);

    }

    return(
        <>
            <NavbarComponent />
            <main className="flex-row flex columns-2 justify-center align-middle items-center w-full">
			<div className="w-1/2 col-span-1 relative justify-center flex mt-5">
				<span>
				    <BoardComponent />
				</span>
			</div>
			<div className="text-white col-span-1 w-1/2 text-center text-7xl font-bold flex-row">   
                <MoveTable />
            </div>
		</main>
        </>
    )
}

export default TrialPage