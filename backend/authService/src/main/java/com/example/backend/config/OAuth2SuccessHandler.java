package com.example.backend.config;

import com.example.backend.model.User;
import com.example.backend.service.GithubEmailService;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;

import java.io.IOException;
import java.time.Duration;

@Component

public class OAuth2SuccessHandler implements AuthenticationSuccessHandler{
    private final JwtService jwtService;

    private final UserService userService;

    private final GithubEmailService githubEmailService;

    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2SuccessHandler(JwtService jwtService,
                                UserService userService,
                                GithubEmailService githubEmailService,
                                OAuth2AuthorizedClientService authorizedClientService){
        this.jwtService = jwtService;
        this.userService = userService;
        this.githubEmailService = githubEmailService;
        this.authorizedClientService = authorizedClientService;

    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();

        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
        String email = oauthUser.getAttribute("email");

        if ("github".equals(registrationId) && (email == null || email.isEmpty())) {
            OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                    registrationId,
                    oauthToken.getName()
            );
            if (authorizedClient != null) {
                String accessToken = authorizedClient.getAccessToken().getTokenValue();
                email = githubEmailService.fetchEmail(accessToken);
            }
        }

        String accessToken = jwtService.generateTokenOAuth(email);
        String refreshToken = jwtService.generateRefreshTokenOAuth(email);

        Integer userId;
        if (!userService.doesUserExist(email)){
            User newOAuthUser = userService.registerOAuthUser(email, refreshToken);
            userId = newOAuthUser.getId();
        } else {
            userId = userService.getUserId(email);
        }


        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/auth/refresh")
                .maxAge(Duration.ofDays(1))
                .sameSite("None")
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/success")
                .queryParam("accessToken", accessToken)
                .queryParam("email", email)
                .queryParam("userId", userId)
                .build().toUriString();

        response.sendRedirect(redirectUrl);

    }
}
