"use client"
import React, { useEffect, useState } from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import PageWrapper from '@/components/wrapper/pageWrapper'
import learn from '../../../public/learn-logo.jpg'
import train from '../../../public/train-logo.jpg'
import Image from 'next/image'
import { auth } from '@/firebase'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
	const router = useRouter()
	const [learnImgW, setLearnImgW] = useState(100)
	const [trainImgW, setTrainImgW] = useState(100)

	useEffect(() => {
        window.addEventListener('resize', ()=> {
            setLearnImgW(window.innerWidth / 8);
			setTrainImgW(window.innerWidth / 7);
        })
		setLearnImgW(window.innerWidth / 8);
		setTrainImgW(window.innerWidth / 7);
    }, []);

	const handleSignOut = () => {
		auth.signOut()
		router.push("/")
	}

	return (
        <div className="h-full">
			<PageWrapper>
				<NavbarComponent />
				<div className="flex justify-center">
					<span className="text-5xl font-bold">Dashboard</span>
				</div>
				<div className="flex justify-center mt-3 mb-6">
					<span className="text-3xl italic">What would you like to do today?</span>
				</div>
				<main className="flex flex-row columns-2 justify-center align-middle items-center w-full h-1/2">
					<div className="w-1/2 col-span-1 relative justify-center flex mt-5 h-full">
						<div className="w-3/5 border-2 rounded-xl border-zinc-800 flex flex-col items-center pt-14 hover:border-blue-600" onClick={() => {router.push("/learn_now")}}>
							<Image src={learn} height={learnImgW} alt='learn'/>
							<text className="mt-6 italic text-3xl">
								Learn
							</text>
						</div>
						{/* <span>
							Left
						</span> */}
					</div>
					<div className="w-1/2 col-span-1 relative justify-center flex mt-5 h-full">
						<div className="w-3/5 border-2 rounded-xl border-zinc-800 flex flex-col items-center pt-12 hover:border-blue-600" onClick={() => {router.push("/train_now")}}>
							<Image src={train} height={trainImgW} alt='train'/>
							<text className="mt-4 italic text-3xl">
								Practice
							</text>
						</div>
					</div>
				</main>
				<div className="flex justify-center mt-3 mb-6">
					<button className="bg-white text-black p-2 rounded-xl border-2 border-black hover:border-blue-600 mr-3" onClick={handleSignOut}>Sign out</button>
					<button className="bg-white text-black p-2 rounded-xl border-2 border-black hover:border-blue-600 ml-3" onClick={() => {router.push("/")}}>Home</button>
				</div>
			</PageWrapper>
        </div>
    )
}

export default Dashboard