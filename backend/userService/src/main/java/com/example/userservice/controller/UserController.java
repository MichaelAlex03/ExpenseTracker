package com.example.userservice.controller;

import com.example.userservice.dto.UpdateUserDto;
import com.example.userservice.model.User;
import com.example.userservice.responses.UserFetchResponse;
import com.example.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserFetchResponse> getUser(@RequestParam String email){
        System.out.println("HERE");
        Optional<User> user = userService.getUserInfo(email);
        if (user.isPresent()){
            User userInfo = user.get();
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new UserFetchResponse(
                            userInfo.getFirstName(),
                            userInfo.getLastName(),
                            userInfo.getUserEmail(),
                            userInfo.getPhoneNumber(),
                            userInfo.getDateOfBirth(),
                            userInfo.getOccupation(),
                            userInfo.getLocation()
                    ));
        }

        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User not found in system");
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
