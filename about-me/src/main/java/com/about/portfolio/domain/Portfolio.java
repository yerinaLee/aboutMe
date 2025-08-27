package com.about.portfolio.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "portfolios") // MongoDB에서 "portfolios"라는 컬렉션(테이블)에 저장
public class Portfolio {

    @Id
    private String id; // DB id
    private String userId;
    private String title; // 포트폴리오 제목
    private String description;

    @Override
    public String toString() {
        return "Portfolio{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
