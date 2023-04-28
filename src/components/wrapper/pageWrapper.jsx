"use client"
import React from 'react'
import { auth } from '@/firebase'

// Checks if the user is not logged in and does not allow unauthorized access to the page

const PageWrapper = ({ children }) => {
	if (auth.currentUser == null) {
		console.log("not logged in")
		return (
			<>
				<div>Not Logged In</div>
			</>
		)
	} else {
		return (
			<>
				{children}
			</>
		)
	}

}

export default PageWrapper