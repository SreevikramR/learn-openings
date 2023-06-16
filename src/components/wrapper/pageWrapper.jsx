"use client"
import React, { useEffect, useState } from 'react'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import NavbarComponent from '@/components/navbar/Navbar'

const PageWrapper = ({ children }) => {
	const [isloggedIn, setIsLoggedIn] = useState(false)
	const router = useRouter()

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setIsLoggedIn(true)
			} else {
				router.push("/login")
			}
		});
	}, [])

	if (isloggedIn) {
		return (
			<>
				{children}
			</>
		)
	} else {
		return (
			<>
				<NavbarComponent />
			</>
		)
	}

}

export default PageWrapper