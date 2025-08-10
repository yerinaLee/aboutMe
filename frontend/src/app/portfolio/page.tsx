// frontend/app/portfolio/page.tsx

"use client";

import { useEffect, useState } from 'react';

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

export default function PortfolioPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        // const response = await fetch('http://localhost:8080/user/info');
        const response = await fetch('/api/user/info'); // next.config.ts의 source와 맞춤

        if (response.ok) {
          const data = await response.json();

          // 백엔드에서 받은 데이터 구조가 { attributes: { ... } } 형태일 수 있습니다.
          // 브라우저 개발자 도구(F12)의 Network 탭에서 실제 응답 구조를 확인하고 맞춰주세요.
          
          // 스프링 시큐리티의 OAuth2User 객체 구조에 맞게 데이터를 추출합니다.
          // const principal = data.principal;
          // setUserInfo({
          //   name: principal.attributes.name,
          //   email: principal.attributes.email,
          //   picture: principal.attributes.picture,
          // });
          setUserInfo({
            name: data.attributes.name,
            email: data.attributes.email,
            picture: data.attributes.picture,
          });
        } else {
          // 로그인되어있지 않은 경우 or 서버 에러 발생
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, []);

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
    <div>
      <h1>포트폴리오 페이지</h1>
      <img src={userInfo.picture} alt="프로필 사진" width={100} height={100} />
      <p>이름: {userInfo.name}</p>
      <p>이메일: {userInfo.email}</p>
      {/* TODO: 여기에 포트폴리오 정보 입력 폼 추가 */}
    </div>
  );
}