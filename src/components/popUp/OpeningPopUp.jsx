/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect, useState } from 'react'
import modalStyles from "./PopUp.module.css"
import { useChessboard } from '@/context/BoardContext'
import { useRouter } from 'next/navigation'
import { getAllOpeningsMetaData, stringToURL } from '@/app/api/firebaseAccess'
import { useSearchParams } from 'next/navigation'

const PopUp = ({ openingClicked, popUpType }) => {
	const router = useRouter()
	const { setMode } = useChessboard()

	const searchParams = useSearchParams()
	const param = searchParams.get('demo')

	const [popUpLink, setPopUpLink] = useState("/learn")
	const [openingText, setOpeningText] = useState()
	const [searchParamURL, setSearchParamURL] = useState("")

	let fullDescription = [];

	useEffect(() => {
		openingChange();
		if(openingClicked !== "") {
			setDescriptionsFunc();
		}
		if(param === "true") {
			setSearchParamURL("?demo=true")
		} else {
			setSearchParamURL("")
		}
	}, [popUpType, openingClicked])

	function removeSearchParams() {
		let url = window.location.href
		let newURL = url.split("?")[0]
		return newURL
	}

	async function openingChange() {
		let openingURL = await stringToURL(openingClicked)
		let newURL = removeSearchParams()
		setPopUpLink(newURL + "/" + openingURL + searchParamURL)
		
		if(popUpType == "learn") {
			setMode("learn")
		} else if(popUpType == "train") {
			setMode("train")
		}

	}

	const _openingText = () => {
		return(
			<div className='text-center'>
				{openingText}
			</div>
		)
	}

	async function setDescriptionsFunc() {
		let openingsData = await getAllOpeningsMetaData()
		let descriptions = openingsData[openingClicked].Description
		fullDescription = [];
		for(let i = 0; i < descriptions.length; i++) {
			let paragraph = (
				<p className='p-1 pt-3 text-xs lg:text-base font-thin' key={i}>
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
					<h2 className="text-2xl font-semibold">{openingClicked}</h2>
					<span id='close' className={modalStyles.close}>&times;</span>
				</div>
				<div className={modalStyles.modalBoday}>
					<_openingText />
					<div className="flex justify-center">
						<button className="bg-blue-600 mt-2 p-2 mb-4 rounded-lg" onClick={() => {router.push(popUpLink)}}>Continue</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PopUp