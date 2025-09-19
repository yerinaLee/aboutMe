"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

interface UserInfo {
    name:string;
    email:string;
    picture:string;
}

export default function Header(){
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        // 페이지가 로드될 때마다 로그인 상태 확인
        fetch('/api/user/info')
        .then(res =>{
            if(res.ok){
                return res.json();
            }
            return null;
        })
        .then(data => {
            if (data) {
                setUser(data.attributes);
            }
        });
    }, []);

    return(
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href='/' className={styles.logo}>
                    Portfolio Hub
                </Link>
                <nav className={styles.nav}>
                    {user ? (
                        <>
                            <span className={styles.welcome}>환영합니다, {user.name}님!</span>
                            <Link href='/portfolio' className={styles.navLink}>
                                내 포트폴리오 관리
                            </Link>
                            <a href='/api/logout' className={styles.navLink}>
                                로그아웃
                            </a>
                        </>
                    ) : (
                        <a href='http://localhost:8080/oauth2/authorization/google' className={styles.navLink}>
                            로그인
                        </a>
                    )}
                </nav>
            </div>
        </header>
    )
}