// frontend/app/portfolio/page.tsx

"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import toast from 'react-hot-toast';

// 데이터타입 정의
interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

interface Project {
  title:string;
  description:string;
  url:string;
  techStack:string[];
}

interface PortfolioData{
  id: string;
  userId: string;
  title: string;
  description: string;
  skills:string[];
  projects: Project[];
}

export default function PortfolioPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    id:'', userId:'', title:'', description:'', skills:[], projects:[],
  });
  const [loading, setLoading] = useState(true);
  // const [message, setMessage] = useState('');

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
            id: portfolioData.id || '',
            userId:portfolioData.userId || '',
            title: portfolioData.title || '',
            description: portfolioData.description || '',
            skills: portfolioData.skills || [],
            projects: portfolioData.projects || [],
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

    const promise = fetch('/api/portfolio', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(portfolio),
    }).then(async (response) => {
      if(!response.ok){
        throw new Error('저장에 실패했습니다.');
      }
      const savedData = await response.json();
      setPortfolio(prev => ({...prev, id:savedData.id}));
    });

    toast.promise(promise, {
      loading:'저장 중...',
      success: '성공적으로 저장되었습니다!',
      error:'오류가 발생했습니다. 다시 시도해주세요.',
    });

    // setMessage('저장 중...');

    // try {
    //   const response = await fetch('/api/portfolio', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(portfolio),
    //   });

    //   if (response.ok) {
    //     // setMessage('저장 성공');
    //     setToast('저장 성공');
    //   } else {
    //     throw new Error('저장 실패');
    //   }
    // } catch(error){
    //   console.log(error);
    //   setMessage('오류 발생했습니다. 다시 시도해주세요.');
    // }
  };


  // 삭제 버튼 클릭시
  const handleDelete = async () => {
    if(!portfolio || !portfolio.id) return;

    if (confirm("정말 이 포트폴리오를 삭제하시겠습니까?")) {
      const promise = fetch('/api/portfolio/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(portfolio),
      }).then((response) => {
        if(response.ok){
          setPortfolio({
            title:'', description:'', id:'', userId:'', skills:[], projects:[],
          }); // DB삭제 후 프론트 데이터도 초기화
        } else {
          throw new Error('삭제 권한이 없거나 오류가 발생했습니다.');
        }
      });

      toast.promise(promise, {
          loading: '삭제 중...',
          success: '삭제되었습니다.',
          error: '삭제에 실패했습니다.'
      });
    }

    /* setMessage('수정사항 저장 중...');

    try {
      const response = await fetch('/api/portfolio/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolio),
      });

      if (response.ok) {
        setMessage('삭제 성공');
        setPortfolio({
          title:'', description:'', id:'', userId:'', skills:[], projects:[],
        }); // DB삭제 후 프론트 데이터도 초기화
      } else {
        throw new Error('삭제 실패');
      }
    } catch(error){
      console.log(error);
      setMessage('오류 발생했습니다. 다시 시도해주세요.');
    } */
  };





  // 기술 스택 입력 처리
  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString.split(',').map(skill => skill.trim());
    setPortfolio(prev => ({...prev, skills: skillsArray}));
  }

  // 새 프로젝트 카드 추가
  const handleAddProject = () => {
    const newProject: Project = { title: '', description: '', url: '', techStack: [] };
    setPortfolio(prev => ({...prev, projects: [...prev.projects, newProject]}));
  }

  // 특정 프로젝트 카드 내용 수정
  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    const updatedProjects = [...portfolio.projects];

    // 타입에 맞게 value 할당
    if (field ==='techStack' && typeof value === 'string'){
      updatedProjects[index][field] = value.split(',').map(tech => tech.trim());
    } else if (typeof value === 'string'){
      // title, description, url 필드에 대한 타입 단언
      (updatedProjects[index][field] as string) = value;
    }
    setPortfolio(prev => ({...prev, projects: updatedProjects}));
  }

  // 특정 프로젝트 카드 삭제
  const handleDeleteProject = (index:number) => {
    const updatedProjects = portfolio.projects.filter((_, i) => i !== index);
    setPortfolio(prev => ({...prev, projects: updatedProjects}));
  }
  

  /*============= 페이지 화면 구성 =============*/
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <header>
        <h1>포트폴리오 관리</h1>
        <a href={`/portfolio/${userInfo.email}`}
          target="_blank" rel="noopener noreferrer" style={{display:'inline-block', marginTop:'20px', color:'#0070f3'}}>
          내 포트폴리오 공개 페이지 보기 ↗
        </a>
      </header>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img src={userInfo.picture} alt="프로필 사진" style={{ width: 50, height: 50, borderRadius: '50%' }} />
        <div style={{ marginLeft: '10px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{userInfo.name}</p>
          <p style={{ margin: 0, color: 'gray' }}>{userInfo.email}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div>포트폴리오 id : {portfolio.id}</div>
        {/* 기본 정보 섹션 */}
        <section style={{marginBottom: '40px'}}>
          <h2>기본 정보</h2>
          <div style={{marginBottom: '15px'}}>
            <label>포트폴리오 제목</label>
            <input name='title' value={portfolio.title} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div style={{marginBottom: '15px'}}>
            <label>상세 기술</label>
            <input name='description' value={portfolio.description} onChange={handleInputChange} style={inputStyle} />
          </div>
        </section>

        {/* 기술 스택 섹션 */}
        <section style={{marginBottom: '40px'}}>
          <h2>기술 스택</h2>
          <label>쉼표(,)로 구분하여 작성해주세요 (예: Java, Spring, React)</label>
          <input value={portfolio.skills.join(', ')} onChange={handleSkillsChange} style={inputStyle} />
        </section>

        {/* 프로젝트 경험 섹션 */}
        <section style={{marginBottom: '40px'}}>
          <h2>프로젝트 경험</h2>
          {portfolio.projects.map((project, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h4>프로젝트 #{index +1}</h4>
                <button type='button' onClick={()=> handleDeleteProject(index)} style={{color: 'red'}}>삭제</button>
              </div>
              <div style={{marginBottom : '10px'}}>
                <label>프로젝트명</label>
                <input value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>설명</label>
                <textarea value={project.description} onChange={(e) => handleProjectChange (index, 'description', e.target.value)} style={{...inputStyle, height: '100px'}}/>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>관련 링크 (GitHub 등)</label>
                <input value={project.url} onChange={(e) => handleProjectChange(index, 'url', e.target.value)} style={inputStyle} />
              </div>
              <div>   
                <label>사용 기술 (쉼표로 구분)</label>
                <input value={project.techStack.join(', ')} onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)} style={inputStyle} />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddProject}>+ 프로젝트 추가</button>
        </section>

        <hr />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '1.2em', marginTop: '20px' }}>전체 포트폴리오 저장하기</button>
        {/* {message && <p style={{ marginTop: '15px' }}>{message}</p>} */}
      </form>
      
      <button type="button" onClick={handleDelete}>삭제하기</button>
      
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  marginTop: '5px'
};