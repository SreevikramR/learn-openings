"use client"
import React, { useEffect } from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import PageWrapper from '@/components/wrapper/pageWrapper'
import { auth } from '@/firebase'
import { useState } from 'react'

const Dashboard = () => {

	return (
        <>
			<PageWrapper>
				<NavbarComponent />
				<div>Dashboard</div>
			</PageWrapper>
        </>
    )
}

export default Dashboard