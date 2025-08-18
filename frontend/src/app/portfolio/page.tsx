// frontend/app/portfolio/page.tsx

"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

// 데이터타입 정의
interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

interface PortfolioData{
  title: string;
  description: string;
}

export default function PortfolioPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData>({title:'', description:''});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 페이지가 로드될 때 사용자 정보와 기존 포트폴리오 정보 조회
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        // 1. 사용자 정보 get
        // const response = await fetch('http://localhost:8080/user/info');
        const userResponse = await fetch('/api/user/info'); // next.config.ts의 source와 맞춤
        if (!userResponse.ok) throw new Error('Failed to fetch user info');

        // 백엔드에서 받은 데이터 구조가 { attributes: { ... } } 형태일 수 있습니다.
        // 브라우저 개발자 도구(F12)의 Network 탭에서 실제 응답 구조를 확인하고 맞춰주세요.
        
        // 스프링 시큐리티의 OAuth2User 객체 구조에 맞게 데이터를 추출합니다.
        // const principal = data.principal;
        // setUserInfo({
        //   name: principal.attributes.name,
        //   email: principal.attributes.email,
        //   picture: principal.attributes.picture,
        // });
        const userData = await userResponse.json();
        const currentUserInfo = {
          name: userData.attributes.name,
          email: userData.attributes.email,
          picture: userData.attributes.picture,
        };
        setUserInfo(currentUserInfo);

        // 2. 기존 포트폴리오 정보 get
        const portfolioResponse = await fetch('/api/portfolio');
        if (portfolioResponse.ok){
          const portfolioData = await portfolioResponse.json();
          setPortfolio({
            title: portfolioData.title || '',
            description: portfolioData.description || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, []);

  // form input 값 변경시 portfolio 상태 업데이트
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPortfolio(prev => ({ ...prev, [name]: value}));
  }

  // 저장 버튼 클릭시
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출시 새로고침 방지
    setMessage('저장 중...');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolio),
      });

      if (response.ok) {
        setMessage('저장 성공');
      } else {
        throw new Error('저장 실패');
      }
    } catch(error){
      console.log(error);
      setMessage('오류 발생했습니다. 다시 시도해주세요.');
    }
  };
  

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!userInfo) {
    return (
      <div>
        <p>로그인 정보가 없습니다.</p>
        <a href="http://localhost:8080/oauth2/authorization/google">구글로 로그인하기</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>포트폴리오 관리</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img src={userInfo.picture} alt="프로필 사진" style={{ width: 50, height: 50, borderRadius: '50%' }} />
        <div style={{ marginLeft: '10px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{userInfo.name}</p>
          <p style={{ margin: 0, color: 'gray' }}>{userInfo.email}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>포트폴리오 제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={portfolio.title}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>상세 설명</label>
          <textarea
            id="description"
            name="description"
            value={portfolio.description}
            onChange={handleInputChange}
            rows={10}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>저장하기</button>
      </form>
      
      {message && <p>{message}</p>}
    </div>
  );
}