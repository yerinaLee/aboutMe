package com.about.portfolio.config;

import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

// Spring Security 소셜 로그인 처리 클래스
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
            .csrf(csrf -> csrf.disable()) // API 서버 개발 - CSRF 보호 비활성화
            .authorizeHttpRequests(authorize -> authorize // 접근권한 설정
                    .requestMatchers("/", "/login/**", "/portfolio/view/**", "/portfolio/all").permitAll() // 메인 페이지와 로그인 페이지는 인증 없이 접근 가능
                    .anyRequest().authenticated() // 그 외의 모든 요청은 인증 필요
            )
            .oauth2Login(oauth2 -> oauth2 // 소셜로그인 활성화
                    .defaultSuccessUrl("http://localhost:3000/portfolio", true) // 로그인 성공 시 리다이렉션 될 주소
            )
            .logout(logout -> logout
                    .logoutUrl("/user/logout") // 로그아웃 요청 url
                    .logoutSuccessUrl("/index") // 로그아웃 성공시 리다이렉트 url
                    .deleteCookies("JSESSIONID")
            );

        return http.build();
    }


}
