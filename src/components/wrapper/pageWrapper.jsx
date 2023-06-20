"use client"
import React, { useEffect, useState } from 'react'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import NavbarComponent from '@/components/navbar/Navbar'
import { useSearchParams } from 'next/navigation'

const PageWrapper = ({ children }) => {
	const [isloggedIn, setIsLoggedIn] = useState(false)
	const router = useRouter()

	const searchParams = useSearchParams()
  	const param = searchParams.get('demo')

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user || param === "true") {
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