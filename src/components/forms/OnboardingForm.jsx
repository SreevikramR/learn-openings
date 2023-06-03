"use client"
import React, { useState, useEffect } from 'react'
import { checkUsernameExists, createUser, getUsername } from '@/app/api/firebaseAccess'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'

const OnboardingForm = () => {
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [errorBox, setErrorBox] = useState(false)
    const router = useRouter()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
			if (user) {
				getUsername().then((username) => {
                    if (username !== undefined) {
                        router.push("/dashboard")
                    }
                })
			} else {
				router.push("/login")
			}
		});
    }, [])

    async function handleSubmit() {
        setLoading(true)
        setErrorBox(false)
        checkUsernameExists(username).then((exists) => {
            if (exists) {
                setErrorMessage("Username already exists")
                setErrorBox(true)
                setLoading(false)
            } else {
                setLoading(true)
                createUser(username).then(() => {
                    router.push("/dashboard")
                })
            }
        })
    }

    return (
        <>
            <div id='errorBox' className={"place-content-center text-center w-1/2 lg:w-1/4 p-3 bg-red-600 mb-4 text-xl border-2 border-red-600 rounded-md" + (errorBox ? " flex" : " hidden")}>
                <span>{errorMessage}</span>
            </div>
            <input
                type="name"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-b-white focus:outline-none pb-2 w-1/2 lg:w-1/6 text-xl"
            />
            <button onClick={() => {handleSubmit()}} disabled={loading} className="bg-blue-700 border-2 w-1/2 lg:w-1/6 border-blue-700 text-white py-1 px-4 rounded-lg mt-5 mb-3 hover:border-white disabled:bg-blue-500 text-lg">Continue</button>
        </>
    )
}

export default OnboardingForm