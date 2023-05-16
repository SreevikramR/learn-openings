"use client"
import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase'
import Link from 'next/link'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            console.log("password reset email sent");
            document.getElementById("errorBox").style.backgroundColor = "green";
            document.getElementById("errorBox").style.border = "2px solid green";
            setErrorMessage("Reset Email sent!");
            document.getElementById("errorBox").style.display = "flex";
            setLoading(false);
        } catch (error) {
            document.getElementById("errorBox").style.display = "flex";
            switch (error.code) {
                case "auth/user-not-found":
                    setErrorMessage("No Account found, try making one!");
                    break;
                case "auth/internal-error":
                    setErrorMessage("Server Error: Please try again later");
                    break;
                case "auth/invalid-email":
                    setErrorMessage("Please enter a valid email");
                    break;
                case "auth/missing-email":
                    setErrorMessage("Please enter a valid email");
                    break;
                case "auth/wrong-password":
                    setErrorMessage("Username/password is incorrect");
                    break;
                case "auth/too-many-requests":
                    setErrorMessage("Too many attemps, please try again later");
                    break;
                default:
                    setErrorMessage("Code: " + error.code);
                    break;
            }
            setLoading(false);
            console.log(error.message);
        }
    };
    

    return (
        <>
            <form className="flex flex-col lg:text-2xl text-xl lg:w-1/4 w-1/2">
                <div id='errorBox' className="place-content-center w-full p-3 bg-red-600 mb-4 text-xl border-2 border-red-600 rounded-md hidden">
                    <div>{errorMessage}</div>
                </div>
                <label className="pb-2">Email</label>
                <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
                />
                <button onClick={handleSubmit} disabled={loading} className="bg-blue-700 border-2 border-blue-700 text-white py-2 px-4 rounded-lg mt-10 hover:border-white disabled:bg-blue-500">Reset Password</button>
                <Link href="/login" className="my-2 mt-5 p-1 pt-0 font-semibold text-center w-fit px-3 self-center border-2 border-white rounded-xl">
                    <button><span className="left-0 cursor-pointer text-lg">Back to Login</span></button>
                </Link>
            </form>
        </>
    )
}

export default ForgotPassword