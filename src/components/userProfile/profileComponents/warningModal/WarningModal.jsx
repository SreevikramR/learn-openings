/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react'
import modalStyles from "./WarningModal.module.css"
import { resetUserData, deleteUserData } from '@/app/api/pfPageFunctions'

const WarningModal = ({ type }) => {
    const [confirmText, setConfirmText] = useState('')
    const [error, setError] = useState(true)

    useEffect(() => {
        const button = document.getElementById('button')
        button.disabled = true;
        setConfirmText('')
        const input = document.getElementById('input')
        input.value = ''
        input.removeEventListener('input', checkInput)
        input.addEventListener('input', checkInput)
        setError(true)
    }, [type])

    function checkInput() {
        const input = document.getElementById('input')
        const button = document.getElementById('button')
        if(input.value.toLowerCase() === type) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    function handleClick() {
        console.log("clicked")
    }
	
    const _modalText = () => {
        if(type === 'reset') {
            return (
                <>
                    <p className="text-xl">Are you sure you want to reset your account data?</p>
                    <p className="text-base">This will delete all of your data and you will have to start over. This action is NOT reversible</p>
                </>
            )
        } else if(type === 'delete') {
            return (
                <>
                    <p className="text-xl">Are you sure you want to delete your account?</p>
                    <p className="text-base">This will delete all of your data and you will have to start over. This action is NOT reversible</p>
                </>
            )
        }
    }

    async function handleConfirm () {
        console.log('reset')
        if(type === 'reset') {
            const button = document.getElementById('button')
            button.disabled = true;
            button.innerHTML = 'Resetting...'
            const result = await resetUserData()
            if(result) {
                window.location.reload()
            } else {
                setError(result)
            }
        } else if(type === 'delete') {
            const button = document.getElementById('button')
            button.disabled = true;
            button.innerHTML = 'Deleting...'
            const result = await deleteUserData()
            if(result) {
                window.location.href = '/'
            } else {
                setError(result)
            }
        }
    }

	return(
		<div className={modalStyles.modal} id='modal'>
			<div className={modalStyles.modalContent}>
				<div className={modalStyles.modalBoday}>
					<_modalText />
                    <p className='mt-4 text-sm'>Type {(type === 'reset' ? 'RESET' : 'DELETE')} below to confirm</p>
                    <input id='input' type='text' value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoFocus placeholder={(type === 'reset' ? 'RESET' : 'DELETE')} className='bg-black border-2 rounded-md mt-2 text-white p-1 border-white focus:border-2 focus:border-red focus:outline-none'/>
					<div className="flex justify-center mt-5">
                        <button id='closeButton' className="transparent mt-2 p-2 mb-4 rounded-lg border-2 border-white mr-2 lg:mr-5">No, I change my mind</button>
                        <button id='button' className={"mt-2 p-2 px-4 mb-4 rounded-lg ml-2 lg:ml-5 bg-red-600 disabled:bg-red-500 disabled:cursor-not-allowed"} onClick={() => handleConfirm()}>{(type === 'reset' ? 'RESET' : 'DELETE')}</button>
					</div>
                    <div className={'text-center' + (!error ? " block" : " hidden")}>
                        <span className='text-sm'>Error: {error}. Please contact support at sreevikram.r@gmail.com</span>
                    </div>
				</div>
			</div>
		</div>
	)
}

export default WarningModal