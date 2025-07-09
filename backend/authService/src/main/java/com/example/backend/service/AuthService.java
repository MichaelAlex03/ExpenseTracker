package com.example.backend.service;

import com.example.backend.dto.LoginDto;
import com.example.backend.dto.RegisterDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public Boolean doesUserExist(String email){
        Optional<User> user = userRepository.findByUserEmail(email);
        return user.isPresent();
    }


    public User signUp(RegisterDto registerDto){
        if(!doesUserExist(registerDto.getEmail())){
            User newUser = new User(
                    registerDto.getFirstName(),
                    registerDto.getLastName(),
                    passwordEncoder.encode(registerDto.getPassword()),
                    registerDto.getEmail()
            );

            return userRepository.save(newUser);
        }

        throw new RuntimeException("User already exists");
    }

    public User login(LoginDto loginDto){
        User user = userRepository.findByUserEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        return userRepository.save(user);
    }




}
