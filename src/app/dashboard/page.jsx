import React from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import PageWrapper from '@/components/wrapper/pageWrapper'

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