"use client"
import NavbarComponent from '@/components/navbar/Navbar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useChessboard } from '@/context/BoardContext'
import { getAllOpenings } from '../api/firebaseAccess'
import styles from "@/app/styles/openingTiles.module.css"
import ruyLopez from "../../../public/ruy-lopez.png"

const LearnPick = () => {
	const {setPopUpState, setAllOpenings, allOpenings, openingName, setOpeningName} = useChessboard()
	const [tiles, setTiles] = useState()

	useEffect(() => {
		getOpeningData().then((openingsList) => {
			setTileData(openingsList)
		})
	}, [])

	async function getOpeningData() { 
		const openings = await getAllOpenings();
		setAllOpenings(openings)
		return openings
	}

	async function setTileData(openingsList) {
		let tempTiles = []
		let numItemsPerRow = Math.floor(window.innerWidth / 360)
		let imgWidth = Math.floor(window.innerWidth / numItemsPerRow) - (Math.floor(window.innerWidth / numItemsPerRow) * 0.4)
		let numRows = Math.ceil(openingsList.length / numItemsPerRow)
		let row = [];


		for(let i=0; i < numRows; i++) {
			for(let j=0; j < numItemsPerRow; j++) {
				let itemIndex = (i * numItemsPerRow) + j;
				if(itemIndex >= openingsList.length) {
					break;
				}
				let opening = openingsList[itemIndex]
				let _openingBlock = (
					<div key={opening} className={styles.openingBlock}>
						<Image src={ruyLopez} alt="Ruy Lopez" width={imgWidth} height={imgWidth} className="self-center rounded-md"/>
						<span className="text-white italic text-2xl pt-2">{opening}</span>
					</div>
				)
				row.push(_openingBlock)
			}
			let rowBlock = (
				<div className={styles.gridrow}>
					{row}
				</div>
			)
			tempTiles.push(rowBlock)
			row = []
		}
		setTiles(tempTiles)
	}

	const _learn = () => {
		return(
			<div className={styles.grid}>
				{tiles}
			</div>
		)
	}


	return (
		<>
			<NavbarComponent/>
			<div className="flex justify-center">
				<span className="text-4xl font-bold">Pick Opening to Learn</span>
			</div>
			<_learn/>
		</>
	)
}

export default LearnPick