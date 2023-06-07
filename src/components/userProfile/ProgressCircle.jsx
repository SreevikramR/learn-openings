"use client"
import React from 'react'
import styles from './ProgressCircle.module.css'

const ProgressCircle = ({ percent, label, label2, label3 }) => {

    return (
        <>
            <div className={styles.container}>
                <div className={styles.percent} style={{"--num":percent,"--color":"#6B85FF"}}>
                    <div className={styles.dot}></div>
                    <svg className={styles.svg}>
                        <circle cx="70" cy="70" r="70" className={styles.circle}/>
                    </svg>
                    <div className={styles.number}>
                        <span><span className='text-4xl'>{label}</span><span>{label2}</span></span>
                        <span className='pt-1'>{label3}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProgressCircle