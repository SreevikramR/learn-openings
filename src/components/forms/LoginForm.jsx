"use client"
import React, { useState } from 'react'
import { setPersistence, browserSessionPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false) // add loading spinner / animation
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        document.getElementById("errorBox").style.display = "none";
        setLoading(true);
        try {
            await setPersistence(auth, browserSessionPersistence).then(() =>
                signInWithEmailAndPassword(auth, email, password)
            );
            router.push("/dashboard");
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
                case "auth/invalid-password":
                    setErrorMessage("Please enter a valid password");
                    break;
                case "auth/wrong-password":
                    setErrorMessage("Username/password is incorrect");
                    break;
                case "auth/too-many-requests":
                    setErrorMessage("Too many attemps, please try again later");
                    break;
                case "auth/missing-password":
                    setErrorMessage("Please enter a password");
                    break;
                default:
                    setErrorMessage("Code: " + error.code);
                    break;
            }
            console.log(error.message);
            setLoading(false);
        }
    };

    return (
        <>
            <form className="flex flex-col text-2xl w-1/4">
                <div id='errorBox' className="flex place-content-center w-full p-3 bg-red-600 mb-4 text-xl border-2 border-red-600 rounded-md hidden">
                    <text>{errorMessage}</text>
                </div>
                <label className="pb-2">Email</label>
                <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
                /> 
                <label className="pb-2 mt-6">Password</label>
                <input
                    type="password"
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
                />
                <button onClick={handleSubmit} disabled={loading} className="bg-blue-700 border-2 border-blue-700 text-white py-2 px-4 rounded-lg mt-10 hover:border-white disabled:bg-blue-500">Login</button>
            </form>
            <text className="my-2 mt-3 font-semibold" onClick={() => router.push("/")}><span className="left-0 cursor-pointer text-lg">Forgot Password?</span></text>
            <text className="text-lg font-semibold">New User? <span className="text-blue-500 cursor-pointer" onClick={() => router.push("/register")}>Register Here</span></text>
        </>
    )
}

export default LoginForm