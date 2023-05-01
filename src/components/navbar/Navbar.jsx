"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { auth } from '@/firebase'
import { getfName } from '@/app/api/firebaseAccess'
import { onAuthStateChanged } from 'firebase/auth'

const NavbarComponent = () => {
	const [name, setName] = useState('')
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	let stateChanging = false;

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			console.log("auth triggered")
			if(stateChanging) return;
			stateChanging = true;
			if (user) {
				console.log("logged in")
				setIsLoggedIn(true)
				setFirstName()
			} else {
				console.log("not logged in")
			}
			stateChanging = false;
		});
	}, [])


	const notLoggedIn = () => {
		return (
			<div className='hidden w-full lg:inline-flex lg:flex-grow lg:w-auto'>
				<div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto text-white'>
					<Link href="/login">
						<span className='lg:inline-flex lg:w-auto w-full pl-3 py-2 rounded border-2 border-l-zinc-900 border-black text-white items-center justify-center text-xl font-semibold italic'>
							Login
						</span>
					</Link>
					<Link href="/register">
						<span className='lg:inline-flex lg:w-auto w-full px-3 py-2 mx-2 rounded border-2 border-l-zinc-900 border-black items-center justify-center text-xl font-semibold italic text-white'>
							Register
						</span>
					</Link>
					<span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded-xl border-2 border-blue-700 text-white font-bold items-center justify-center hover:border-white hover:text-white text-xl hover:cursor-pointer bg-blue-600'>
					Try Now!
					</span>
				</div>
			</div>
		)
	}

	const loggedIn = () => {
		return (
			<div className='hidden w-full lg:inline-flex lg:flex-grow lg:w-auto'>
				<div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto text-white'>
					<Link href="/dashboard">
						<span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded border-2 border-l-zinc-900 border-black text-white items-center justify-center text-xl font-semibold italic'>
							Hi {name}
						</span>
					</Link>
					<Link href="/dashboard">
						<span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded-xl border-2 border-blue-700 text-white font-bold items-center justify-center hover:border-white hover:text-white text-xl hover:cursor-pointer bg-blue-600'>
							Dashboard
						</span>
					</Link>
				</div>
			</div>
		)
	}

	const RightSide = () => {
		if (isLoggedIn) {
			return loggedIn();
		} else {
			return notLoggedIn();
		}
	}

	const navbar = () => {
		return (
			<>
				<nav className='flex items-center flex-wrap bg-black p-3 pt-2 border-b-2 mb-4 border-b-zinc-900'>
					<Link href='/'>
						<span className='sm:text-m lg:text-4xl text-white font-semibold tracking-wide'>
							Chess Openings
						</span>
					</Link>
					<RightSide />
				</nav>
			</>
		)
	}

	async function setFirstName() {
		const name = await getfName()
		setName(name)
	}

	return navbar();

}
  
  export default NavbarComponent