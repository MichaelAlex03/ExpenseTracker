package com.example.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GithubEmailService {

    private final RestTemplate restTemplate;

    public GithubEmailService(){
        this.restTemplate = new RestTemplate();
    }

    public String fetchEmail(String accessToken){
        String url = "https://api.github.com/user/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                List.class
        );

        List<Map<String, Object>> emails= response.getBody();

        if(emails == null){
            return null;
        }

        for (Map<String, Object> emailEntry : emails){
            Boolean primary = (Boolean) emailEntry.get("primary");
            Boolean verified = (Boolean) emailEntry.get("verified");
            String email = (String) emailEntry.get("email");

            if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified)){
                return email;
            }
        }

        for (Map<String, Object> emailEntry : emails) {
            Boolean verified = (Boolean) emailEntry.get("verified");
            String email = (String) emailEntry.get("email");

            if (Boolean.TRUE.equals(verified)) {
                return email;
            }
        }

        return null;
    }
}
