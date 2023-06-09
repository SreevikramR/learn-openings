"use client"
import React, { useState, useEffect } from 'react'
import { getUID, getName, getTotalNumVariations, getCompletedVariations } from '@/app/api/pfPageFunctions';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useChessboard } from '@/context/BoardContext';
import UserStats from './profileComponents/UserStats';
import DangerZone from './profileComponents/DangerZone';

const UserProfile = ({ username }) => {
    const [name, setName] = useState();
    const [accountCreationDate, setAccountCreationDate] = useState();
    const [uid, setUid] = useState();
    const [userExists, setUserExists] = useState(false);
    const [isAccountOwner, setIsAccountOwner] = useState(false);
    const [numVariations, setNumVariations] = useState();
    const [completedVariations, setCompletedVariations] = useState([]);
    const [percentages, setPercentages] = useState([]);

    const { setIsBoardLoaded } = useChessboard();

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            getData(user)
        })
    }, []);

    const getData = async (user) => {
        let userUID = await getUID(username)
        setUid(userUID);
        if(user.uid === userUID) {
            setIsAccountOwner(true)
        } else {
            setIsAccountOwner(false)
        }
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
            let numVariations = await getTotalNumVariations();
            setNumVariations(numVariations);
            let completedVariations = await getCompletedVariations(userUID);
            let variationsArray = [];
            let percentagesArray = [];
            if(completedVariations[0] === undefined) {
                variationsArray.push(0);
                percentagesArray.push(0);
            } else {
                variationsArray.push(completedVariations[0].length);
                percentagesArray.push(Math.round((completedVariations[0].length / numVariations) * 100));
            }
            if(completedVariations[1] === undefined) {
                variationsArray.push(0);
                percentagesArray.push(0);
            } else {
                variationsArray.push(completedVariations[1].length);
                percentagesArray.push(Math.round((completedVariations[1].length / numVariations) * 100));
            }
            if(completedVariations[2] === undefined) {
                variationsArray.push(0);
                percentagesArray.push(0);
            } else {
                variationsArray.push(completedVariations[2].length);
                percentagesArray.push(Math.round((completedVariations[2].length / numVariations) * 100));
            }
            if(completedVariations[3] === undefined) {
                variationsArray.push(0);
                percentagesArray.push(0);
            } else {
                variationsArray.push(completedVariations[3].length);
                percentagesArray.push(Math.round((completedVariations[3].length / numVariations) * 100));
            }
            setCompletedVariations(variationsArray);
            setPercentages(percentagesArray);
        }
        setIsBoardLoaded(true);
    }

    return (
        <>
            <div className={"w-full justify-center" + (userExists ? " flex" : " hidden")}>
                <div className='flex flex-col w-4/5 justify-center mt-3'>
                    <div className='border-2 border-white p-4 rounded-lg'>
                        <span className='text-4xl'>{name}</span>
                        <div className='text-lg'>@{username}</div>
                        <div className='mt-2'>Member since {accountCreationDate}</div>
                    </div>
                    <UserStats completedVariations={completedVariations} totalVariations={numVariations} percentages={percentages}/>
                    <div className='text-2xl mt-5'>
                        <DangerZone isAccountOwner={isAccountOwner} uid={uid}/>
                    </div>
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