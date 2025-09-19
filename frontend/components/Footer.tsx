"use client";

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer(){
    return(
        <footer className={styles.footer}>
            <div className={styles.container}>
                copyright @yeri
            </div>
        </footer>
    )
}
