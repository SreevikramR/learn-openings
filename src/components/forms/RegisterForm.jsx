"use client"
import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import Image from 'next/image';
import googleImg from '../../../public/google.png';
import gitHubImg from '../../../public/GitHub.png';

const RegisterForm = () => {
    const router = useRouter()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                if(window.location.pathname === "/register") {
                    router.push("/dashboard")
                }
            } else {
                localStorage.removeItem("username");
                localStorage.removeItem("name");
            }
        })
    }, [])

    const googleProvider = new GoogleAuthProvider();
    function googleSignInPopup() {
        signInWithPopup(auth, googleProvider)
        .then(() => {
            router.push("/onboarding")
        }).catch((error) => {
            errorHandler(error.code);
        });
    }

    const githubProvider = new GithubAuthProvider();
    function gitHubSignInPopup() {
        signInWithPopup(auth, githubProvider)
        .then((result) => {
            router.push("/onboarding")
        }).catch((error) => {
            errorHandler(error.code);          
        });
    }

    function errorHandler(errorCode) {
        console.log(errorCode);
    }

    return (
        <>
            <div className="flex flex-row justify-center items-center text-xl" onClick={() => googleSignInPopup()}>
                <div className='p-3 rounded-lg cursor-pointer border-2 flex justify-center items-center'>
                    <Image src={googleImg} alt='Google' width={35} height="auto" className='mr-3'/>
                    Continue with Google
                </div>
            </div>

            <div className="flex flex-row justify-center items-center text-xl mt-5" onClick={() => gitHubSignInPopup()}>
                <div className='p-3 rounded-lg cursor-pointer border-2 flex justify-center items-center'>
                    <Image src={gitHubImg} alt='GitHub' width={35} height="auto" className='mr-3'/>
                    Continue with GitHub
                </div>
            </div>

            <div className="mb-5 font-semibold text-lg mt-5">Have an Account?<span className="text-blue-500 cursor-pointer" onClick={() => router.push("/login")}> Login</span></div>
        </>
    )
}

export default RegisterForm