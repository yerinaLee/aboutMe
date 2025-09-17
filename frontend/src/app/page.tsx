"use client";

import { useEffect, useState } from "react";  
import Link from 'next/link';
import styles from './Home.module.css'; // 홈페이지 전용 css 모듈

// 확장된 데이터 타입 정의
interface Project {
  title: string;
}

interface PortfolioData{
  id: string;
  userId: string;
  title: string;
  userName: string;
  description: string;
  skills:string[];
  projects: Project[];
}

export default function HomePage(){
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPortfolios(){
      try {
        const response = await fetch('/api/portfolio/all');
        if (!response.ok){
          throw new Error('포트폴리오 목록을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setPortfolios(data);
      } catch(error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllPortfolios();
  }, []);

  if (loading){
    return <div className={styles.container}><h2>Loading portfolios...</h2></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>포트폴리오 갤러리</h1>
        <p>다른 개발자들의 포트폴리오를 구경해보세요!</p>
      </header>

      <main className={styles.galleryGrid}>
        {portfolios.map(p => (
          <Link key={p.id} href={`/portfolio/${p.userId}`} className={styles.cardLink}>
            <div className={styles.card}>
              <h3>{p.title}</h3>
              <p className={styles.cardAuthor}>by {p.userName}</p>
              <div className={styles.cardSkills}>
                {p.skills?.slice(0,5).map((skill, index) => (
                  <span key={index} className={styles.skillTag }>{skill}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}