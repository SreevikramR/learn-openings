"use client"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { checkUsernameExists, createUser } from '@/app/api/firebaseAccess';

const RegisterForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [fName, setFName] = useState("")
    const [lName, setLName] = useState("")
    const [username, setUsername] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        document.getElementById("errorBox").style.display = "none";
        setLoading(true);
        e.preventDefault();
        if (password !== passwordConfirm) {
            document.getElementById("errorBox").style.display = "flex";
            setErrorMessage("Passwords don't match");
            setLoading(false);
        } else if (fName === "") {
            document.getElementById("errorBox").style.display = "flex";
            setErrorMessage("Please enter a valid name");
            setLoading(false);
        } else if (lName === "") {
            document.getElementById("errorBox").style.display = "flex";
            setErrorMessage("Please enter a valid name");
            setLoading(false);
        } else if (username === "") {
            document.getElementById("errorBox").style.display = "flex";
            setErrorMessage("Please enter a valid username");
            setLoading(false);
        } else if (password === "") {
            document.getElementById("errorBox").style.display = "flex";
            setErrorMessage("Please enter a password");
            setLoading(false);
        } else {
            const doesExist = await checkUsernameExists(username);
            if (doesExist) {
                document.getElementById("errorBox").style.display = "flex";
                setErrorMessage("Username already exists");
                setLoading(false);
            } else {
                try {
                    await setPersistence(auth, browserSessionPersistence).then(() =>
                        createUserWithEmailAndPassword(auth, email, password)
                    );
                    console.log("user: " + auth.currentUser);
                    await createUser(fName, lName, username);
                    router.push("/dashboard");
                } catch (error) {
                    document.getElementById("errorBox").style.display = "flex";
                    switch (error.code) {
                        case "auth/email-already-exists":
                            setErrorMessage("Account with Email already exists");
                            break;
                        case "auth/missing-email":
                            setErrorMessage("Please enter an email");
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
                        case "auth/weak-password":
                            setErrorMessage("Please enter a longer password");
                            break;
                        case "auth/missing-password":
                            setErrorMessage("Please enter a password");
                            break;
                        default:
                            setErrorMessage("Error code: " + error.code);
                            break;
                    }
                    setLoading(false);
                    console.log(error);
                }
            }
        }
    };

    return (
        <>
            <form className="flex flex-col text-2xl w-1/4">
                <div id='errorBox' className="place-content-center w-full p-3 bg-red-600 mb-4 text-xl border-2 border-red-600 rounded-md hidden">
                    <div>{errorMessage}</div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col w-1/2 pr-2">
                        <label className="pb-2 mt-2">First Name</label>
                        <input
                            type="Name"
                            placeholder="First"
                            value={fName}
                            onChange={(e) => setFName(e.target.value)}
                            className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
                        />
                    </div>
                    <div className="flex flex-col w-1/2 pl-2">
                        <label className="pb-2 mt-2">Last Name</label>
                        <input
                            type="name"
                            placeholder="Last"
                            value={lName}
                            onChange={(e) => setLName(e.target.value)}
                            className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
                        />
                    </div>
                </div>
                <label className="pb-2 mt-6">Username</label>
                <input
                    type="name"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
                />
                <label className="pb-2 mt-6">Email</label>
                <input
                    type="email"
                    placeholder="name@mail.com"
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
                <label className="pb-2 mt-6">Confirm Password</label>
                <input
                    type="password"
                    placeholder="**********"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2"
                />
                <button onClick={handleSubmit} disabled={loading} className="bg-blue-700 border-2 border-blue-700 text-white py-2 px-4 rounded-lg mt-10 mb-3 hover:border-white disabled:bg-blue-500">Register</button>
            </form>
            <div className="mb-5 font-semibold text-lg">Have an Account?<span className="text-blue-500 cursor-pointer" onClick={() => router.push("/login")}> Login</span></div>
        </>
    )
}

export default RegisterForm