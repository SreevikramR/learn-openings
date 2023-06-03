/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect, useState } from 'react'
import modalStyles from "./PopUp.module.css"
import { useChessboard } from '@/context/BoardContext'
import { useRouter } from 'next/navigation'
import { getOpeningsData } from '@/app/api/firebaseAccess'

const PopUp = () => {
	const router = useRouter()
	const { openingName, popUpType, setMode } = useChessboard()

	const [popUpLink, setPopUpLink] = useState("/dashboard")
	const [openingText, setOpeningText] = useState()

	let fullDescription = [];
	
	useEffect(() => {
		if(popUpType == "learn") {
			setPopUpLink("/learn")
			setMode("learn")
		} else if(popUpType == "train") {
			setPopUpLink("/train")
			setMode("train")
		}
	}, [popUpType])

	useEffect(() => {
		setDescriptionsFunc();
	}, [openingName])

	const _openingText = () => {
		return(
			<div className='text-center'>
				{openingText}
			</div>
		)
	}

	async function setDescriptionsFunc() {
		let openingsData = await getOpeningsData()
		let descriptions = openingsData[openingName].Description
		fullDescription = [];
		for(let i = 0; i < descriptions.length; i++) {
			let paragraph = (
				<p className='p-1 pt-3 text-xs lg:text-base font-thin'>
					{descriptions[i]}
				</p>
			)
			fullDescription.push(paragraph)
		}
		setOpeningText(fullDescription)
	}

	return(
		<div className={modalStyles.modal} id='modal'>
			<div className={modalStyles.modalContent}>
				<div className={modalStyles.modalHeader}>
					<h2 className="text-2xl font-semibold">{openingName}</h2>
					<span id='close' className={modalStyles.close}>&times;</span>
				</div>
				<div className={modalStyles.modalBoday}>
					<_openingText />
					<div className="flex justify-center">
						<button className="bg-blue-600 mt-2 p-2 mb-4 rounded-lg" onClick={() => {router.push(popUpLink)}}>Start Now</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PopUp