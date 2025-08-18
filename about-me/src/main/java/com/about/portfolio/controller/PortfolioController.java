package com.about.portfolio.controller;

import com.about.portfolio.domain.Portfolio;
import com.about.portfolio.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    // 로그인한 사용자의 포트폴리오 정보 get
    @GetMapping
    public ResponseEntity<Portfolio> getPortfolio(@AuthenticationPrincipal OAuth2User oAuth2User){
        String userId = oAuth2User.getAttribute("email"); // google auth email = userId
        return portfolioRepository.findByUserId(userId)
                .map(ResponseEntity::ok) // 포트폴리오가 있으면 200  OK와 함께 데이터 반환
                .orElse(ResponseEntity.notFound().build()); // 없다면 404 Not found 반환
    }

    // 포트폴리오 생성 및 업데이트
    @PostMapping
    public Portfolio createOrUpdatePortfolio(@RequestBody Portfolio portfolio, @AuthenticationPrincipal OAuth2User oAuth2User){
        String userId = oAuth2User.getAttribute("email");
        portfolio.setUserId(userId);

        portfolioRepository.findByUserId(userId).ifPresent(p -> portfolio.setId(p.getId()));
        return portfolioRepository.save(portfolio);
    }

}
