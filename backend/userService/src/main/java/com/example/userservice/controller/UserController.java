package com.example.userservice.controller;

import com.example.userservice.dto.UpdateUserDto;
import com.example.userservice.model.User;
import com.example.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping
    public Optional<User> getUser(@RequestParam String email){
        System.out.println("HERE");
        return userService.getUserInfo(email);
    }

    @PatchMapping
    public ResponseEntity<String> updateUser(@RequestBody UpdateUserDto input){
        userService.updateUser(input);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("User updated");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(@RequestParam String email){
        userService.deleteUser(email);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("User updated");
    }
}
