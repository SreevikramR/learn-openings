"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { auth } from '@/firebase'
import { getName, getUsername } from '@/app/api/firebaseAccess'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { signUserOut } from '@/app/api/firebaseAccess'
import { useChessboard } from '@/context/BoardContext'
import { useSearchParams } from 'next/navigation'

const NavbarComponent = ({ fixed }) => {
	const { setIsBoardLoaded } = useChessboard();
	const router = useRouter()
	const [name, setName] = useState('')
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [navbarOpen, setNavbarOpen] = useState(false)
	const [titleLink, setTitleLike] = useState("/")
	let stateChanging = false;

	const searchParams = useSearchParams()
	const param = searchParams.get('demo')

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if(stateChanging) return;
			stateChanging = true;
			if (user) {
				setTitleLike("/dashboard")
				getUsername().then((username) => {
                    if (username === undefined) {
                        router.push("/onboarding")
                    } else {
						setIsLoggedIn(true)
						setFirstName()
					}
                })
			} else if (param === "true") {
				setIsLoggedIn(true)
				setTitleLike("/")
				setName("GM Guest")
			}
			stateChanging = false;
		});

		const url = window.location.pathname;

		if(url !== "/try_now" || url !== "/train" || url !== "/learn" || url.includes("/user/")) {
			setIsBoardLoaded(false);
		}
	}, [])

	const handleSignOut = async () => {
		await signUserOut()
		router.push("/")
	}

	const navbar = () => {
		return (
			<>
				<nav className="relative flex flex-wrap items-center justify-between px-2 py-2 mb-4 border-b-2 border-b-zinc-800">
					<div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
						<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
							<button className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button" onClick={() => setNavbarOpen(!navbarOpen)}>
								<i className="fas fa-bars"></i>
							</button>
							<a className="text-base lg:text-4xl font-semibold leading-relaxed hidden lg:inline-block mr-4 py-2 whitespace-nowrap text-white" href={titleLink}>
								Openings 101
							</a>
							<a className={"text-xl font-semibold leading-relaxed lg:hidden inline-block mr-4 py-2 whitespace-nowrap text-white" + (isLoggedIn ? " hidden" : " inline-block")} href="/login">
								Login
							</a>
							<a className={"text-xl font-semibold leading-relaxed lg:hidden mr-4 py-2 whitespace-nowrap text-white" + (isLoggedIn ? " inline-block" : " hidden")} href="/profile">
								Hi {name}
							</a>
						</div>

						<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous"/>

						<div className={"lg:" + (isLoggedIn ? "hidden" : "block") +  " flex-grow items-center" + (navbarOpen ? " flex" : " hidden")} id="example-navbar-danger">
							<ul className="flex flex-col lg:flex-row list-none lg:ml-auto justify-end">
								<li className={"nav-item" + (isLoggedIn ? " hidden" : " flex")}>
									<a className="px-3 py-2 flex items-center text-xl font-semibold italic leading-snug text-white hover:opacity-75 lg:border-l-2 lg:border-l-zinc-800" href="/login">
										<span className='mx-1'>Login</span>
									</a>
								</li>
								<li className={"nav-item" + (isLoggedIn ? " hidden" : " flex")}>
									<a className="px-3 py-2 flex items-center text-xl font-semibold italic leading-snug text-white hover:opacity-75 lg:border-l-2 lg:border-l-zinc-800" href="/register">
										<span className="mx-1">Register</span>
									</a>
								</li>
								<li className={"nav-item py-3 lg:py-0" + (isLoggedIn ? " hidden" : " flex")}>
									<Link href="/try_now">
										<span className='lg:inline-flex lg:w-auto px-1 lg:m-0 py-2 w-full lg:px-3 lg:py-2 rounded-xl border-2 border-blue-700 text-white font-bold items-center justify-center hover:border-white hover:text-white text-xl hover:cursor-pointer bg-blue-600'>
											<span className='mx-1'>
												Try Now!
											</span>
										</span>
									</Link>
								</li>

								<li className={"nav-item" + (!isLoggedIn ? " hidden" : " flex")}>
									<Link href="/dashboard">
										<span className="mx-1 px-3 py-2 flex items-center text-xl font-semibold italic leading-snug text-white hover:opacity-75 lg:border-l-2 lg:border-l-zinc-800">Dashboard</span>
									</Link>
								</li>
								<li className={"nav-item" + (!isLoggedIn ? " hidden" : " block")} onClick={handleSignOut}>
									<span className="mx-1 px-3 py-2 flex items-center text-xl font-semibold italic leading-snug text-white hover:opacity-75 lg:border-l-2 lg:border-l-zinc-800">Sign Out</span>
								</li>
							</ul>
						</div>

						<div className={"lg:" + (isLoggedIn ? "block" : "hidden") + " flex-grow items-center hidden"} id="example-navbar-danger">
							<ul className="flex flex-col lg:flex-row list-none lg:ml-auto justify-end">
								<li className="nav-item">
									<Link href="/profile">
										<span className="mx-1 px-3 py-2 flex items-center align-middle text-xl font-semibold italic leading-snug text-white pointer-none">Hi {name}</span>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</>
		)
	}

	async function setFirstName() {
		const name = await getName()
		if(name === undefined) {
			setIsLoggedIn(false)
		}
		setName(name)
	}

	return navbar();

}
  
  export default NavbarComponent