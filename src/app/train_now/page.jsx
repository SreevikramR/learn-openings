"use client"
import NavbarComponent from '@/components/navbar/Navbar'
import React from 'react'

const TrainPick = () => {
	return (
		<>
			<NavbarComponent/>
			<div className="flex justify-center">
				<span className="text-4xl font-bold">Pick Opening to Train</span>
			</div>
		</>
	)
}

export default TrainPick