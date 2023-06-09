"use client"
import React, { useState } from 'react'
import WarningModal from './warningModal/WarningModal'

const DangerZone = ({ isAccountOwner, uid }) => {
    const [modalType, setModalType] = useState('reset')

    function manageModalOpening(type) {
        openPopUp()
        setModalType(type)
    }

    function openPopUp() {
		var modal = document.getElementById("modal");
        var close = document.getElementById("closeButton");
		modal.style.display = "block";
		window.addEventListener('click', ()=> {
			if (event.target == modal) {
				modal.style.display = "none";
			} else if (event.target == close) {
                modal.style.display = "none";
            }
		})
	}

    if(!isAccountOwner) {
        return <></>
    } else {
        return (
            <>
                <div className='mt-3 p-4 mb-10'>
                    <div className='text-3xl font-semibold'>Danger Zone</div>
                    <div className='mt-7'><span className='border-white border-2 p-3 rounded-xl cursor-pointer' onClick={() => manageModalOpening('reset')}>Reset Account Data</span></div>
                    <div className='mt-8'><span className='bg-red-600 p-3 rounded-xl cursor-pointer' onClick={() => manageModalOpening('delete')}>Delete Account</span></div>
                    <WarningModal type={modalType} />
                </div>
            </>
        )
    }
}

export default DangerZone