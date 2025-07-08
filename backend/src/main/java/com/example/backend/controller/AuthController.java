package com.example.backend.controller;

import com.example.backend.service.AuthService;
import com.example.backend.service.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    private final UserService userService;

    public AuthController(AuthService authService, UserService userService){
        this.authService = authService;
        this.userService = userService;
    }
}
