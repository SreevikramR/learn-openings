"use client"
import NavbarComponent from '@/components/navbar/Navbar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useChessboard } from '@/context/BoardContext'
import { getAllOpenings, getLines, setFirstLine, getImageURL, getNumberOfVariations } from '../api/firebaseAccess'
import styles from "@/app/styles/openingTiles.module.css"
import PopUp from '@/components/popUp/PopUp'
import PageWrapper from '@/components/wrapper/pageWrapper'
import { getOpeningsData } from '../api/firebaseAccess'
import LoadingOverlay from '@/components/overlay/LoadingOverlay'

const TrainPick = () => {
	const {setPopUpType, setAllOpenings, setOpeningName, setOpeningLine, setLineVariations, setPlayerColor} = useChessboard()
	const [tiles, setTiles] = useState()
	const [pageLoading, setPageLoading] = useState(true)

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
		let openingsData = await getOpeningsData();
		let numVariations = await getNumberOfVariations(openingsList);
		let imgURLs = []
		let tempTiles = []
		let boxWidth = 360;
		if(window.innerWidth < 380) {
			boxWidth = window.innerWidth - 20
		}
		let numItemsPerRow = Math.floor(window.innerWidth / boxWidth)
		let imgWidth = 216
		let numRows = Math.ceil(openingsList.length / numItemsPerRow)
		let row = [];
		for(let i=0; i < openingsList.length; i++) {
			let opening = openingsList[i]
			let imgURL = await getImageURL(openingsData[opening].imgName)
			imgURLs.push(imgURL)
		}

		for(let i=0; i < numRows; i++) {
			for(let j=0; j < numItemsPerRow; j++) {
				let itemIndex = (i * numItemsPerRow) + j;
				if(itemIndex >= openingsList.length) {
					break;
				}
				let opening = openingsList[itemIndex]
				let _openingBlock = (
					<div key={opening} className={styles.openingBlock} onClick={() => {handleTileClick(opening)}}>
						<Image src={imgURLs[itemIndex]} alt="Ruy Lopez" width={imgWidth} height={imgWidth} className="self-center rounded-md"/>
						<span className="text-white italic text-2xl pb-2 pt-1">{opening}</span>
						<div className="border-t-2 border-zinc-800 flex justify-end pr-2">
							<span>{numVariations[itemIndex]} Variations</span>
						</div>
					</div>
				)
				row.push(_openingBlock)
			}
			let rowBlock = (
				<div className={styles.gridrow} key={i}>
					{row}
				</div>
			)
			tempTiles.push(rowBlock)
			row = []
		}
		setTiles(tempTiles)
		setTimeout(() => {
			setPageLoading(false)
		}, 50)
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
			<PageWrapper>
				<PopUp/>
				<NavbarComponent/>
				<div className="flex justify-center">
					<span className="lg:text-4xl text-3xl font-bold">Pick Opening to Train</span>
				</div>
				<div className={"justify-center" + (pageLoading ? " flex" : " hidden")}>
					<LoadingOverlay/>
				</div>
				<div className={"justify-center" + (!pageLoading ? " flex" : " hidden")}>
					<_train/>
				</div>
			</PageWrapper>
		</>
	)
}

export default TrainPick