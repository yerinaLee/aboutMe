"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // URL 파라미터를 가져오기 위한 훅

interface PortfolioData{
    title: string;
    description: string;
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
        return <div style={styles.container}><h2>Loading...</h2></div>
    }

    if (error){
        return <div style={styles.container}><h2>{error}</h2></div>;
    }

    if(!portfolio){
        return <div style={styles.container}><h2>포트폴리오가 없습니다.</h2></div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>{portfolio.title}</h1>
            </header>
            <main>
                <p style={styles.description}>
                    {portfolio.description}
                </p>
            </main>
            <footer>
                <p>&copy; 2025 My Portfolio</p>
            </footer>
        </div>
    );
}


// 심플 스타일 객체
const styles : { [key:string]: React.CSSProperties } = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    header: {
        borderBottom: '2px solid #333',
        paddingBottom: '10px',
        marginBottom: '20px',
    },
    main: {
        lineHeight: '1.6',  
    },
    description: {
        whiteSpace: 'pre-wrap', // 줄바꿈과 공백을 그대로 표시
    },
    footer: {
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '0.9em',
        color: '#777',
    },
}