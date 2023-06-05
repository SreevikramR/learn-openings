"use client"
import React from 'react';
import { useChessboard } from '@/context/BoardContext';
import LoadingOverlay from '@/components/overlay/LoadingOverlay';
import NavbarComponent from '@/components/navbar/Navbar';
import PageWrapper from '@/components/wrapper/pageWrapper';
import UserProfile from '@/components/userProfile/UserProfile';

const profilePage = ({ params }) => {
    const id = params.id
    
    const { isBoardLoaded } = useChessboard();

    return (
        <>
            <PageWrapper>
                <NavbarComponent/>
                <div className={(!isBoardLoaded ? "flex" : "hidden")}>
                    <LoadingOverlay/>
                </div>
                <div className={(isBoardLoaded ? "flex" : "hidden")}>
                    <UserProfile username={id}/>
                </div>
            </PageWrapper>
        </>
    )
}

export default profilePage