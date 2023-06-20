"use client"
import React, { useEffect, useState } from "react";
import { useChessboard } from "@/context/BoardContext";
import { getVariationNames, parseFromURL, stringToURL, getImageURL } from "@/app/api/firebaseAccess";
import LoadingOverlay from "../overlay/LoadingOverlay";
import styles from "./Grid.module.css";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const VariationsGrid = ({ opening }) => {
    const {setPopUpType, setOpeningLine} = useChessboard()
    const [tiles, setTiles] = useState()
    const [loadingTiles, setLoadingTiles] = useState(true)
	const [openingName, setOpeningName] = useState("")

	const searchParams = useSearchParams()
	const param = searchParams.get('demo')

	let variationURLs;

    useEffect(() => {
		console.log(param)
		let searchParam
		if(param === "true") {
			searchParam = "?demo=true"
		} else {
			searchParam = ""
		}
		parseFromURL(opening).then((openingName) => {
			setOpeningName(openingName)
			getVariationNames(openingName).then((lines) => {
				setTileData(lines, searchParam)
			})
		})

        if(window.location.href === "/learn") {
            setPopUpType("learn")
        } else {
            setPopUpType("train")
        }
    }, [])

	function removeSearchParams() {
		let url = window.location.href
		let newURL = url.split("?")[0]
		return newURL
	}

    async function setTileData(variationList, searchParam) {
		let imgURLs = []
		let tempTiles = []
		let boxWidth = 360;
		if(window.innerWidth < 380) {
			boxWidth = window.innerWidth - 20
		}
		let numItemsPerRow = Math.floor(window.innerWidth / boxWidth)
		let imgWidth = 216
		let numRows = Math.ceil(variationList.length / numItemsPerRow)
		let row = [];
		for(let i=0; i < numRows; i++) {
			for(let j=0; j < numItemsPerRow; j++) {
				let itemIndex = (i * numItemsPerRow) + j;
				if(itemIndex >= variationList.length) {
					break;
				}
				let variation = variationList[itemIndex]

				let variationURL = await stringToURL(variation)
				let URLString = variationURL
				variationURL = removeSearchParams() + "/" + variationURL + searchParam
				console.log(variationURL)
				
				let imgURL = await getImageURL(opening + "/" + URLString + ".png")
				imgURLs.push(imgURL)

				let _variationBlock = (
					<Link href={variationURL}>
						<div key={variation} className={styles.openingBlock} onClick={() => {handleTileClick(variation)}}>
							<Image src={imgURLs[itemIndex]} alt={variation} width={imgWidth} height={imgWidth} className="self-center rounded-md"/>
							<span className="text-white italic text-xl py-2 px-2">{variation}</span>
						</div>
					</Link>
				)
				row.push(_variationBlock)
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

	async function handleTileClick(variation) {
		setOpeningLine(variation) //Should be removed
	}

    return (
        <>
			<div className="flex w-full justify-center">
				<span className="text-3xl font-semibold p-2 border-2 border-white rounded-lg m-3">{openingName}</span>
			</div>
            <div className={"justify-center" + (loadingTiles ? " flex" : " hidden")}>
                <LoadingOverlay/>
            </div>
            <div className={"justify-center" + (!loadingTiles ? " flex" : " hidden")}>
                <_grid/>
            </div>
        </>
    )

    async function handleTileClick() {
        // let line = await setFirstLine(opening)

		// await setOpeningLine(line)
		// await setLineVariations(await getLines())
		// await setPlayerColor("white")
    }

    return(
        <div>{opening}</div>
    )
}

export default VariationsGrid