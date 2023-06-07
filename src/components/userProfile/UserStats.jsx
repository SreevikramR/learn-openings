"use client"
import React from 'react'
import ProgressCircle from './ProgressCircle'

const UserStats = ({ completedVariations , totalVariations, percentages }) => {
    return (
        <div className='w-full h-full p-4 mt-8 flex flex-col'>
            <div className='text-3xl'>Stats</div>
            <div className='flex flex-row text-center'>
                <div className='w-1/2 bg-zinc-950 p-5 rounded-2xl m-2 ml-0'>
                    <div className='flex flex-row justify-evenly'>
                        <ProgressCircle percent={percentages[0]} label={completedVariations[0]} label2={"/" + totalVariations} label3={"White"}/>
                        <ProgressCircle percent={percentages[1]} label={completedVariations[1]} label2={"/" + totalVariations} label3={"Black"}/>
                    </div>
                    <div className='mt-5'>
                        <span className='text-xl'>Learn Mode</span>
                    </div>
                </div>
                <div className='w-1/2 bg-zinc-950 p-5 rounded-2xl m-2 mr-0'>
                    <div className='flex flex-row justify-evenly'>
                        <ProgressCircle percent={percentages[2]} label={completedVariations[2]} label2={"/" + totalVariations} label3={"White"}/>
                        <ProgressCircle percent={percentages[3]} label={completedVariations[3]} label2={"/" + totalVariations} label3={"Black"}/>
                    </div>
                    <div className='mt-5'>
                        <span className='text-xl'>Train Mode</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserStats