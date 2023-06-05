import React from 'react'
import spinner from '../../../public/loadingSpinner.gif'
import Image from 'next/image'

const LoadingOverlay = () => {
    return (
        <div className='flex w-full justify-center pt-10'>
            <Image src={spinner} alt='Loading...' height="100" priority={true}/>
        </div>
    )
}

export default LoadingOverlay