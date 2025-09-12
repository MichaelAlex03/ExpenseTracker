package com.example.backend.controller;

import com.example.backend.dto.LoginDto;
import com.example.backend.dto.RegisterDto;
import com.example.backend.model.User;
import com.example.backend.response.LoginResponse;
import com.example.backend.response.RefreshResponse;
import com.example.backend.service.AuthService;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    private final JwtService jwtService;

    private final UserService userService;

    public AuthController(AuthService authService, JwtService jwtService, UserService userService){
        this.authService = authService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginDto loginDto, HttpServletResponse response){
        User user = authService.login(loginDto);
        String accessToken = jwtService.generateToken(user);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", user.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/auth/refresh")
                .maxAge(Duration.ofDays(1))
                .sameSite("None")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new LoginResponse(
                        user.getUserEmail(),
                        user.getId(),
                        accessToken
                ));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody RegisterDto registerDto){
        authService.signUp(registerDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User Created");
    }

    @GetMapping("/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(@CookieValue("refreshToken") String refreshToken, HttpServletResponse response){

        String email = jwtService.extractUsername(refreshToken);
        Optional<User> user = userService.getUserInfo(email);

        String accessToken = "";
        User existingUser = new User();

        if(user.isPresent()){
            existingUser = user.get();
            boolean valid = jwtService.isTokenValid(refreshToken, existingUser);
            if(valid){
               accessToken = jwtService.generateToken(existingUser);
            }
        } else {
            throw new RuntimeException("Refresh token not valid");
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new RefreshResponse(
                        existingUser.getUserEmail(),
                        existingUser.getId(),
                        accessToken
                ));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String email){
        authService.logout(email);
        return ResponseEntity.ok("Logged Out");
    }


}
