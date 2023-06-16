"use client"
import { useChessboard } from "@/context/BoardContext"
import React, { useEffect, useState } from "react"
import NavbarComponent from "@/components/navbar/Navbar"
import MoveTable from "@/components/moveTable/MoveTable"
import LearnBoard from "@/components/chessboard/LearnBoard"
import RegisterForm from "@/components/forms/RegisterForm"
import { getMoveSequence, setFirstLine } from "../api/firebaseAccess"

const openingName = "Ruy Lopez"

function TrialPage() {
    const {openingComplete, setPlayerColor} = useChessboard();
    const [showRegister, setShowRegister] = useState(false)
    const [moveSequence, setMoveSequence] = useState([])
    const [openingLine, setOpeningLine] = useState("")
    const [isDataLoaded, setIsDataLoaded] = useState(false)

    useEffect(() => {
        if(openingComplete) {
            setShowRegister(true)
        }
    }, [openingComplete])

    useEffect(() => {
        initPageData()
    }, [])

    async function initPageData() {
        await setPlayerColor("white")
        let line = await setFirstLine(openingName)
        setOpeningLine(line)
        let sequence = await getMoveSequence(openingName, line)
        setMoveSequence(sequence)
        setIsDataLoaded(true)
    }

    return(
        <>
            <NavbarComponent />
            {isDataLoaded && 
                <>
                    <div className="m-5 mb-2 bg-zinc-800 py-1 px-3 rounded-md block lg:hidden text-lg italic text-center">
                        Create an account to access more openings and variations!
                    </div>
                    <main className="lg:flex-row flex-col flex lg:columns-2 justify-center align-middle items-center w-full">
                        <div className="w-1/2 col-span-1 relative justify-center flex mt-5">
                            <span>
                                <LearnBoard moveSequence={moveSequence} openingName={openingName} openingLine={openingLine}/>
                            </span>
                        </div>
                        <div className="text-white col-span-1 lg:w-1/2 w-full text-center text-7xl font-bold flex-col flex">
                            <div className="lg:text-5xl text-2xl pb-3 pt-3 lg:mr-16">
                                {openingName}
                            </div>
                            <MoveTable openingLine={openingLine} moveSequence={moveSequence}/>
                        </div>
                    </main>
                    <div className="mt-5 text-3xl italic text-center hidden lg:block">
                        Create a FREE account to access all the openings and variations!
                    </div>

                    <div className={"w-full transition-all ease-in-out duration-1000 h-full fixed inset-0 bg-[rgba(48,48,48,0.5)] flex-col items-center justify-center z-10" + (showRegister ? " flex" : " hidden")}>
                        <div className="w-3/4 md:w-3/5 xl:w-2/5 px-7 py-7 pt-3 text-center bg-black shadow-xl rounded">
                            <h2 className="my-2 pb-2 text-2xl lg:text-4xl font-semibold">Register</h2>

                            <RegisterForm />

                            <p className="my-2 text-lg">Create a FREE Account to gain access to all the openings and variations!</p>
                            
                        </div>
                        <div className="fixed top-10 right-10 text-white cursor-pointer z-10" onClick={() => setShowRegister(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                            className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default TrialPage