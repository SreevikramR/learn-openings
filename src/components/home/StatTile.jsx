"use client"
import React from 'react';
import CountUp from 'react-countup';
import styles from './statTile.module.css';
import tacticsIcon from '../../../public/tacticsIcon.png'
import Image from 'next/image';
import Icon from '../../../public/icon.png';

const StatTile = ({ text, value, index }) => {
    let icon;

    if(index === 0 ) {
        icon = tacticsIcon
    } else if (index === 1) {
        icon = Icon
    }

    return (
        <>
            <div className={styles.statTile}>
                <Image src={icon} alt="Tactics Icon" width={125} height={125}/>
                <CountUp end={value} duration={3} delay={2} enableScrollSpy suffix='+' />
                <div className='text-xl'>{text}</div>
            </div>
        </>
    )
}

export default StatTile;