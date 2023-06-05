"use client"
import React, { useState, useEffect } from 'react'
import { getUID, getName } from '@/app/api/pfPageFunctions';
import { auth } from '@/firebase';
import { useChessboard } from '@/context/BoardContext';

const UserProfile = ({ username }) => {
    const [name, setName] = useState();
    const [accountCreationDate, setAccountCreationDate] = useState();
    const [userExists, setUserExists] = useState(false);

    const { setIsBoardLoaded } = useChessboard();

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let userUID = await getUID(username)
        if(!userUID) {
            setUserExists(false)
        } else {
            setUserExists(true)
            let userName = await getName(userUID);
            setName(userName);
            const date = new Date(auth.currentUser.metadata.creationTime);
            let month = months[date.getMonth()];
            let day = date.getDate()
            let year = date.getFullYear()
            setAccountCreationDate(`${month} ${day}, ${year}`)
        }
        setIsBoardLoaded(true);
    }

    return (
        <>
            <div className={"w-full justify-center" + (userExists ? " flex" : " hidden")}>
                <div className='flex flex-col w-3/4 justify-center mt-3'>
                    <span className='text-4xl'>{name}</span>
                    <div className='text-lg'>@{username}</div>
                    <div className='mt-2'>Member since {accountCreationDate}</div>
                </div>
            </div>
            <div className={"w-full justify-center" + (!userExists ? " flex" : " hidden")}>
                <div className='flex flex-col w-3/4 text-center mt-3'>
                    <span className='text-4xl'>User not found</span>
                </div>
            </div>
        </>
    )
}

export default UserProfile