package com.about.portfolio.repository;

import com.about.portfolio.domain.Portfolio;
import org.springframework.data.mongodb.repository.MongoRepository; // 기본적인 CRUD 상속

import java.util.Optional;

public interface PortfolioRepository extends MongoRepository<Portfolio, String> {

    // userId를 통해 포트폴리오 검색
    Optional<Portfolio> findByUserId(String userId);

}
