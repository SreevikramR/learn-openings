"use client"
import React, { useState } from 'react'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await setPersistence(auth, browserSessionPersistence).then(() =>
                signInWithEmailAndPassword(auth, email, password)
            );
            navigate("/dashboard");
        } catch (error) {
            document.getElementById("errorBox").style.display = "block";
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
                default:
                    setErrorMessage("Code: " + error.code);
                    break;
            }
            console.log(error.message);
        }
    };

    return (
        <form className="flex flex-col text-2xl w-1/4">
            <label className="pb-2">Email</label>
            <input
                type="email"
                placeholder="name@mail.com"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
            /> 
            <label className="pb-2 mt-6">Password</label>
            <input
                type="password"
                placeholder="**********"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
            />
            <button onClick={handleSubmit} className="bg-blue-700 border-2 border-blue-700 text-white py-2 px-4 rounded-lg mt-10 hover:border-white">Login</button>
        </form>
    )
}

export default LoginForm