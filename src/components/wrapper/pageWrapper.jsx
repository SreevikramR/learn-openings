"use client"
import React, { useState } from 'react'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Checks if the user is not logged in and does not allow unauthorized access to the page

const PageWrapper = ({ children }) => {
	const [isloggedIn, setIsLoggedIn] = useState(false)

	onAuthStateChanged(auth, (user) => {
		if (user) {
			console.log(user)
			setIsLoggedIn(true)
		}
	});

	if (isloggedIn) {
		return (
			<>
				{children}
			</>
		)
	} else {
		return (
			<>
				<div>Not Logged In</div>
			</>
		)
	}

}

export default PageWrapper