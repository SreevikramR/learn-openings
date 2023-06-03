"use client"
import React, { useEffect, useState } from 'react'
import { setPersistence, browserSessionPersistence, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { getUsername } from '@/app/api/firebaseAccess'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import googleImg from '../../../public/google.png';
import gitHubImg from '../../../public/GitHub.png';

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [errorBox, setErrorBox] = useState(false)
    const [loading, setLoading] = useState(false) // add loading spinner / animation
    const router = useRouter()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                router.push("/dashboard")
            } else {
                localStorage.removeItem("username");
                localStorage.removeItem("name");
            }
        })
    }, [])

    async function googleSignInPopup() {
        const googleProvider = new GoogleAuthProvider();
        setPersistence(auth, browserSessionPersistence).then(() => {
            signInWithPopup(auth, googleProvider).then(() => {
                handleLogin("Google");
            }).catch((error) => {
                errorHandler(error.code);
            });
        })
    }

    async function gitHubSignInPopup() {
        const githubProvider = new GithubAuthProvider();
        setPersistence(auth, browserSessionPersistence).then(() => {
            signInWithPopup(auth, githubProvider).then(() => {
                handleLogin("GitHub");
            }).catch((error) => {
                errorHandler(error.code);          
            });
        });
    }

    async function handleLogin(provider) {
        getUsername().then((username) => {
            if(username === undefined) {
                router.push("/onboarding")
            } else {
                router.push("/dashboard")
            }
        })
        //umami.track("Logged In: " + provider)
    }

    function errorHandler(errorCode) {
        if(errorCode === 'auth/account-exists-with-different-credential') {
            setErrorBox(true)
            setErrorMessage("Try logging in with a different method.")
        } else if(errorCode === 'auth/cancelled-popup-request') {
            return;
        } else if(errorCode === 'auth/popup-closed-by-user') {
            return;
        } else if(errorCode === 'Undefined'){
            return;
        } else {
            setErrorBox(true)
            setErrorMessage("Error: " + errorCode + ". Please contact support at sreevikram.r@gmail.com")
        }
        console.log(errorCode);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        document.getElementById("errorBox").style.display = "none";
        setLoading(true);
        try {
            await setPersistence(auth, browserSessionPersistence).then(() =>
                signInWithEmailAndPassword(auth, email, password)
            );
            umami.track('User Logged In')
            router.push("/dashboard");
        } catch (error) {
            setErrorBox(true)
            setErrorMessage(error.message)
            console.log(error.message);
            setLoading(false);
        }
    };

    return (
        <>
            <div className='w-1/2 lg:w-1/4 mb-3'>
                <div className={"place-content-center w-full p-3 bg-red-600 mb-4 text-xl border-2 border-red-600 rounded-md text-center" + (errorBox ? " flex" : " hidden")}>
                    <span id='errorBoxMessage'>{errorMessage}</span>
                </div>
            </div>
            
            <div className="flex flex-row justify-center items-center text-xl" onClick={() => googleSignInPopup()}>
                <div className='p-3 rounded-lg cursor-pointer border-2 flex justify-center items-center'>
                    <Image src={googleImg} width={35} height={35} className='mr-3'/>
                    Login with Google
                </div>
            </div>

            <div className="flex flex-row justify-center items-center text-xl mt-5" onClick={() => gitHubSignInPopup()}>
                <div className='p-3 rounded-lg cursor-pointer border-2 flex justify-center items-center'>
                    <Image src={gitHubImg} width={35} height={35} className='mr-3'/>
                    Login with GitHub
                </div>
            </div>

            <div className="lg:text-lg text-base font-semibold mt-5">New User? <span className="text-blue-500 cursor-pointer" onClick={() => router.push("/register")}>Register Here</span></div>
        </>
    )
}

export default LoginForm