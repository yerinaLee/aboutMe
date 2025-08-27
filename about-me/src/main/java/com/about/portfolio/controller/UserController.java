package com.about.portfolio.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/info") // google auth로 로그인한 user 정보 반환
    public OAuth2User getUserInfo(@AuthenticationPrincipal OAuth2User user){
        /*{
            "authorities": [
                {
                    "authority": "OAUTH2_USER",
                    "attributes": {
                        "sub": "106989961992096333369",
                        "name": "ri ye",
                        "given_name": "ri",
                        "family_name": "ye",
                        "picture": "https://lh3.googleusercontent.com/a/ACg8ocJoSjto-WiLHnua0Da7spjssNCSOCm-zPg-LflKMKuHVr_Y-w=s96-c",
                        "email": "yeri042924@gmail.com",
                        "email_verified": true
                    },
                    "userNameAttributeName": "sub"
                },
                {
                    "authority": "SCOPE_https://www.googleapis.com/auth/userinfo.email"
                },
                {
                    "authority": "SCOPE_https://www.googleapis.com/auth/userinfo.profile"
                },
                {
                    "authority": "SCOPE_openid"
                }
            ],
            "attributes": {
                "sub": "106989961992096333369",
                "name": "ri ye",
                "given_name": "ri",
                "family_name": "ye",
                "picture": "https://lh3.googleusercontent.com/a/ACg8ocJoSjto-WiLHnua0Da7spjssNCSOCm-zPg-LflKMKuHVr_Y-w=s96-c",
                "email": "yeri042924@gmail.com",
                "email_verified": true
            },
            "name": "106989961992096333369"
        }*/
        return user;
    }
}
