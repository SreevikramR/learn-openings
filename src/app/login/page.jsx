import NavbarComponent from "@/components/navbar/Navbar"
import React from "react"
import LoginForm from "@/components/forms/LoginForm"

export default function Login() {

    return(
        <>
            <NavbarComponent />
            <main className="flex flex-col columns-1 justify-center align-middle items-center w-full">
                <div className="text-white lg:text-4xl text-3xl font-semibold mb-3">Login</div>
                <LoginForm />
            </main>
        </>
    )
}