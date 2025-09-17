package com.about.portfolio.controller;

import com.about.portfolio.domain.Portfolio;
import com.about.portfolio.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    // 로그인한 사용자의 포트폴리오 정보 get
    @GetMapping
    public ResponseEntity<Portfolio> getPortfolio(@AuthenticationPrincipal OAuth2User oAuth2User){
        String userId = oAuth2User.getAttribute("email"); // google auth email = userId

        // Optional[Portfolio{id='68afb16c6bedd7889c269f63', userId='yeri042924@gmail.com', title='우야아아아아', description='', skills=[Java, react], projects=[com.about.portfolio.domain.Project@72171759]}]
        return portfolioRepository.findByUserId(userId)
                .map(ResponseEntity::ok) // 포트폴리오가 있으면 200  OK와 함께 데이터 반환
                .orElse(ResponseEntity.notFound().build()); // 없다면 404 Not found 반환
    }

    // 포트폴리오 생성 및 업데이트
    @PostMapping
    public Portfolio createOrUpdatePortfolio(@RequestBody Portfolio portfolio, @AuthenticationPrincipal OAuth2User oAuth2User){
        System.out.println("save portfolio : " + portfolio);
        // portfolio : Portfolio{id='68ae636c107e50110d99be84', userId='null', title='우와아아악', description='아아아아아아가ㄴㅇㄹㄴㅇㄹ'}

        String userId = oAuth2User.getAttribute("email");
        String userName = oAuth2User.getAttribute("name"); // google name 정보
        portfolio.setUserId(userId);
        portfolio.setUserName(userName);

        // userId로 기존 포트폴리오 검색 후, 존재시 포트폴리오 ID를 현재 portfolio 객체에 세팅
        // portfolioRepository.findByUserId(userId).ifPresent(p -> portfolio.setId(p.getId()));

        // 새로 저장하는 데이터인경우, DB id null 값 처리 (null값이 아닌 '' 인 경우 DB id 생성이 되지 않음)
        if(portfolio.getId() != null && portfolio.getId().isEmpty()){
            portfolio.setId(null);
        }

        System.out.println("save portfolio with id and userId: " + portfolio);
        return portfolioRepository.save(portfolio);
    }

    // userId(email)로 포트폴리오 조회
    @GetMapping("/view/{userId}")
    public ResponseEntity<Portfolio> getPublicPortfolioByUserId(@PathVariable String userId){
        return portfolioRepository.findByUserId(userId)
                .map(ResponseEntity::ok)// 데이터 존재시 200
                .orElse(ResponseEntity.notFound().build()); // 없을시 404
    }

    // 포트폴리오 삭제
    @PostMapping("/delete")
    public Map<String, Object> deletePublicPortfolioByUserId(@RequestBody Portfolio portfolio, @AuthenticationPrincipal OAuth2User oAuth2User){
        Map<String, Object> returnMap = new HashMap<>();
        int returnCode = 1;
        String msg;

        // 지금 로그인한 유저가 맞는지 유저 검증
        String loginUserId = oAuth2User.getAttribute("email");
        if(!(portfolio.getUserId().equals(loginUserId))){
            returnCode = 5000; // user 정보 없음
            msg = "user info not valid";

            returnMap.put("returnCode", returnCode);
            returnMap.put("msg", msg);

            return returnMap;
        }

        // 수정내용 반영
        portfolioRepository.delete(portfolio);
        returnMap.put("returnCode", returnCode);
        return returnMap;
    }

    @GetMapping("/all")
    public List<Portfolio> getAllPortfolios(){
        return portfolioRepository.findAll();
    }

    @GetMapping("/search")
    public List<Portfolio> searchPortfoliosBySkill(@RequestParam String skills){

        System.out.println("are you here???" + skills);
        return portfolioRepository.findBySkillsContains(skills);
    }




}
