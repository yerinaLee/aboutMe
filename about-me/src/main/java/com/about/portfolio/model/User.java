package com.about.portfolio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Document(collection = "users") // mongoDB users 컬렉션 매핑
public class User {

    @Id // MongoDB id 필드로 사용
    private String id;
    private String email;
    private String name;
    private String picture; // 프로필 사진 url
    private String role;
}
