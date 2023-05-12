"use client"
import NavbarComponent from '@/components/navbar/Navbar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useChessboard } from '@/context/BoardContext'
import { getAllOpenings, getLines, setFirstLine } from '../api/firebaseAccess'
import styles from "@/app/styles/openingTiles.module.css"
import ruyLopez from "../../../public/ruy-lopez.png"
import PopUp from '@/components/popUp/PopUp'

const TrainPick = () => {
	const {setPopUpType, setAllOpenings, setOpeningName, setOpeningLine, setLineVariations, setPlayerColor} = useChessboard()
	const [tiles, setTiles] = useState()

	useEffect(() => {
		getOpeningData().then((openingsList) => {
			setTileData(openingsList)
		})
		setPopUpType("train")
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
					<div key={opening} className={styles.openingBlock} onClick={() => {handleTileClick(opening)}}>
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

	const _train = () => {
		return(
			<div className={styles.grid}>
				{tiles}
			</div>
		)
	}

	async function handleTileClick(opening) {
		setOpeningName(opening)
		openPopUp()
		let line = await setFirstLine(opening)
		await setOpeningLine(line)
		await setLineVariations(await getLines())
		await setPlayerColor("white")
	}

	async function openPopUp() {
		var modal = document.getElementById("modal");
		var span = document.getElementById("close");
		modal.style.display = "block";
		span.addEventListener("click", () => {
			modal.style.display = "none";
		})
		window.addEventListener('click', ()=> {
            if (event.target == modal) {
				modal.style.display = "none";
			}
        })
	}

	return (
		<>
			<PopUp/>
			<NavbarComponent/>
			<div className="flex justify-center">
				<span className="text-4xl font-bold">Pick Opening to Train</span>
			</div>
			<_train/>
		</>
	)
}

export default TrainPick