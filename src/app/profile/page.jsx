"use client"
import React, { useEffect, useState } from 'react';
import { useChessboard } from '@/context/BoardContext';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingOverlay from '@/components/overlay/LoadingOverlay';
import NavbarComponent from '@/components/navbar/Navbar';
import PageWrapper from '@/components/wrapper/pageWrapper';
import UserProfile from '@/components/userProfile/UserProfile';
import { getUsername } from '../api/firebaseAccess';

const ProfilePage = () => {
    const { isBoardLoaded } = useChessboard();
    const [username, setUsername] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                initData()
            } else {
                window.location.href = "/login"
            }
        });
    }, []);

    async function initData() {
        const uName = await getUsername()
        setUsername(uName)
    }

    return (
        <>
            <PageWrapper>
                <NavbarComponent/>
                <div className={(!isBoardLoaded ? "flex" : "hidden")}>
                    <LoadingOverlay/>
                </div>
                <div className={"justify-center " + (isBoardLoaded ? "flex" : "hidden")}>
                    <UserProfile username={username}/>
                </div>
            </PageWrapper>
        </>
    )
}

export default ProfilePage