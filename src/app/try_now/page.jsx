"use client"
import { useChessboard } from "@/context/BoardContext"
import React, { useEffect } from "react"
import NavbarComponent from "@/components/navbar/Navbar"
import MoveTable from "@/components/moveTable/MoveTable"
import LearnBoard from "@/components/chessboard/LearnBoard"

function TrialPage() {
    const {openingName, openingLine} = useChessboard();

    useEffect(() => {
        if(openingLine === "") {
            window.location.href = "/"
        }
    }, [])

    return(
        <>
            <NavbarComponent />
            <main className="lg:flex-row flex-col flex lg:columns-2 justify-center align-middle items-center w-full">
                <div className="w-1/2 col-span-1 relative justify-center flex mt-5">
                    <span>
                        <LearnBoard />
                    </span>
                </div>
                <div className="text-white col-span-1 lg:w-1/2 w-full text-center text-7xl font-bold flex-col flex">
                    <div className="lg:text-5xl text-2xl pb-3 pt-3 lg:mr-16">
                        {openingName}
                    </div>
                    <MoveTable />
                </div>
            </main>
        </>
    )
}

export default TrialPage