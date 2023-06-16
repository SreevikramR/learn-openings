"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './Grid.module.css'
import LoadingOverlay from '../overlay/LoadingOverlay'
import { getOpeningsList, getImageURL, getAllOpeningsMetaData, getNumberOfVariations } from '@/app/api/firebaseAccess'
import PopUp from '../popUp/OpeningPopUp'

const OpeningsGrid = () => {

	// On tile hover, the image shrinks and the name of the opening is displayed

    const [tiles, setTiles] = useState()
    const [loadingTiles, setLoadingTiles] = useState(true)

	const [popUpType, setPopUpType] = useState("")
	const [openingClicked, setOpeningClicked] = useState("")

    useEffect(() => {
        getOpeningsList().then((openingsList) => {
            setTileData(openingsList)
        })
        if(window.location.pathname === "/learn") {
			console.log("learn")
            setPopUpType("learn")
        } else {
            setPopUpType("train")
        }
    }, [])

    async function setTileData(openingsList) {
		let openingsData = await getAllOpeningsMetaData();
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
						<Image src={imgURLs[itemIndex]} alt={opening} width={imgWidth} height={imgWidth} className="self-center rounded-md"/>
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
			setLoadingTiles(false)
		}, 50)
	}

	const _grid = () => {
		return(
			<div className={styles.grid}>
				{tiles}
			</div>
		)
	}

	async function handleTileClick(opening) {
		setOpeningClicked(opening)
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
			<PopUp openingClicked={openingClicked} popUpType={popUpType}/>
            <div className={"justify-center" + (loadingTiles ? " flex" : " hidden")}>
                <LoadingOverlay/>
            </div>
            <div className={"justify-center" + (!loadingTiles ? " flex" : " hidden")}>
                <_grid/>
            </div>
        </>
    )
}

export default OpeningsGrid