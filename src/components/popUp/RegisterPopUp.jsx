"use client"
import React, { useState } from "react";
import RegisterForm from "../forms/RegisterForm";
import { useChessboard } from "@/context/BoardContext";
import { useSearchParams } from "next/navigation";

const RegisterPopUp = () => {
    const { setOpeningComplete, openingComplete } = useChessboard()
    const searchParams = useSearchParams()
    const isDemo = searchParams.get('demo')

    return (
        <div className={(isDemo ? "flex" : "hidden")}>
            <div className={"w-full transition-all ease-in-out duration-1000 h-full fixed inset-0 bg-[rgba(48,48,48,0.5)] flex-col items-center justify-center z-10" + (openingComplete ? " flex" : " hidden")}>
                <div className="w-3/4 md:w-3/5 xl:w-2/5 px-7 py-7 pt-3 text-center bg-black shadow-xl rounded">
                    <h2 className="my-2 pb-2 text-2xl lg:text-4xl font-semibold">Register</h2>

                    <RegisterForm />

                    <p className="my-2 text-lg">Create a FREE Account to save progress and access all the openings and variations!</p>
                    
                </div>
                <div className="fixed top-10 right-10 text-white cursor-pointer z-10" onClick={() => setOpeningComplete(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                    className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default RegisterPopUp;