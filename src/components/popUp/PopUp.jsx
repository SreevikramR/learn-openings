/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect, useState } from 'react'
import modalStyles from "./PopUp.module.css"
import { useChessboard } from '@/context/BoardContext'
import { useRouter } from 'next/navigation'

const PopUp = () => {
	const router = useRouter()
	const { openingName, popUpType } = useChessboard()

	const [popUpLink, setPopUpLink] = useState("/dashboard")
	
	useEffect(() => {
		if(popUpType == "learn") {
			setPopUpLink("/learn")
		} else if(popUpType == "train") {
			setPopUpLink("/train")
		}
	}, [popUpType])

	const OpeningText = () => {
		return(
			<div className="text-center">
				<p className='pt-3'>
					The Ruy Lopez, also known as the Spanish Opening, is one of the oldest and most popular chess openings in the game's history. It begins with the moves 1.e4 e5 2.Nf3 Nc6 3.Bb5, in which the white bishop attacks the black knight on c6. 
				</p>
				<p className='pt-3'>
					The Ruy Lopez is considered a highly strategic opening and is intended for intermediate to advanced level players. It has a numerical difficulty score of 4 out of 5, which means it requires a good understanding of pawn structures, piece coordination, and positional play. There are several reasons why players should learn the Ruy Lopez. Firstly, it allows white to control the center of the board and develop pieces quickly. Secondly, it offers white the opportunity to put pressure on black's pawn structure, particularly on the weak d6-pawn. Thirdly, the Ruy Lopez provides white with various attacking options and a chance to gain a strong initiative early on in the game. 
				</p>
				<p className='pt-3'>
					Although the Ruy Lopez can be played from either side, it is more commonly seen from the white perspective. However, the opening has been extensively studied and analyzed by both players, and it is known to be a highly dynamic and strategic battle. While the Ruy Lopez does not necessarily guarantee a win for white, it has been shown to be a highly effective and versatile opening. As such, it is a valuable addition to any player's repertoire and can lead to improved results on the board.
				</p>
			</div>
		)
	}

	return(
		<div className={modalStyles.modal} id='modal'>
			<div className={modalStyles.modalContent}>
				<div className={modalStyles.modalHeader}>
					<h2 className="text-2xl font-semibold">{openingName}</h2>
					<span id='close' className={modalStyles.close}>&times;</span>
				</div>
				<div className={modalStyles.modalBoday}>
					<OpeningText />
					<div className="flex justify-center">
						<button className="bg-blue-600 mt-2 p-2 mb-4 rounded-lg" onClick={() => {router.push(popUpLink)}}>Start Now</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PopUp