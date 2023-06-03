import React from 'react'
import OnboardingForm from '@/components/forms/OnboardingForm'
import NavbarComponent from '@/components/navbar/Navbar'

const onBoardingPage = () => {
	return (
		<>
			<NavbarComponent />
            <main className="flex flex-col columns-1 justify-center align-middle items-center w-full">
                <div className="text-white lg:text-4xl text-3xl font-semibold mb-6">Pick a Username</div>
                <OnboardingForm />
            </main>
		</>
	)
}

export default onBoardingPage