"use client"
import React, { useEffect } from 'react'
import { useChessboard } from '@/context/BoardContext'
import { readOpening, setFirstLine, getLines, getMoveSequence } from '@/app/api/firebaseAccess';

function TrialPageInit() {

    const {setMoveHistory, setPlayerColor, setOpeningLine, setOpeningName, setMoveSequence, setLineVariations} = useChessboard();

    useEffect(() => {
        init();
    }, [])

    async function init() {
        setMoveHistory([]);
        await setOpeningName('Ruy Lopez')
        await readOpening('Ruy Lopez');
        const line = await setFirstLine()
        await setOpeningLine(line)
        await setLineVariations(await getLines())
        await setPlayerColor("white")
        let tempMoveSequence = await getMoveSequence(line)
        await setMoveSequence(tempMoveSequence)
        setMoveHistory([]);
    }

    return <></>
}

export default TrialPageInit