import NavbarComponent from "@/components/navbar/Navbar"
import React from "react"

export default function Login() {
    return(
        <>
            <NavbarComponent />
            <main className="flex-row flex columns-2 justify-center align-middle items-center w-full">
                <div className="text-white text-4xl font-semibold">Login Screen</div>
            </main>
        </>
    )
}