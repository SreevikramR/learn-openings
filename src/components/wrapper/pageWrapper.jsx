import React, { useEffect, useState } from 'react'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import NavbarComponent from '@/components/navbar/Navbar'

// Checks if the user is not logged in and does not allow unauthorized access to the page

const PageWrapper = ({ children }) => {
	const [isloggedIn, setIsLoggedIn] = useState(false)
	const router = useRouter()

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log(user)
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