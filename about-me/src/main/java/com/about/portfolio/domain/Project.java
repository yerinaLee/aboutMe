package com.about.portfolio.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Project {
    private String title;
    private String description;
    private String url; // 프로젝트 링크
    private List<String> techStack; // 프로젝트에 사용된 기술 목록
}
