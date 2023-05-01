"use client"
import React from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import PageWrapper from '@/components/wrapper/pageWrapper'
import learn from '../../../public/learn-logo.jpg'
import train from '../../../public/train-logo.jpg'
import Image from 'next/image'

const Dashboard = () => {

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
				<main className="flex flex-row flex columns-2 justify-center align-middle items-center w-full h-1/2">
					<div className="w-1/2 col-span-1 relative justify-center flex mt-5 h-full">
						<div className="w-3/5 border-2 rounded-xl border-zinc-800 flex flex-col items-center pt-14 hover:border-blue-600">
							<Image src={learn} height={window.innerWidth / 8} alt='learn'/>
							<text className="mt-6 italic text-3xl">
								Learn
							</text>
						</div>
						{/* <span>
							Left
						</span> */}
					</div>
					<div className="w-1/2 col-span-1 relative justify-center flex mt-5 h-full">
						<div className="w-3/5 border-2 rounded-xl border-zinc-800 flex flex-col items-center pt-12 hover:border-blue-600">
							<Image src={train} height={window.innerWidth / 7} alt='train'/>
							<text className="mt-4 italic text-3xl">
								Practice
							</text>
						</div>
					</div>
				</main>
			</PageWrapper>
        </div>
    )
}

export default Dashboard