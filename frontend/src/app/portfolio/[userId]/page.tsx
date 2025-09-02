"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // URL 파라미터를 가져오기 위한 훅
import styles from './styles.module.css';

interface Project {
    title: string;
    description: string;
    url: string;
    techStack: string[];
}

interface PortfolioData {
    title: string;
    description: string;
    skills: string[];
    projects: Project[];
}


// 포트폴리오 화면 조회
export default function PublicPortfolioPage(){
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true); // 기본값 : true
    const [error, setError] = useState<string | null>(null); // type은 string이거나 null. 기본값은 null

    const params = useParams(); // URL의 동적 파라미터들을 가져옴
    const userId = params.userId as string;

    useEffect(() => {
        if (!userId) return;

        async function fetchPortfolio(){
            try{
                const response = await fetch(`/api/portfolio/view/${userId}`);

                if(response.status === 404){
                    throw new Error('포트폴리오를 찾을 수 없습니다.');
                }
                if(!response.ok){
                    throw new Error('데이터를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                setPortfolio(data);

            } catch (err:any){
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }

        fetchPortfolio();
    }, [userId]); // userId가 변경될때마다 위 effect 실행

    // 화면 출력
    if (loading){
        return <div className={styles.container}><h2>Loading...</h2></div>
    }

    if (error){
        return <div className={styles.container}><h2>{error}</h2></div>;
    }

    if(!portfolio){
        return <div className={styles.container}><h2>포트폴리오가 없습니다.</h2></div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{portfolio.title}</h1>
                <p className={styles.description}>{portfolio.description}</p>
            </header>
            <main>
                {/* 기술 스택 섹션 */}
                {portfolio.skills && portfolio.skills.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Skills</h2>
                        <div className={styles.skillsContainer}>
                            {portfolio.skills.map((skill, index) => (
                                <span key={index} className={styles.skillTag}>{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
                {/* 프로젝트 경험 섹션 */}
                {portfolio.projects && portfolio.projects.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Projects</h2>
                        {portfolio.projects.map((project, index) => (
                            <div key={index} className={styles.projectCard}>
                                <div className={styles.projectHeader}>
                                    <h3>{project.title}</h3>
                                    {project.url && (
                                        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                                            Link ↗
                                        </a>
                                    )}
                                </div>
                                <p className={styles.projectDescription}>{project.description}</p>
                                <div className={styles.skillsContainer}>
                                    {project.techStack.map((tech, techIndex) => (
                                        <span key={techIndex} className={styles.skillTag}>{tech}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <footer className={styles.footer}>
                <p>&copy; 2025 My Portfolio</p>
            </footer>
        </div>
    );
}