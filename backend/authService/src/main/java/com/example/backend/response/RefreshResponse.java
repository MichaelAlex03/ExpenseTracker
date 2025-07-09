package com.example.backend.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshResponse {
    private String email;
    private Integer userId;
    private String accessToken;

    public RefreshResponse(String email, Integer userId, String accessToken){
        this.email = email;
        this.userId = userId;
        this.accessToken = accessToken;
    }
}
