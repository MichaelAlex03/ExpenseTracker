package com.example.backend.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String email;
    private Integer userId;
    private String accessToken;

    public LoginResponse(String email, Integer userId, String accessToken){
        this.email = email;
        this.userId = userId;
        this.accessToken = accessToken;
    }
}
