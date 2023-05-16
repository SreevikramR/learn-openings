import React from 'react'
import NavbarComponent from '@/components/navbar/Navbar'
import ForgotPassword from '@/components/forms/ForgotPassword'

const Reset = () => {
    return (
        <>
            <NavbarComponent />
            <main className="flex flex-col columns-1 justify-center align-middle items-center w-full">
                <div className="text-white lg:text-4xl text-2xl font-semibold mb-6">Reset Password</div>
                <ForgotPassword />
            </main>
        </>
    )
}

export default Reset