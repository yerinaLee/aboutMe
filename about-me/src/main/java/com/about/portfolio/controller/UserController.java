package com.about.portfolio.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/user/info") // google auth로 로그인한 user 정보 반환
    public OAuth2User getUserInfo(@AuthenticationPrincipal OAuth2User user){
        return user;
    }

}
