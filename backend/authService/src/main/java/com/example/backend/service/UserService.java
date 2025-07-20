package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public Optional<User> getUserInfo(String email){
        return userRepository.findByUserEmail(email);
    }

    public Boolean doesUserExist(String email){
        Optional<User> user = userRepository.findByUserEmail(email);
        return user.isPresent();
    }

    public void registerOAuthUser(String email, String refreshToken){
        User newOAuthUser = new User(
                null,
                null,
                null,
                email
        );
        newOAuthUser.setRefreshToken(refreshToken);
        userRepository.save(newOAuthUser);
    }
}
